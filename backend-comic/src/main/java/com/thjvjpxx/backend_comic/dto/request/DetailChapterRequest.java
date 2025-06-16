package com.thjvjpxx.backend_comic.dto.request;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

/**
 * DTO cho request chi tiết chapter
 */
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DetailChapterRequest {
    String imgUrl;
    int orderNumber;
}
