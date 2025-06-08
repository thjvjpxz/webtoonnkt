package com.thjvjpxx.backend_comic.dto.request;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DetailChapterRequest {
    String imgUrl;
    int orderNumber;
}
