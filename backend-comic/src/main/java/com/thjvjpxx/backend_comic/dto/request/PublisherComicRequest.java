package com.thjvjpxx.backend_comic.dto.request;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PublisherComicRequest {

    @NotBlank(message = "PUBLISHER_COMIC_NAME_NOT_EMPTY")
    @Size(max = 255, message = "PUBLISHER_COMIC_NAME_TOO_LONG")
    String name;

    @Size(max = 255, message = "PUBLISHER_COMIC_ORIGIN_NAME_TOO_LONG")
    String originName;

    @NotBlank(message = "PUBLISHER_COMIC_AUTHOR_NOT_EMPTY")
    @Size(max = 255, message = "PUBLISHER_COMIC_AUTHOR_TOO_LONG")
    String author;

    @Size(max = 1000, message = "PUBLISHER_COMIC_DESCRIPTION_TOO_LONG")
    String description;

    String thumbUrl;

    @NotNull(message = "PUBLISHER_COMIC_CATEGORIES_NOT_EMPTY")
    @Size(min = 1, message = "PUBLISHER_COMIC_CATEGORIES_MIN_ONE")
    List<String> categoryIds;
}