package com.thjvjpxx.backend_comic.dto.request;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ComicRequest {
    @NotBlank(message = "NAME_COMIC_NOT_EMPTY")
    String name;
    @NotBlank(message = "SLUG_COMIC_NOT_EMPTY")
    String slug;
    String description;
    String author;
    String status;
    String thumbUrl;
    String originName;
    List<String> categories;
}
