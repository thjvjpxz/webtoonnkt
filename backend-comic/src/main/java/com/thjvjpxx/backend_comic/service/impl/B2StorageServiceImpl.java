package com.thjvjpxx.backend_comic.service.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.thjvjpxx.backend_comic.constant.B2Constants;
import com.thjvjpxx.backend_comic.constant.GlobalConstants;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.enums.ErrorCode;
import com.thjvjpxx.backend_comic.exception.BaseException;
import com.thjvjpxx.backend_comic.service.B2StorageService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.CommonPrefix;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Request;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Response;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Object;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class B2StorageServiceImpl implements B2StorageService {
    final S3Client s3Client;

    @Value("${b2.bucket-name}")
    String bucketName;

    @Override
    public BaseResponse<?> uploadFile(MultipartFile file, String type, String fileName) {
        String folderKey;
        switch (type) {
            case GlobalConstants.TYPE_THUMBNAIL:
                folderKey = B2Constants.FOLDER_KEY_THUMBNAIL;
                break;
            case GlobalConstants.TYPE_COMIC:
                folderKey = B2Constants.FOLDER_KEY_COMIC;
                break;
            case GlobalConstants.TYPE_LEVEL:
                folderKey = B2Constants.FOLDER_KEY_LEVEL;
                break;
            case GlobalConstants.TYPE_AVATAR:
                folderKey = B2Constants.FOLDER_KEY_AVATAR;
                break;
            default:
                throw new BaseException(ErrorCode.TYPE_NOT_FOUND);
        }
        return uploadFileToFolder(file, fileName, folderKey);
    }

    @Override
    public BaseResponse<?> uploadFileToFolder(MultipartFile file, String fileName, String folderKey) {
        if (file.isEmpty()) {
            throw new BaseException(ErrorCode.FILE_NOT_FOUND);
        }

        String key = folderKey + "/" + fileName;
        try {
            s3Client.putObject(
                    PutObjectRequest.builder()
                            .bucket(bucketName)
                            .key(key)
                            .contentType(file.getContentType())
                            .build(),
                    RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

            String url = getPublicUrl(key);
            return BaseResponse.success(url);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public BaseResponse<?> remove(String fileKey) {
        System.out.println("fileKey: " + fileKey);
        try {
            s3Client.deleteObject(DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileKey)
                    .build());

            return BaseResponse.success("Xoá file thành công");
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public String createFolder(String folderName, String parentFolderKey) {
        String key = parentFolderKey + "/" + folderName + "/";

        // S3 doesn't have true folders, but we can create a zero-byte object with a
        // trailing slash
        s3Client.putObject(
                PutObjectRequest.builder()
                        .bucket(bucketName)
                        .key(key)
                        .build(),
                RequestBody.empty());

        return key;
    }

    @Override
    public BaseResponse<?> getFilesAndFolders(String folderKey) {
        if (folderKey == null || folderKey.isEmpty()) {
            throw new BaseException(ErrorCode.INVALID_ARGUMENT);
        }

        try {
            if (!folderKey.endsWith("/")) {
                folderKey = folderKey + "/";
            }

            ListObjectsV2Request request = ListObjectsV2Request.builder()
                    .bucket(bucketName)
                    .prefix(folderKey)
                    .delimiter("/")
                    .build();

            ListObjectsV2Response response = s3Client.listObjectsV2(request);

            List<Map<String, Object>> items = new ArrayList<>();

            // Add folders
            if (response.commonPrefixes() != null) {
                for (CommonPrefix prefix : response.commonPrefixes()) {
                    String name = prefix.prefix();
                    // Extract folder name from the prefix
                    name = name.substring(folderKey.length(), name.length() - 1);

                    Map<String, Object> item = new HashMap<>();
                    item.put("id", prefix.prefix());
                    item.put("name", name);
                    item.put("isFolder", true);
                    items.add(item);
                }
            }

            // Add files
            if (response.contents() != null) {
                for (S3Object object : response.contents()) {
                    // Skip the folder placeholder object
                    if (object.key().equals(folderKey)) {
                        continue;
                    }

                    String name = object.key().substring(folderKey.length());
                    if (name.isEmpty()) {
                        continue;
                    }

                    Map<String, Object> item = new HashMap<>();
                    item.put("id", object.key());
                    item.put("name", name);
                    item.put("isFolder", false);
                    item.put("webViewLink", getPublicUrl(object.key()));
                    items.add(item);
                }
            }

            return BaseResponse.success(items);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public String getFileId(String fileName, String folderKey) {
        if (fileName == null || fileName.isEmpty()) {
            throw new BaseException(ErrorCode.INVALID_ARGUMENT);
        }

        var response = getFilesAndFolders(folderKey);
        if (response.getStatus() != HttpStatus.OK.value()) {
            throw new BaseException(ErrorCode.INTERNAL_SERVER_ERROR);
        }

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> items = (List<Map<String, Object>>) response.getData();
        for (Map<String, Object> item : items) {
            if (item.get("name").equals(fileName) && !(boolean) item.get("isFolder")) {
                return item.get("id").toString();
            }
        }
        return null;
    }

    private String getPublicUrl(String key) {
        return B2Constants.URL_PREFIX + bucketName + "/" + key;
    }
}
