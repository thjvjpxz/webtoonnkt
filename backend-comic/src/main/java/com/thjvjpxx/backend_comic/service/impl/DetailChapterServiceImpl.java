package com.thjvjpxx.backend_comic.service.impl;

import org.springframework.stereotype.Service;

import com.thjvjpxx.backend_comic.enums.ErrorCode;
import com.thjvjpxx.backend_comic.exception.BaseException;
import com.thjvjpxx.backend_comic.model.DetailChapter;
import com.thjvjpxx.backend_comic.repository.DetailChapterRepository;
import com.thjvjpxx.backend_comic.service.DetailChapterService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DetailChapterServiceImpl implements DetailChapterService {

    DetailChapterRepository detailChapterRepository;

    @Override
    public void saveTtsContent(String ttsUrl, DetailChapter detailChapter) {
        try {
            if (ttsUrl == null || ttsUrl.isEmpty()) {
                throw new BaseException(ErrorCode.REQUEST_BODY_INVALID);
            }
            detailChapter.setTtsUrl(ttsUrl);
            detailChapterRepository.save(detailChapter);
        } catch (Exception e) {
            e.printStackTrace();
            throw new BaseException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public void saveOcrContent(String ocrContent, DetailChapter detailChapter) {
        try {
            if (ocrContent == null || ocrContent.isEmpty()) {
                throw new BaseException(ErrorCode.REQUEST_BODY_INVALID);
            }
            detailChapter.setOcrContent(ocrContent);
            detailChapterRepository.save(detailChapter);
        } catch (Exception e) {
            e.printStackTrace();
            throw new BaseException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }
}
