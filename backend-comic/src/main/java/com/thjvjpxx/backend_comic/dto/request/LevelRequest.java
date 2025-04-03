package com.thjvjpxx.backend_comic.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LevelRequest {
    @NotNull(message = "LEVEL_NUMBER_NOT_EMPTY")
    @Min(value = 1, message = "LEVEL_NUMBER_NOT_MIN")
    int levelNumber;

    @NotBlank(message = "LEVEL_NAME_NOT_EMPTY")
    String name;

    String color;

    @NotNull(message = "LEVEL_EXP_REQUIRED_NOT_EMPTY")
    @Min(value = 0, message = "LEVEL_EXP_REQUIRED_NOT_MIN")
    double expRequired;

    String urlGif;

    String levelTypeId;
}
