package com.thjvjpxx.backend_comic.service;

import org.springframework.web.multipart.MultipartFile;

import com.thjvjpxx.backend_comic.dto.response.BaseResponse;

public interface StorageService {
    BaseResponse<?> uploadFile(MultipartFile file, String typeFolder, String fileName);

    BaseResponse<?> remove(String url);

    BaseResponse<?> rename(String url, String newName);
}