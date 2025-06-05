package com.thjvjpxx.backend_comic.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class WithdrawalRequestDto {

    @NotNull(message = "WITHDRAWAL_AMOUNT_INVALID")
    @DecimalMin(value = "10000.0", message = "WITHDRAWAL_AMOUNT_INVALID")
    Double amount;

    @NotBlank(message = "WITHDRAWAL_BANK_INFO_REQUIRED")
    @Size(max = 100, message = "WITHDRAWAL_BANK_INFO_REQUIRED")
    String bankName;

    @NotBlank(message = "WITHDRAWAL_BANK_INFO_REQUIRED")
    @Size(max = 50, message = "WITHDRAWAL_BANK_INFO_REQUIRED")
    String bankAccountNumber;

    @NotBlank(message = "WITHDRAWAL_BANK_INFO_REQUIRED")
    @Size(max = 100, message = "WITHDRAWAL_BANK_INFO_REQUIRED")
    String bankAccountName;
}