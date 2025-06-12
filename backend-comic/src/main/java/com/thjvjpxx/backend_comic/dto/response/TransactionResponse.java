package com.thjvjpxx.backend_comic.dto.response;

import java.time.LocalDateTime;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import com.fasterxml.jackson.annotation.JsonInclude;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TransactionResponse {

    String id;
    Long transactionCode; // PayOS order code
    Double amount; // Số linh thạch
    Double payosAmountVnd; // Số tiền VND thực tế
    String status;
    String description;
    String paymentMethod;
    Integer durationDays; // Số ngày VIP (nếu là gói VIP)

    // Thông tin user (chỉ hiển thị cho admin)
    String userId;
    String username;

    // Timestamps
    LocalDateTime updatedAt;
}