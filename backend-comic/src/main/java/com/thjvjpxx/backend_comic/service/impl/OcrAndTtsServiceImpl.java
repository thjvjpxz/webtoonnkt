package com.thjvjpxx.backend_comic.service.impl;

import org.springframework.stereotype.Service;

import com.thjvjpxx.backend_comic.dto.request.OcrAndTtsRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
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

    @Override
    public BaseResponse<?> ocrAndTts(OcrAndTtsRequest request) {
        return BaseResponse.success("success");
    }

}
