package com.thjvjpxx.backend_comic.service.impl;

import java.io.IOException;
import java.io.InputStream;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.google.api.client.http.InputStreamContent;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.model.File;
import com.google.api.services.drive.model.FileList;
import com.google.api.services.drive.model.Permission;
import com.thjvjpxx.backend_comic.constant.GoogleDriveConstants;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.enums.ErrorCode;
import com.thjvjpxx.backend_comic.exception.BaseException;
import com.thjvjpxx.backend_comic.service.GoogleDriveService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class GoogleDriveServiceImpl implements GoogleDriveService {
    final Drive driveService;

    @Value("${google-drive.folder-id}")
    String folderId; // Folder webtoon

    private BaseResponse<?> handleUploadFile(MultipartFile file, String folderId) {
        checkFile(file);

        try {
            InputStream inputStream = file.getInputStream();
            String mimeType = file.getContentType();
            String fileName = file.getOriginalFilename();
            String url = uploadInputStream(inputStream, mimeType, fileName, folderId);
            return BaseResponse.success(url);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private void checkFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new BaseException(ErrorCode.FILE_NOT_FOUND);
        }
    }

    private String uploadInputStream(InputStream inputStream, String mimeType, String fileName, String folderId)
            throws IOException {
        File fileMetadata = new File();
        fileMetadata.setName(fileName);
        fileMetadata.setParents(Collections.singletonList(folderId));

        InputStreamContent mediaContent = new InputStreamContent(mimeType, inputStream);

        File uploadedFile = driveService
                .files()
                .create(fileMetadata, mediaContent)
                .setFields("id")
                .execute();

        String url = "https://lh3.googleusercontent.com/d/" + uploadedFile.getId();
        return url;
    }

    @Override
    public BaseResponse<?> uploadFile(MultipartFile file, String type) {
        switch (type) {
            case GoogleDriveConstants.TYPE_THUMBNAIL:
                return handleUploadFile(file, GoogleDriveConstants.FOLDER_ID_THUMBNAIL);
            case GoogleDriveConstants.TYPE_COMIC:
                return handleUploadFile(file, GoogleDriveConstants.FOLDER_ID_COMIC);
            case GoogleDriveConstants.TYPE_LEVEL:
                return handleUploadFile(file, GoogleDriveConstants.FOLDER_ID_LEVEL);
            case GoogleDriveConstants.TYPE_AVATAR:
                return handleUploadFile(file, GoogleDriveConstants.FOLDER_ID_AVATAR);
            default:
                throw new BaseException(ErrorCode.TYPE_NOT_FOUND);
        }
    }

    @Override
    public BaseResponse<?> removeFile(String fileId) {
        try {
            driveService.files().delete(fileId).execute();
            return BaseResponse.success("Xoá file thành công");
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

    }

    @Override
    public BaseResponse<?> createFolder(String folderName) {
        File fileMetadata = new File();
        fileMetadata.setName(folderName);
        fileMetadata.setParents(Collections.singletonList(folderId));
        fileMetadata.setMimeType(GoogleDriveConstants.MIME_TYPE_FOLDER);

        try {
            File folder = driveService
                    .files()
                    .create(fileMetadata)
                    .setFields("id")
                    .execute();

            publicDrive(folder.getId());

            return BaseResponse.success(String.format("Tạo folder thành công: %s", folder.getName()));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private void publicDrive(String id) throws IOException {
        if (id == null || id.isEmpty()) {
            throw new BaseException(ErrorCode.INVALID_ARGUMENT);
        }
        Permission permission = new Permission();
        permission.setType(GoogleDriveConstants.PERMISSION_TYPE_ANYONE);
        permission.setRole(GoogleDriveConstants.PERMISSION_ROLE_READER);
        driveService.permissions().create(id, permission).execute();
    }

    @Override
    public BaseResponse<?> getFilesAndFolders() {
        if (folderId == null || folderId.isEmpty()) {
            throw new BaseException(ErrorCode.INVALID_ARGUMENT);
        }

        String query = String.format(GoogleDriveConstants.QUERY_ALL_IN_FOLDERS, folderId);
        String fields = "files(id, name, webViewLink)";

        try {
            FileList result = driveService.files().list()
                    .setQ(query)
                    .setFields(fields)
                    .setOrderBy("name")
                    .execute();

            List<File> files = result.getFiles();

            List<Map<String, Object>> items = files.stream().map(file -> {
                Map<String, Object> item = new HashMap<>();
                item.put("id", file.getId());
                item.put("name", file.getName());
                item.put("webViewLink", file.getWebViewLink());
                return item;
            }).collect(Collectors.toList());

            return BaseResponse.success(items);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
