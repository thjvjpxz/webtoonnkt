package com.thjvjpxx.backend_comic.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

/**
 * DTO cho request crawler comic
 */
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CrawlerComicRequest {
    @NotNull
    @Min(value = 1)
    int startPage;
    @NotNull
    int endPage;
    @NotNull
    boolean saveDrive;
}
