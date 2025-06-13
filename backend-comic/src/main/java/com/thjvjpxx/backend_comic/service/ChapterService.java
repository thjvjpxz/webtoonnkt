package com.thjvjpxx.backend_comic.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.thjvjpxx.backend_comic.dto.request.ChapterRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.model.User;

public interface ChapterService {

    BaseResponse<?> getAllChapters(int page, int limit, String search, String comicId);

    BaseResponse<?> createChapter(ChapterRequest chapterRequest, List<MultipartFile> files, User publisher);

    BaseResponse<?> updateChapter(String id, ChapterRequest chapterRequest, List<MultipartFile> files, User publisher);

    BaseResponse<?> deleteChapter(String id, User publisher);
}
