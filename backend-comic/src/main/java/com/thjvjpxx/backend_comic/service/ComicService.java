package com.thjvjpxx.backend_comic.service;

import org.springframework.web.multipart.MultipartFile;

import com.thjvjpxx.backend_comic.dto.request.ComicRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;

public interface ComicService {
    BaseResponse<?> getAllComics(int page, int limit, String search, String status, String category);

    BaseResponse<?> getAllChapters(int page, int limit, String search, String status,
            String comicId);

    BaseResponse<?> createComic(ComicRequest comic, MultipartFile cover);

    BaseResponse<?> updateComic(String id, ComicRequest comic, MultipartFile cover);

    BaseResponse<?> deleteComic(String id);
}
