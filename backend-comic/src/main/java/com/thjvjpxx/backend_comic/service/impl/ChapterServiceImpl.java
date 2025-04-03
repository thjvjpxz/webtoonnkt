package com.thjvjpxx.backend_comic.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.thjvjpxx.backend_comic.dto.request.ChapterRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.dto.response.ChapterResponse;
import com.thjvjpxx.backend_comic.mapper.ChapterMapper;
import com.thjvjpxx.backend_comic.model.Chapter;
import com.thjvjpxx.backend_comic.repository.ChapterRepository;
import com.thjvjpxx.backend_comic.service.ChapterService;
import com.thjvjpxx.backend_comic.utils.PaginationUtils;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ChapterServiceImpl implements ChapterService {
    ChapterRepository chapterRepository;
    ChapterMapper chapterMapper;

    @Override
    public BaseResponse<?> getAllChapters(int page, int limit, String search) {
        Pageable pageForQuery = PaginationUtils.createPageable(page, limit);
        int originalPage = page;

        Page<Chapter> chapters = null;
        if (search != null && !search.isEmpty()) {
            chapters = chapterRepository.findByTitleContaining(search, pageForQuery);
        } else {
            chapters = chapterRepository.findAll(pageForQuery);
        }

        List<Chapter> chapterList = chapters.getContent();
        List<ChapterResponse> chapterResponses = chapterList.stream()
                .map(chapterMapper::toChapterResponse)
                .collect(Collectors.toList());

        return BaseResponse.success(
                chapterResponses,
                originalPage,
                (int) chapters.getTotalElements(),
                limit,
                chapters.getTotalPages());
    }

    @Override
    public BaseResponse<?> createChapter(ChapterRequest chapterRequest, List<MultipartFile> files) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'createChapter'");
    }

    @Override
    public BaseResponse<?> updateChapter(String id, ChapterRequest chapterRequest, List<MultipartFile> files) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'updateChapter'");
    }

    @Override
    public BaseResponse<?> deleteChapter(String id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'deleteChapter'");
    }

}
