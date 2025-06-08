package com.thjvjpxx.backend_comic.service.impl;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.thjvjpxx.backend_comic.constant.B2Constants;
import com.thjvjpxx.backend_comic.constant.GlobalConstants;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.enums.ErrorCode;
import com.thjvjpxx.backend_comic.exception.BaseException;
import com.thjvjpxx.backend_comic.service.StorageService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.CopyObjectRequest;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StorageServiceImpl implements StorageService {
    final S3Client s3Client;

    @Value("${b2.bucket-name}")
    String bucketName;

    @Override
    public BaseResponse<?> uploadFile(MultipartFile file, String typeFolder, String fileName) {
        String folderName;
        switch (typeFolder) {
            case GlobalConstants.TYPE_THUMBNAIL:
                folderName = B2Constants.FOLDER_KEY_THUMBNAIL;
                break;
            case GlobalConstants.TYPE_COMIC:
                folderName = B2Constants.FOLDER_KEY_COMIC;
                break;
            case GlobalConstants.TYPE_LEVEL:
                folderName = B2Constants.FOLDER_KEY_LEVEL;
                break;
            case GlobalConstants.TYPE_AVATAR:
                folderName = B2Constants.FOLDER_KEY_AVATAR;
                break;
            default:
                throw new BaseException(ErrorCode.TYPE_NOT_FOUND);
        }
        return uploadFileToFolder(file, fileName, folderName);
    }

    private BaseResponse<?> uploadFileToFolder(MultipartFile file, String fileName, String folderKey) {
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
            throw new BaseException(ErrorCode.UPLOAD_FILE_FAILED);
        }
    }

    @Override
    public BaseResponse<?> remove(String url) {
        try {
            String actualKey = url;
            if (url.startsWith(B2Constants.URL_PREFIX)) {
                String urlWithoutPrefix = url.substring(B2Constants.URL_PREFIX.length());
                String expectedPrefix = bucketName + "/";
                if (urlWithoutPrefix.startsWith(expectedPrefix)) {
                    actualKey = urlWithoutPrefix.substring(expectedPrefix.length());
                } else {
                    throw new BaseException(ErrorCode.INVALID_ARGUMENT);
                }
            }

            s3Client.deleteObject(DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(actualKey)
                    .build());

            return BaseResponse.success("Xoá file thành công");
        } catch (Exception e) {
            throw new BaseException(ErrorCode.DELETE_FILE_FAILED);
        }
    }

    private String getPublicUrl(String key) {
        return B2Constants.URL_PREFIX + bucketName + "/" + key;
    }

    @Override
    public BaseResponse<?> rename(String url, String newName) {
        try {
            // Lấy key cũ từ URL
            String oldKey = url;
            if (url.startsWith(B2Constants.URL_PREFIX)) {
                String urlWithoutPrefix = url.substring(B2Constants.URL_PREFIX.length());
                String expectedPrefix = bucketName + "/";
                if (urlWithoutPrefix.startsWith(expectedPrefix)) {
                    oldKey = urlWithoutPrefix.substring(expectedPrefix.length());
                } else {
                    throw new BaseException(ErrorCode.INVALID_ARGUMENT);
                }
            }

            // Tạo key mới bằng cách thay thế tên file trong đường dẫn
            String[] pathParts = oldKey.split("/");
            if (pathParts.length < 2) {
                throw new BaseException(ErrorCode.INVALID_ARGUMENT);
            }

            // Giữ nguyên folder path, chỉ thay đổi tên file
            StringBuilder newKeyBuilder = new StringBuilder();
            for (int i = 0; i < pathParts.length - 1; i++) {
                newKeyBuilder.append(pathParts[i]).append("/");
            }
            newKeyBuilder.append(newName);
            String newKey = newKeyBuilder.toString();

            // Copy object với key mới
            s3Client.copyObject(CopyObjectRequest.builder()
                    .sourceBucket(bucketName)
                    .sourceKey(oldKey)
                    .destinationBucket(bucketName)
                    .destinationKey(newKey)
                    .build());

            // Xóa object cũ
            s3Client.deleteObject(DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(oldKey)
                    .build());

            // Trả về URL mới
            String newUrl = getPublicUrl(newKey);
            return BaseResponse.success(newUrl);
        } catch (Exception e) {
            throw new BaseException(ErrorCode.RENAME_FILE_FAILED);
        }
    }
}
