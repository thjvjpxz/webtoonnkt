package com.thjvjpxx.backend_comic.service;

import org.springframework.web.multipart.MultipartFile;

import com.thjvjpxx.backend_comic.dto.response.BaseResponse;

public interface StorageService {
    BaseResponse<?> uploadFile(MultipartFile file, String type, String fileName);

    BaseResponse<?> uploadFileToFolder(MultipartFile file, String fileName, String folderId);

    BaseResponse<?> remove(String fileId);

    String createFolder(String folderName, String parentFolderId);

    BaseResponse<?> getFilesAndFolders(String folderId);

    String getFileId(String fileName, String folderId);
}
