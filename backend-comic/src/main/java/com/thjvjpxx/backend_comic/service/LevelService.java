package com.thjvjpxx.backend_comic.service;

import org.springframework.web.multipart.MultipartFile;

import com.thjvjpxx.backend_comic.dto.request.LevelRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;

public interface LevelService {
    BaseResponse<?> getAllLevel();

    BaseResponse<?> createLevel(LevelRequest request, MultipartFile file);

    BaseResponse<?> updateLevel(String id, LevelRequest request, MultipartFile file);

    BaseResponse<?> deleteLevel(String id);
}
