package com.thjvjpxx.backend_comic.dto.request;

import java.util.List;

import com.thjvjpxx.backend_comic.enums.ChapterStatus;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChapterRequest {

    @NotBlank(message = "CHAPTER_TITLE_NOT_EMPTY")
    String title;

    @NotNull(message = "CHAPTER_STATUS_NOT_NULL")
    ChapterStatus status;

    @Min(value = 0, message = "CHAPTER_NUMBER_NOT_MIN")
    int chapterNumber;

    @NotBlank(message = "CHAPTER_COMIC_ID_NOT_EMPTY")
    String comicId;

    @NotEmpty(message = "CHAPTER_DETAIL_CHAPTER_NOT_EMPTY")
    @Valid
    List<DetailChapterRequest> detailChapters;
}
