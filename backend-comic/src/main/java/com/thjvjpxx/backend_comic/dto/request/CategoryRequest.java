package com.thjvjpxx.backend_comic.dto.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CategoryRequest {

    @NotEmpty(message = "NAME_CATEGORY_NOT_EMPTY")
    String name;

    @NotEmpty(message = "SLUG_CATEGORY_NOT_EMPTY")
    String slug;
}
