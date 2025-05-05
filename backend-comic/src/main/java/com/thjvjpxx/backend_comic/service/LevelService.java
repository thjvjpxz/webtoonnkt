package com.thjvjpxx.backend_comic.service;

import org.springframework.web.multipart.MultipartFile;

import com.thjvjpxx.backend_comic.dto.request.LevelRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.model.Level;

public interface LevelService {
    BaseResponse<?> getLevelWithPagination(int page, int limit, String search);

    BaseResponse<?> getAllLevel();

    BaseResponse<?> createLevel(LevelRequest request, MultipartFile file);

    BaseResponse<?> updateLevel(String id, LevelRequest request, MultipartFile file);

    BaseResponse<?> deleteLevel(String id);

    Level getLevelDefaultUser();

    Level getLevelById(String id);

    BaseResponse<?> getLevelByType(String levelTypeId);
}
