package com.thjvjpxx.backend_comic.dto.request;

import java.util.List;

import com.thjvjpxx.backend_comic.dto.otruyen.OTruyenResponse.OTruyenComic;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

/**
 * DTO cho request crawler comic từ danh sách OTruyenComic
 */
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CrawlerComicListRequest {
    @NotNull
    @NotEmpty
    List<OTruyenComic> comics;

    boolean saveDrive;
}