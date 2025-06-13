package com.thjvjpxx.backend_comic.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO response tổng hợp thống kê cho Admin
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminStatisticsResponse {

    // Thống kê doanh thu
    private RevenueStatsResponse revenueStats;

    // Thống kê người dùng
    private UserGrowthStatsResponse userGrowthStats;

    // Thống kê hiệu suất nội dung
    private ContentPerformanceStatsResponse contentPerformanceStats;

    // Thống kê giao dịch
    private TransactionStatusStatsResponse transactionStatusStats;

    // Thống kê hoạt động publisher
    private PublisherActivityStatsResponse publisherActivityStats;

    /**
     * DTO response cho thống kê doanh thu
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RevenueStatsResponse {

        // Tổng doanh thu hiện tại (VND)
        private Double totalRevenue;

        // Doanh thu tháng hiện tại
        private Double currentMonthRevenue;

        // Doanh thu tháng trước
        private Double previousMonthRevenue;

        // Tăng trưởng so với tháng trước (%)
        private Double monthlyGrowthPercentage;

        // Doanh thu năm hiện tại
        private Double currentYearRevenue;

        // Doanh thu năm trước
        private Double previousYearRevenue;

        // Tăng trưởng so với năm trước (%)
        private Double yearlyGrowthPercentage;

        // Doanh thu theo tháng (12 tháng gần nhất)
        private List<MonthlyRevenueData> monthlyRevenues;

        @Data
        @Builder
        @NoArgsConstructor
        @AllArgsConstructor
        public static class MonthlyRevenueData {
            private String month; // "2024-01"
            private Double revenue;
            private Long transactionCount;
        }
    }

    /**
     * DTO response cho thống kê tăng trưởng người dùng
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserGrowthStatsResponse {

        // Tổng số người dùng
        private Long totalUsers;

        // Số người dùng mới trong tháng
        private Long newUsersThisMonth;

        // Số người dùng mới tháng trước
        private Long newUsersLastMonth;

        // Tăng trưởng người dùng mới (%)
        private Double newUserGrowthPercentage;

        // Tổng số người dùng VIP
        private Long totalVipUsers;

        // Tỉ lệ active user (%)
        private Double activeUserRate;

        // Tổng lượt xem chapter
        private Long totalChapterViews;

        // Đăng ký mới theo tháng (12 tháng gần nhất)
        private List<MonthlyUserData> monthlyUserRegistrations;

        @Data
        @Builder
        @NoArgsConstructor
        @AllArgsConstructor
        public static class MonthlyUserData {
            private String month; // "2024-01"
            private Long newUsers;
            private Long totalUsers;
            private Long activeUsers;
        }
    }

    /**
     * DTO response cho thống kê hiệu suất nội dung
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ContentPerformanceStatsResponse {

        // Tổng lượt xem toàn nền tảng
        private Long totalViews;

        // Lượt xem tháng hiện tại
        private Long currentMonthViews;

        // Lượt xem tháng trước
        private Long previousMonthViews;

        // Tăng trưởng lượt xem (%)
        private Double viewsGrowthPercentage;

        // Tổng số comic
        private Long totalComics;

        // Tổng số chapter
        private Long totalChapters;

        // Trung bình lượt xem/comic
        private Double averageViewsPerComic;

        // Lượt xem theo tháng (12 tháng gần nhất)
        private List<MonthlyViewData> monthlyViews;

        // Top 10 comic có lượt xem cao nhất
        private List<TopComicData> topComics;

        @Data
        @Builder
        @NoArgsConstructor
        @AllArgsConstructor
        public static class MonthlyViewData {
            private String month; // "2024-01"
            private Long totalViews;
            private Long uniqueViewers;
        }

        @Data
        @Builder
        @NoArgsConstructor
        @AllArgsConstructor
        public static class TopComicData {
            private String comicId;
            private String comicTitle;
            private Long totalViews;
            private String thumbnailUrl;
        }
    }

    /**
     * DTO response cho thống kê tình trạng giao dịch
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TransactionStatusStatsResponse {

        // Tổng số giao dịch
        private Long totalTransactions;

        // Số giao dịch thành công
        private Long completedTransactions;

        // Số giao dịch thất bại
        private Long failedTransactions;

        // Số giao dịch đang chờ
        private Long pendingTransactions;

        // Số giao dịch bị hủy
        private Long cancelledTransactions;

        // Tỉ lệ thành công (%)
        private Double successRate;

        // Tỉ lệ thất bại (%)
        private Double failureRate;

        // Phân bố giao dịch theo trạng thái
        private List<TransactionStatusData> statusDistribution;

        // Thống kê giao dịch theo phương thức thanh toán
        private List<PaymentMethodData> paymentMethodStats;

        @Data
        @Builder
        @NoArgsConstructor
        @AllArgsConstructor
        public static class TransactionStatusData {
            private String status;
            private Long count;
            private Double percentage;
            private Double totalAmount;
        }

        @Data
        @Builder
        @NoArgsConstructor
        @AllArgsConstructor
        public static class PaymentMethodData {
            private String paymentMethod;
            private Long count;
            private Double totalAmount;
            private Double successRate;
        }
    }

    /**
     * DTO response cho thống kê hoạt động publisher
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PublisherActivityStatsResponse {

        // Tổng số publisher
        private Long totalPublishers;

        // Số yêu cầu publisher đang chờ xử lý
        private Long pendingRequests;

        // Số yêu cầu được duyệt trong tháng
        private Long approvedThisMonth;

        // Số yêu cầu bị từ chối trong tháng
        private Long rejectedThisMonth;

        // Thống kê yêu cầu theo trạng thái
        private List<PublisherRequestStatusData> requestStatusStats;

        // Top publisher theo doanh thu
        private List<TopPublisherData> topPublishers;

        // Hoạt động publisher theo tháng
        private List<MonthlyPublisherActivityData> monthlyActivity;

        @Data
        @Builder
        @NoArgsConstructor
        @AllArgsConstructor
        public static class PublisherRequestStatusData {
            private String status;
            private Long count;
            private Double percentage;
        }

        @Data
        @Builder
        @NoArgsConstructor
        @AllArgsConstructor
        public static class TopPublisherData {
            private String publisherId;
            private String publisherName;
            private Long totalComics;
            private Double totalRevenue;
            private Long totalViews;
        }

        @Data
        @Builder
        @NoArgsConstructor
        @AllArgsConstructor
        public static class MonthlyPublisherActivityData {
            private String month; // "2024-01"
            private Long newRequests;
            private Long approvedRequests;
            private Long rejectedRequests;
        }
    }
}