package com.thjvjpxx.backend_comic.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * DTO cho request ocr content
 */
@Data
public class OcrAndTtsRequest {
    @NotBlank(message = "REQUEST_BODY_INVALID")
    private String id;

    @NotBlank(message = "REQUEST_BODY_INVALID")
    private String ocrItems;

    private String pathAudio;

    @NotNull(message = "REQUEST_BODY_INVALID")
    private boolean hasBubble;
}
