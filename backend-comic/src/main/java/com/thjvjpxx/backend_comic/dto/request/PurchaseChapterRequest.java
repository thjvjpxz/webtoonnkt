package com.thjvjpxx.backend_comic.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PurchaseChapterRequest {

    @NotBlank(message = "CHAPTER_COMIC_ID_NOT_EMPTY")
    String chapterId;
}