package com.thjvjpxx.backend_comic.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.thjvjpxx.backend_comic.constant.GoogleDriveConstants;
import com.thjvjpxx.backend_comic.dto.request.ComicRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.enums.ErrorCode;
import com.thjvjpxx.backend_comic.exception.BaseException;
import com.thjvjpxx.backend_comic.mapper.ComicMapper;
import com.thjvjpxx.backend_comic.model.Category;
import com.thjvjpxx.backend_comic.model.Comic;
import com.thjvjpxx.backend_comic.repository.CategoryRepository;
import com.thjvjpxx.backend_comic.repository.ComicRepository;
import com.thjvjpxx.backend_comic.service.ComicService;
import com.thjvjpxx.backend_comic.service.GoogleDriveService;
import com.thjvjpxx.backend_comic.utils.string;
import com.thjvjpxx.backend_comic.utils.validation;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ComicServiceImpl implements ComicService {
    ComicRepository comicRepository;
    ComicMapper comicMapper;
    CategoryRepository categoryRepository;
    GoogleDriveService googleDriveService;

    @Override
    public BaseResponse<List<Comic>> getAllComics(int page, int limit, String search, String status, String category) {
        page = page < 0 ? 0 : page;
        limit = limit < 0 ? 5 : limit;

        int originalPage = page;

        page = page == 0 ? 0 : page - 1;

        Pageable pageable = PageRequest.of(page, limit);
        Page<Comic> comics = null;
        if (search != null && !search.isEmpty()) {
            comics = comicRepository.findBySlugContainingOrNameContaining(search, search, pageable);
        } else if (status != null && !status.isEmpty()) {
            comics = comicRepository.findByStatus(status, pageable);
        } else if (category != null && !category.isEmpty()) {
            comics = comicRepository.findByCategory(category, pageable);
        } else {
            comics = comicRepository.findAll(pageable);
        }

        return BaseResponse.success(
                comics.getContent(),
                originalPage,
                (int) comics.getTotalElements(),
                limit,
                comics.getTotalPages());
    }

    @Override
    public BaseResponse<Comic> getComicById(String id) {
        validation.checkNullId(id);

        Comic comic = comicRepository.findById(id).orElseThrow(() -> new BaseException(ErrorCode.COMIC_NOT_FOUND));
        return BaseResponse.success(comic);
    }

    @Override
    public BaseResponse<Comic> createComic(ComicRequest comicRequest, MultipartFile cover) {
        validateComicRequest(comicRequest);
        if (cover != null) {
            var response = googleDriveService.uploadFile(cover, GoogleDriveConstants.TYPE_THUMBNAIL);
            if (response.getStatus() != HttpStatus.OK.value()) {
                throw new BaseException(ErrorCode.UPLOAD_FILE_FAILED);
            }
        }
        Comic comic = comicMapper.toComic(comicRequest);
        List<String> categories = comicRequest.getCategories();

        comic.addCategories(convertCategories(categories));

        comicRepository.save(comic);
        return BaseResponse.success(comic);
    }

    private List<Category> convertCategories(List<String> categories) {
        return categories.stream().map(
                category -> categoryRepository.findById(category)
                        .orElseThrow(() -> new BaseException(ErrorCode.CATEGORY_NOT_FOUND)))
                .collect(Collectors.toList());
    }

    private void validateComicRequest(ComicRequest comicRequest) {
        comicRepository.findBySlug(comicRequest.getSlug()).ifPresent(comic -> {
            throw new BaseException(ErrorCode.COMIC_SLUG_EXISTS);
        });
    }

    @Override
    public BaseResponse<Comic> updateComic(String id, ComicRequest comicRequest, MultipartFile cover) {
        validation.checkNullId(id);

        Comic comic = findComicById(id);

        if (comicRequest.getSlug() != null && !comicRequest.getSlug().isEmpty()
                && !comicRequest.getSlug().equals(comic.getSlug())) {
            validateComicRequest(comicRequest);
        }

        if (cover != null) {
            var response = googleDriveService.uploadFile(cover, GoogleDriveConstants.TYPE_THUMBNAIL);
            if (response.getStatus() != HttpStatus.OK.value()) {
                throw new BaseException(ErrorCode.UPLOAD_FILE_FAILED);
            }
        }

        List<Category> categoriesNew = convertCategories(comicRequest.getCategories());

        comic.removeCategories(comic.getCategories().stream().collect(Collectors.toList()));

        comic.addCategories(categoriesNew);
        comic.setSlug(comicRequest.getSlug());
        comic.setName(comicRequest.getName());
        comic.setDescription(comicRequest.getDescription());
        comic.setAuthor(comicRequest.getAuthor());
        comic.setStatus(comicRequest.getStatus());
        comic.setThumbUrl(comicRequest.getThumbUrl());
        comic.setOriginName(comicRequest.getOriginName());

        comicRepository.save(comic);
        return BaseResponse.success(comic);
    }

    private Comic findComicById(String id) {
        validation.checkNullId(id);
        return comicRepository.findById(id).orElseThrow(() -> new BaseException(ErrorCode.COMIC_NOT_FOUND));
    }

    @Override
    public BaseResponse<Comic> deleteComic(String id) {
        validation.checkNullId(id);

        Comic comic = findComicById(id);

        comic.removeCategories(new ArrayList<>(comic.getCategories()));

        googleDriveService.removeFile(string.getIdFromUrl(comic.getThumbUrl()));
        comicRepository.delete(comic);
        return BaseResponse.success(comic);
    }

}
