package com.thjvjpxx.backend_comic.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

/**
 * DTO cho request thêm/sửa/xóa level type
 */
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LevelTypeRequest {
    @NotBlank(message = "LEVEL_NOT_EMPTY")
    String name;
}
