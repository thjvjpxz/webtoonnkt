package com.thjvjpxx.backend_comic.service;

import com.thjvjpxx.backend_comic.model.DetailChapter;

public interface DetailChapterService {
    /**
     * Lưu url TTS vào database
     * 
     * @param ttsUrl        URL TTS
     * @param detailChapter detail chapter đã tồn tại trong database
     */
    void saveTtsContent(String ttsUrl, DetailChapter detailChapter);

    /**
     * Lưu nội dung OCR vào database
     * 
     * @param ocrContent    Nội dung OCR
     * @param detailChapter detail chapter đã tồn tại trong database
     */
    void saveOcrContent(String ocrContent, DetailChapter detailChapter);
}
