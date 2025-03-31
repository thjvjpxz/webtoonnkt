package com.thjvjpxx.backend_comic.service.impl;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.thjvjpxx.backend_comic.constant.GoogleDriveConstants;
import com.thjvjpxx.backend_comic.dto.request.LevelRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.enums.ErrorCode;
import com.thjvjpxx.backend_comic.exception.BaseException;
import com.thjvjpxx.backend_comic.mapper.LevelMapper;
import com.thjvjpxx.backend_comic.model.Level;
import com.thjvjpxx.backend_comic.model.LevelType;
import com.thjvjpxx.backend_comic.repository.LevelRepository;
import com.thjvjpxx.backend_comic.repository.LevelTypeRepository;
import com.thjvjpxx.backend_comic.service.GoogleDriveService;
import com.thjvjpxx.backend_comic.service.LevelService;
import com.thjvjpxx.backend_comic.utils.string;
import com.thjvjpxx.backend_comic.utils.validation;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class LevelServiceImpl implements LevelService {
    LevelRepository levelRepository;
    LevelMapper levelMapper;
    LevelTypeRepository levelTypeRepository;
    GoogleDriveService googleDriveService;

    private boolean isLevelExists(String levelName) {
        return levelRepository.existsByName(levelName);
    }

    @Override
    public BaseResponse<?> getAllLevel() {
        List<Level> levels = levelRepository.findAll();
        return BaseResponse.success(levels);
    }

    @Override
    public BaseResponse<?> createLevel(LevelRequest request, MultipartFile file) {
        if (isLevelExists(request.getName())) {
            throw new BaseException(ErrorCode.LEVEL_DUPLICATE);
        }

        String nameNormalize = string.generateSlug(request.getName());

        String urlGif = null;
        if (file != null) {
            var response = googleDriveService.uploadFile(file, GoogleDriveConstants.TYPE_LEVEL, nameNormalize);
            if (response.getStatus() != HttpStatus.OK.value()) {
                throw new BaseException(ErrorCode.UPLOAD_FILE_FAILED);
            }
            urlGif = response.getMessage();
        }
        Level level = levelMapper.toLevel(request);

        LevelType levelType = levelTypeRepository
                .findById(request.getLevelTypeId())
                .orElseThrow(() -> new BaseException(ErrorCode.LEVEL_TYPE_NOT_FOUND));
        level.setLevelType(levelType);
        level.setUrlGif(urlGif);

        levelRepository.save(level);
        return BaseResponse.success(level);
    }

    @Override
    public BaseResponse<?> updateLevel(String id, LevelRequest request, MultipartFile file) {
        validation.checkNullId(id);

        Level level = levelRepository.findById(id).orElseThrow(() -> new BaseException(ErrorCode.LEVEL_NOT_FOUND));

        if (isLevelExists(request.getName()) && !request.getName().equals(level.getName())) {
            throw new BaseException(ErrorCode.LEVEL_DUPLICATE);
        }

        String urlGif = level.getUrlGif();
        String nameNormalize = string.generateSlug(request.getName());
        if (file != null) {
            var response = googleDriveService.uploadFile(file, GoogleDriveConstants.TYPE_LEVEL, nameNormalize);
            if (response.getStatus() != HttpStatus.OK.value()) {
                throw new BaseException(ErrorCode.UPLOAD_FILE_FAILED);
            }
            urlGif = response.getMessage();
        }

        LevelType levelType = levelTypeRepository
                .findById(request.getLevelTypeId())
                .orElseThrow(() -> new BaseException(ErrorCode.LEVEL_TYPE_NOT_FOUND));

        level.setName(request.getName());
        level.setUrlGif(urlGif);
        level.setExpRequired(request.getExpRequired());
        level.setLevelType(levelType);
        level.setLevelNumber(request.getLevelNumber());
        level.setColor(request.getColor());

        levelRepository.save(level);

        return BaseResponse.success(level);
    }

    @Override
    public BaseResponse<?> deleteLevel(String id) {
        validation.checkNullId(id);

        Level level = levelRepository.findById(id).orElseThrow(() -> new BaseException(ErrorCode.LEVEL_NOT_FOUND));

        levelRepository.delete(level);

        return BaseResponse.success(level);
    }

}
