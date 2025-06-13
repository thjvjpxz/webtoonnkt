package com.thjvjpxx.backend_comic.dto.response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PublisherStatsResponse {

    // Thống kê truyện
    Long totalComics;
    Long totalChapters;
    Long totalViews;
    Long totalFollowers;

    // Thống kê doanh thu (tính bằng linh thạch)
    Double totalRevenue;
    Double availableBalance;
    Double totalWithdrawn;
    Double pendingWithdrawal;

    // Thống kê theo tháng hiện tại
    Double monthlyRevenue;
    Long monthlyPurchases;
    Long monthlyViews;
}