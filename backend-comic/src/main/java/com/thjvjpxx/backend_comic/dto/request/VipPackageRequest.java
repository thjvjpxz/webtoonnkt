package com.thjvjpxx.backend_comic.dto.request;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

/**
 * DTO cho request thêm/sửa/xóa gói VIP
 */
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VipPackageRequest {

    @NotEmpty(message = "VIP_PACKAGE_NAME_NOT_EMPTY")
    String name;

    String description;

    @NotNull(message = "ORIGINAL_PRICE_NOT_NULL")
    @Positive(message = "ORIGINAL_PRICE_MUST_BE_POSITIVE")
    Integer originalPrice; // Giá gốc bằng gem

    Integer discountedPrice; // % giá giảm

    LocalDateTime discountStartDate; // Bắt đầu giảm giá

    LocalDateTime discountEndDate; // Kết thúc giảm giá

    @NotNull(message = "DURATION_DAYS_NOT_NULL")
    @Positive(message = "DURATION_DAYS_MUST_BE_POSITIVE")
    Integer durationDays; // Thời hạn VIP (số ngày)

    /**
     * Validate logic cho discount
     */
    public boolean isDiscountValid() {
        // Nếu có giá giảm thì phải có cả start và end date
        if (discountedPrice != null && discountedPrice > 0) {
            if (discountStartDate == null || discountEndDate == null) {
                return false;
            }
            // Giá giảm phải nhỏ hơn giá gốc
            if (originalPrice != null && discountedPrice >= originalPrice) {
                return false;
            }
            // Ngày kết thúc phải sau ngày bắt đầu
            if (discountEndDate.isBefore(discountStartDate)) {
                return false;
            }
        }
        return true;
    }

}