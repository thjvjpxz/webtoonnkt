package com.thjvjpxx.backend_comic.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TopupRequest {

    @NotNull(message = "TOPUP_AMOUNT_NOT_NULL")
    @Min(value = 1, message = "TOPUP_AMOUNT_MUST_BE_POSITIVE")
    Double amount; // Số linh thạch muốn nạp
}