package com.thjvjpxx.backend_comic.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.thjvjpxx.backend_comic.constant.GoogleDriveConstants;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.service.GoogleDriveService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FileController {

    GoogleDriveService googleDriveService;

    @PostMapping("/upload/thumbnail")
    public BaseResponse<?> uploadComicThumbnail(@RequestBody MultipartFile file) {
        return googleDriveService.uploadFile(file, GoogleDriveConstants.FOLDER_ID_THUMBNAIL);
    }

    @PostMapping("/upload/level-gif")
    public BaseResponse<?> uploadLevelGif(@RequestBody MultipartFile file) {
        return googleDriveService.uploadFile(file, GoogleDriveConstants.FOLDER_ID_LEVEL);
    }

    // @GetMapping("/get-files-and-folders")
    // public BaseResponse<?> getFilesAndFolders() {
    // return googleDriveService.getFilesAndFolders();
    // }
}
