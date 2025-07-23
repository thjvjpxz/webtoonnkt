package com.thjvjpxx.backend_comic.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.thjvjpxx.backend_comic.dto.request.OcrAndTtsRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.enums.ErrorCode;
import com.thjvjpxx.backend_comic.exception.BaseException;
import com.thjvjpxx.backend_comic.model.Chapter;
import com.thjvjpxx.backend_comic.model.DetailChapter;
import com.thjvjpxx.backend_comic.repository.ChapterRepository;
import com.thjvjpxx.backend_comic.repository.DetailChapterRepository;
import com.thjvjpxx.backend_comic.service.OcrAndTtsService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class OcrAndTtsServiceImpl implements OcrAndTtsService {
    DetailChapterRepository detailChapterRepository;
    ChapterRepository chapterRepository;

    @Override
    @Transactional
    public BaseResponse<?> ocrAndTts(List<OcrAndTtsRequest> requests) {
        // Kiểm tra danh sách requests không null và không rỗng
        if (requests == null || requests.isEmpty()) {
            throw new BaseException(ErrorCode.REQUEST_BODY_INVALID);
        }

        for (OcrAndTtsRequest request : requests) {
            processOcrAndTts(request);
        }

        return BaseResponse.success("Xử lý thành công OCR và TTS");
    }

    @Transactional
    private void processOcrAndTts(OcrAndTtsRequest request) {
        DetailChapter detailChapter = detailChapterRepository.findById(request.getId())
                .orElseThrow(() -> new BaseException(ErrorCode.CHAPTER_NOT_FOUND));

        detailChapter.setHasBubble(request.isHasBubble());
        detailChapter.setOcrContent(request.getOcrItems());
        detailChapter.setTtsUrl(request.getPathAudio());

        detailChapterRepository.save(detailChapter);

        updateChapterHasAudio(detailChapter.getChapter().getId(), request.isHasBubble());
    }

    @Transactional
    private void updateChapterHasAudio(String chapterId, boolean hasBubble) {
        Chapter chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new BaseException(ErrorCode.CHAPTER_NOT_FOUND));

        if (chapter.getHasAudio() == null || !chapter.getHasAudio()) {
            chapter.setHasAudio(hasBubble);
        }

        chapterRepository.save(chapter);
    }
}
