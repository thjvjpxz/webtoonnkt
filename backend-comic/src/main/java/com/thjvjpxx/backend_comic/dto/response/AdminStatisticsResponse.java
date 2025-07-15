package com.thjvjpxx.backend_comic.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO response tổng hợp thống kê cho Admin
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminStatisticsResponse {

    // Tổng số người dùng
    private Long totalUsers;

    // Tổng số comic
    private Long totalComics;

    // Tổng số chapter
    private Long totalChapters;

    // Tổng lượt xem
    private Long totalViews;

    // Tổng số publisher
    private Long totalPublishers;

    // Tổng số người dùng VIP
    private Long totalVipUsers;

    // Tổng doanh thu
    private Double totalRevenue;

    // Top comics
    private List<TopComicData> topComics;

    // Thống kê giao dịch
    private TransactionStatsData transactionStats;

    /**
     * DTO cho top comic data
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TopComicData {
        private String id;
        private String title;
        private Long views;
        private String thumbnailUrl;
    }

    /**
     * DTO cho thống kê giao dịch
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TransactionStatsData {
        private Long totalTransactions;
        private Double successRate;
        private Double failureRate;
        private List<TransactionStatusData> statusDistribution;

        @Data
        @Builder
        @NoArgsConstructor
        @AllArgsConstructor
        public static class TransactionStatusData {
            private String status;
            private Long count;
            private Double percentage;
        }
    }
}