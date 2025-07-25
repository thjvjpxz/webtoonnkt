package com.thjvjpxx.backend_comic.dto.response;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

/**
 * DTO response cho thống kê cá nhân của publisher
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PublisherPersonalStatsResponse {

    // Doanh thu cá nhân
    RevenueStats revenueStats;

    // Lượt xem & theo dõi
    ViewFollowStats viewFollowStats;

    // Top truyện
    List<TopComicStats> topComics;

    // Chương bán chạy nhất
    List<TopChapterStats> topSellingChapters;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class RevenueStats {
        Double totalRevenue; // Tổng doanh thu từ bán chương
        Double monthlyRevenue; // Doanh thu tháng hiện tại
        Double weeklyRevenue; // Doanh thu tuần hiện tại
        Double dailyRevenue; // Doanh thu hôm nay
        Long totalPurchases; // Tổng số lượt mua
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class ViewFollowStats {
        Long totalViews; // Tổng lượt xem tất cả truyện
        Long totalFollowers; // Tổng số follow
        List<MonthlyViewFollow> monthlyHistory; // Lịch sử theo tháng
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class MonthlyViewFollow {
        String month; // Tháng (format: yyyy-MM)
        Long views; // Lượt xem trong tháng
        Long follows; // Số follow trong tháng
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class TopComicStats {
        String comicId;
        String comicName;
        String comicSlug;
        String thumbUrl;
        Long totalViews; // Tổng lượt xem
        Long totalFollowers; // Tổng số theo dõi
        Double totalRevenue; // Tổng doanh thu từ truyện này
        LocalDateTime lastUpdated;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class TopChapterStats {
        String chapterId;
        String chapterTitle;
        Double chapterNumber;
        String comicName;
        String comicSlug;
        Long purchaseCount; // Số lượt mua
        Double revenue; // Doanh thu từ chapter này
        Double price; // Giá chapter
        LocalDateTime publishedAt;
    }
}