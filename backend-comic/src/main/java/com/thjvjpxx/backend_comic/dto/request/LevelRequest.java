package com.thjvjpxx.backend_comic.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LevelRequest {
    @NotBlank(message = "LEVEL_NUMBER_NOT_EMPTY")
    int levelNumber;

    @NotBlank(message = "LEVEL_NAME_NOT_EMPTY")
    String name;

    String color;

    @NotBlank(message = "EXP_REQUIRED_NOT_EMPTY")
    double expRequired;

    String urlGif;

    String levelTypeId;
}
