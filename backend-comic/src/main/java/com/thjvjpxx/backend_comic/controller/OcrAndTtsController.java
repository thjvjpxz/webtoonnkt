package com.thjvjpxx.backend_comic.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.thjvjpxx.backend_comic.dto.request.OcrAndTtsRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.service.OcrAndTtsService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequiredArgsConstructor
@RequestMapping("/ocr-tts")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OcrAndTtsController {

    OcrAndTtsService ocrAndTtsService;

    /**
     * Xử lý OCR và TTS
     * POST /ocr-tts
     * 
     * @param request DTO chứa thông tin OCR và TTS
     * @return Response chứa kết quả xử lý
     */
    @PostMapping
    public BaseResponse<?> ocrAndTts(@RequestBody OcrAndTtsRequest request) {
        return ocrAndTtsService.ocrAndTts(request);
    }
}
