package com.thjvjpxx.backend_comic.service.impl;

import java.util.List;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.thjvjpxx.backend_comic.constant.GlobalConstants;
import com.thjvjpxx.backend_comic.dto.request.LevelRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.enums.ErrorCode;
import com.thjvjpxx.backend_comic.exception.BaseException;
import com.thjvjpxx.backend_comic.model.Level;
import com.thjvjpxx.backend_comic.model.LevelType;
import com.thjvjpxx.backend_comic.repository.LevelRepository;
import com.thjvjpxx.backend_comic.repository.LevelTypeRepository;
import com.thjvjpxx.backend_comic.service.LevelService;
import com.thjvjpxx.backend_comic.service.StorageService;
import com.thjvjpxx.backend_comic.utils.FileUtils;
import com.thjvjpxx.backend_comic.utils.PaginationUtils;
import com.thjvjpxx.backend_comic.utils.StringUtils;
import com.thjvjpxx.backend_comic.utils.ValidationUtils;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class LevelServiceImpl implements LevelService {
    LevelRepository levelRepository;
    LevelTypeRepository levelTypeRepository;
    StorageService b2StorageService;

    private boolean isLevelExists(String levelName) {
        return levelRepository.existsByName(levelName);
    }

    @Override
    public BaseResponse<?> getLevelWithPagination(int page, int limit, String search) {
        Pageable pageable = PaginationUtils.createPageableWithSort(page, limit, "levelNumber", Sort.Direction.ASC);
        int originalPage = page;

        Page<Level> levels;
        if (search != null && !search.isEmpty()) {
            levels = levelRepository.findByNameContainingOrLevelTypeNameContaining(search, search, pageable);
        } else {
            levels = levelRepository.findAll(pageable);
        }

        return BaseResponse.success(
                levels.getContent(),
                originalPage,
                (int) levels.getTotalElements(),
                limit,
                levels.getTotalPages());
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

        String nameNormalize = StringUtils.generateSlug(request.getName());

        String urlGif = null;
        if (file != null) {
            var response = b2StorageService.uploadFile(file, GlobalConstants.TYPE_LEVEL,
                    nameNormalize);
            if (response.getStatus() != HttpStatus.OK.value()) {
                throw new BaseException(ErrorCode.UPLOAD_FILE_FAILED);
            }
            urlGif = response.getMessage();
        }
        Level level = Level.builder()
                .name(request.getName())
                .levelNumber(request.getLevelNumber())
                .expRequired(request.getExpRequired())
                .color(request.getColor())
                .urlGif(urlGif)
                .build();

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
        ValidationUtils.checkNullId(id);

        Level level = levelRepository.findById(id).orElseThrow(() -> new BaseException(ErrorCode.LEVEL_NOT_FOUND));

        if (isLevelExists(request.getName()) && !request.getName().equals(level.getName())) {
            throw new BaseException(ErrorCode.LEVEL_DUPLICATE);
        }

        String urlGif = level.getUrlGif();
        String newName = request.getName();

        String nameNormalize = StringUtils.generateSlug(newName);
        if (file != null) {
            var response = b2StorageService.uploadFile(file, GlobalConstants.TYPE_LEVEL,
                    nameNormalize);
            if (response.getStatus() != HttpStatus.OK.value()) {
                throw new BaseException(ErrorCode.UPLOAD_FILE_FAILED);
            }
            urlGif = response.getMessage();
        } else if (!nameNormalize.equals(StringUtils.generateSlug(level.getName()))) {
            var response = b2StorageService.rename(level.getUrlGif(), nameNormalize);
            if (response.getStatus() != HttpStatus.OK.value()) {
                throw new BaseException(ErrorCode.RENAME_FILE_FAILED);
            }
            urlGif = response.getMessage();
        }

        LevelType levelType = levelTypeRepository
                .findById(request.getLevelTypeId())
                .orElseThrow(() -> new BaseException(ErrorCode.LEVEL_TYPE_NOT_FOUND));

        level.setName(newName);
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
        ValidationUtils.checkNullId(id);

        Level level = levelRepository.findById(id).orElseThrow(() -> new BaseException(ErrorCode.LEVEL_NOT_FOUND));

        FileUtils.deleteFileFromB2(level.getUrlGif(), b2StorageService);

        try {
            levelRepository.delete(level);
            return BaseResponse.success(level);
        } catch (DataIntegrityViolationException e) {
            throw new BaseException(ErrorCode.LEVEL_CANNOT_DELETE_IN_USE);
        }
    }

    @Override
    public Level getLevelDefaultUser() {
        int levelNumber = 1;
        LevelType levelType = levelTypeRepository.findByName("Không chọn")
                .orElseThrow(() -> new BaseException(ErrorCode.LEVEL_TYPE_NOT_FOUND));
        return levelRepository.findByLevelNumberAndLevelType(levelNumber, levelType)
                .orElseThrow(() -> new BaseException(ErrorCode.LEVEL_NOT_FOUND));
    }

    @Override
    public Level getLevelById(String id) {
        return levelRepository.findById(id)
                .orElseThrow(() -> new BaseException(ErrorCode.LEVEL_NOT_FOUND));
    }

    @Override
    public BaseResponse<?> getLevelByType(String levelTypeId) {
        LevelType levelType = levelTypeRepository.findById(levelTypeId)
                .orElseThrow(() -> new BaseException(ErrorCode.LEVEL_TYPE_NOT_FOUND));
        List<Level> levels = levelRepository.findByLevelTypeOrderByLevelNumberAsc(levelType)
                .orElseThrow(() -> new BaseException(ErrorCode.LEVEL_NOT_FOUND));
        return BaseResponse.success(levels);
    }
}
