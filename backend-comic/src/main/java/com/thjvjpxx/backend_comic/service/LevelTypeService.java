package com.thjvjpxx.backend_comic.service;

import com.thjvjpxx.backend_comic.dto.request.LevelTypeRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;

public interface LevelTypeService {
    BaseResponse<?> getAllLevelType();

    BaseResponse<?> createLevelType(LevelTypeRequest levelTypeRequest);

    BaseResponse<?> updateLevelType(String id, LevelTypeRequest levelTypeRequest);

    BaseResponse<?> deleteLevelType(String id);
}
