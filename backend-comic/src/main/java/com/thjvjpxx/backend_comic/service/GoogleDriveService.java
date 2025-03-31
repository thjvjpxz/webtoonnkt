package com.thjvjpxx.backend_comic.service;

import org.springframework.web.multipart.MultipartFile;

import com.thjvjpxx.backend_comic.dto.response.BaseResponse;

public interface GoogleDriveService {
    BaseResponse<?> uploadFile(MultipartFile file, String type, String fileName);

    BaseResponse<?> removeFile(String fileId);

    BaseResponse<?> createFolder(String folderName, String parentFolderId);

    BaseResponse<?> getFilesAndFolders(String folderId);

}
