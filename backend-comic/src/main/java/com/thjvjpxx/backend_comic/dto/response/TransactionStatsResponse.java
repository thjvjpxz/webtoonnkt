package com.thjvjpxx.backend_comic.dto.response;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

/**
 * DTO response cho thống kê transaction
 */
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TransactionStatsResponse {
    Long totalTransactions; // Tổng số giao dịch (cả nạp tiền và chi tiêu)
    Double totalAmount; // Tổng doanh thu (chỉ tính nạp tiền qua PayOS - amount > 0)
    Long paidCount; // Số giao dịch đã thanh toán thành công
    Long pendingCount; // Số giao dịch đang chờ xử lý
}
