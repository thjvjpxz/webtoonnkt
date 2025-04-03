package com.thjvjpxx.backend_comic.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DetailChapterRequest {

    @NotBlank(message = "DETAIL_CHAPTER_IMG_URL_NOT_EMPTY")
    String imgUrl;

    @Min(value = 0, message = "DETAIL_CHAPTER_ORDER_NUMBER_NOT_MIN")
    int orderNumber;
}
