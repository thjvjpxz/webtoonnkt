package com.thjvjpxx.backend_comic.dto.request;

import java.util.List;

import com.thjvjpxx.backend_comic.enums.ChapterStatus;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

/**
 * DTO cho request thêm/sửa/xóa chapter của publisher
 */
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PublisherChapterRequest {

    @NotBlank(message = "PUBLISHER_CHAPTER_TITLE_NOT_EMPTY")
    @Size(max = 255, message = "PUBLISHER_CHAPTER_TITLE_TOO_LONG")
    String title;

    @NotNull(message = "PUBLISHER_CHAPTER_NUMBER_INVALID")
    @DecimalMin(value = "0.1", message = "PUBLISHER_CHAPTER_NUMBER_INVALID")
    Double chapterNumber;

    @DecimalMin(value = "0.0", message = "PUBLISHER_CHAPTER_PRICE_INVALID")
    Double price = 0.0;

    @NotNull(message = "PUBLISHER_CHAPTER_STATUS_NOT_NULL")
    ChapterStatus status;

    @NotNull(message = "PUBLISHER_CHAPTER_IMAGES_NOT_EMPTY")
    @Size(min = 1, message = "PUBLISHER_CHAPTER_IMAGES_MIN_ONE")
    List<String> imageUrls;
}