package com.thjvjpxx.backend_comic.service;

import com.thjvjpxx.backend_comic.dto.request.LevelTypeRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.model.LevelType;

public interface LevelTypeService {
    BaseResponse<?> getAllLevelType();

    LevelType getLevelTypeByName(String name);

    BaseResponse<?> createLevelType(LevelTypeRequest levelTypeRequest);

    BaseResponse<?> updateLevelType(String id, LevelTypeRequest levelTypeRequest);

    BaseResponse<?> deleteLevelType(String id);
}
