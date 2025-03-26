package com.thjvjpxx.backend_comic.service;

import java.util.List;

import com.thjvjpxx.backend_comic.dto.request.ComicRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.model.Comic;

public interface ComicService {
    BaseResponse<List<Comic>> getAllComics(int page, int limit, String search);

    BaseResponse<Comic> getComicById(String id);

    BaseResponse<Comic> createComic(ComicRequest comic);

    BaseResponse<Comic> updateComic(String id, ComicRequest comic);

    BaseResponse<Comic> deleteComic(String id);
}
