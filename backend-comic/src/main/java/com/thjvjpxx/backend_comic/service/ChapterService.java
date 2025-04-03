package com.thjvjpxx.backend_comic.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.thjvjpxx.backend_comic.dto.request.ChapterRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;

public interface ChapterService {

    BaseResponse<?> getAllChapters(int page, int limit, String search);

    BaseResponse<?> createChapter(ChapterRequest chapterRequest, List<MultipartFile> files);

    BaseResponse<?> updateChapter(String id, ChapterRequest chapterRequest, List<MultipartFile> files);

    BaseResponse<?> deleteChapter(String id);
}
