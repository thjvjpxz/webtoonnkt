package com.thjvjpxx.backend_comic.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * DTO cho request ocr content
 */
@Data
public class OcrAndTtsRequest {
    @NotBlank(message = "REQUEST_BODY_INVALID")
    private String id;
    @NotBlank(message = "REQUEST_BODY_INVALID")
    private String ocr_items;
}
