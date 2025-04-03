package com.thjvjpxx.backend_comic.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.thjvjpxx.backend_comic.dto.request.LevelTypeRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.enums.ErrorCode;
import com.thjvjpxx.backend_comic.exception.BaseException;
import com.thjvjpxx.backend_comic.model.LevelType;
import com.thjvjpxx.backend_comic.repository.LevelTypeRepository;
import com.thjvjpxx.backend_comic.service.LevelTypeService;
import com.thjvjpxx.backend_comic.utils.ValidationUtils;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class LevelTypeServiceImpl implements LevelTypeService {
    LevelTypeRepository levelTypeRepository;

    private void validateLevelType(LevelTypeRequest levelTypeRequest) {
        if (levelTypeRequest.getName() == null || levelTypeRequest.getName().isEmpty()) {
            throw new BaseException(ErrorCode.LEVEL_TYPE_NOT_EMPTY);
        }
    }

    private void existLevelType(String name) {
        levelTypeRepository.findByName(name).ifPresent(lt -> {
            throw new BaseException(ErrorCode.LEVEL_TYPE_DUPLICATE);
        });
    }

    @Override
    public BaseResponse<?> getAllLevelType() {
        List<LevelType> levelTypes = levelTypeRepository.findAll();
        return BaseResponse.success(levelTypes);
    }

    private LevelType getLevelTypeById(String id) {
        ValidationUtils.checkNullId(id);

        return levelTypeRepository.findById(id)
                .orElseThrow(() -> new BaseException(ErrorCode.LEVEL_TYPE_NOT_FOUND));
    }

    @Override
    public BaseResponse<?> createLevelType(LevelTypeRequest levelTypeRequest) {
        validateLevelType(levelTypeRequest);
        String name = levelTypeRequest.getName();
        existLevelType(name);

        LevelType levelType = LevelType.builder()
                .name(name)
                .build();
        levelTypeRepository.save(levelType);
        return BaseResponse.success(levelType);
    }

    @Override
    public BaseResponse<?> updateLevelType(String id, LevelTypeRequest levelTypeRequest) {
        ValidationUtils.checkNullId(id);

        LevelType levelType = getLevelTypeById(id);

        if (levelType.getName().equals(levelTypeRequest.getName())) {
            validateLevelType(levelTypeRequest);
        }

        levelType.setName(levelTypeRequest.getName());
        levelTypeRepository.save(levelType);
        return BaseResponse.success(levelType);
    }

    @Override
    public BaseResponse<?> deleteLevelType(String id) {
        ValidationUtils.checkNullId(id);

        LevelType levelType = getLevelTypeById(id);
        levelTypeRepository.delete(levelType);
        return BaseResponse.success(levelType);
    }

}
