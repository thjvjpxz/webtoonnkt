package com.thjvjpxx.backend_comic.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.thjvjpxx.backend_comic.constant.GoogleDriveConstants;
import com.thjvjpxx.backend_comic.dto.request.ChapterRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.dto.response.ChapterResponse;
import com.thjvjpxx.backend_comic.enums.ErrorCode;
import com.thjvjpxx.backend_comic.exception.BaseException;
import com.thjvjpxx.backend_comic.mapper.ChapterMapper;
import com.thjvjpxx.backend_comic.model.Chapter;
import com.thjvjpxx.backend_comic.model.Comic;
import com.thjvjpxx.backend_comic.model.DetailChapter;
import com.thjvjpxx.backend_comic.repository.ChapterRepository;
import com.thjvjpxx.backend_comic.repository.ComicRepository;
import com.thjvjpxx.backend_comic.service.ChapterService;
import com.thjvjpxx.backend_comic.service.GoogleDriveService;
import com.thjvjpxx.backend_comic.utils.PaginationUtils;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ChapterServiceImpl implements ChapterService {
    ChapterRepository chapterRepository;
    ComicRepository comicRepository;
    ChapterMapper chapterMapper;
    GoogleDriveService googleDriveService;

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

    private void validateChapterRequest(ChapterRequest chapterRequest) {
        if (chapterRequest == null) {
            throw new BaseException(ErrorCode.CHAPTER_REQUEST_NOT_NULL);
        }
    }

    @Override
    public BaseResponse<?> createChapter(ChapterRequest chapterRequest, List<MultipartFile> files) {
        validateChapterRequest(chapterRequest);

        Chapter chapter = chapterMapper.toChapter(chapterRequest);
        Comic comic = comicRepository.findById(chapterRequest.getComicId())
                .orElseThrow(() -> new BaseException(ErrorCode.COMIC_NOT_FOUND));

        chapter.setComic(comic);

        List<DetailChapter> detailChapters = new ArrayList<>();

        String imgUrl = null;
        int orderNumber = 0;
        for (var file : files) {
            String fileName = String.format("img_%s", orderNumber);
            var response = googleDriveService.uploadFile(file, GoogleDriveConstants.TYPE_COMIC, fileName);

            if (response.getStatus() != HttpStatus.OK.value()) {
                throw new BaseException(ErrorCode.UPLOAD_FILE_FAILED);
            }

            imgUrl = response.getMessage();
            detailChapters.add(DetailChapter.builder()
                    .imgUrl(imgUrl)
                    .orderNumber(orderNumber)
                    .chapter(chapter)
                    .build());
            orderNumber++;
        }

        chapter.setDetailChapters(detailChapters);

        chapterRepository.save(chapter);

        return BaseResponse.success(chapterMapper.toChapterResponse(chapter));
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
