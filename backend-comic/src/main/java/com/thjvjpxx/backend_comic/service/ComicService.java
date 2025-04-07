package com.thjvjpxx.backend_comic.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.thjvjpxx.backend_comic.dto.request.ComicRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.dto.response.ChapterResponse;
import com.thjvjpxx.backend_comic.model.Comic;

public interface ComicService {
    BaseResponse<List<Comic>> getAllComics(int page, int limit, String search, String status, String category);

    BaseResponse<List<ChapterResponse>> getAllChapters(int page, int limit, String search, String status,
            String comicId);

    BaseResponse<Comic> getComicById(String id);

    BaseResponse<Comic> createComic(ComicRequest comic, MultipartFile cover);

    BaseResponse<Comic> updateComic(String id, ComicRequest comic, MultipartFile cover);

    BaseResponse<Comic> deleteComic(String id);
}
