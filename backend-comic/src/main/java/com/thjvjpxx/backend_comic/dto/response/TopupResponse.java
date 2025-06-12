package com.thjvjpxx.backend_comic.dto.response;

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
public class TopupResponse {

    String transactionId; // ID giao dịch trong hệ thống
    String transactionCode; // Mã giao dịch (để user reference)
    Long payosOrderCode; // Mã đơn hàng PayOS
    String paymentLink; // Link thanh toán PayOS
    Double amount; // Số linh thạch sẽ nhận được
    Double vndAmount; // Số tiền VND cần thanh toán
    String status; // Trạng thái giao dịch
    String description; // Mô tả giao dịch
}