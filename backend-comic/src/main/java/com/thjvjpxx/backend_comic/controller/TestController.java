package com.thjvjpxx.backend_comic.controller;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.thjvjpxx.backend_comic.constant.B2Constants;
import com.thjvjpxx.backend_comic.constant.GlobalConstants;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.service.StorageFactory;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/test")
@RequiredArgsConstructor
public class TestController {
    private final StorageFactory storageFactory;

    @GetMapping
    public BaseResponse<?> getFilesAndFolders() {
        return storageFactory.getStorageService().getFilesAndFolders(B2Constants.FOLDER_KEY_AVATAR);
    }

    @PostMapping
    public BaseResponse<?> uploadFile(@RequestParam("file") MultipartFile file) {
        return storageFactory.getStorageService().uploadFile(file, GlobalConstants.TYPE_AVATAR,
                file.getOriginalFilename());
    }

    @DeleteMapping
    public BaseResponse<?> deleteFile(@RequestParam("file") String file) {
        return storageFactory.getStorageService().remove(file);
    }
}
