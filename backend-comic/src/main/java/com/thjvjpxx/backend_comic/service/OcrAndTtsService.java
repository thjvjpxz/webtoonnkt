package com.thjvjpxx.backend_comic.service;

import com.thjvjpxx.backend_comic.dto.request.OcrAndTtsRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;

public interface OcrAndTtsService {
    /**
     * Xử lý OCR và TTS
     * 
     * @param request DTO chứa thông tin OCR và TTS
     * @return Response chứa kết quả xử lý
     */
    BaseResponse<?> ocrAndTts(OcrAndTtsRequest request);
}
