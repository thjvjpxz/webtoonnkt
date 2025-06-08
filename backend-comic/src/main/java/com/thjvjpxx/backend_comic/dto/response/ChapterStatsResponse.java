package com.thjvjpxx.backend_comic.dto.response;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChapterStatsResponse {
    
    String chapterId;
    String chapterTitle;
    Double chapterNumber;
    
    // Thống kê lượt xem
    Long totalViews;
    Long viewsToday;
    Long viewsThisWeek;
    Long viewsThisMonth;
    
    // Thống kê doanh thu
    Double totalRevenue;
    Double revenueToday;
    Double revenueThisWeek;
    Double revenueThisMonth;
    
    // Thống kê lượt mua
    Long totalPurchases;
    Long purchasesToday;
    Long purchasesThisWeek;
    Long purchasesThisMonth;
    
    // Thông tin chapter
    String status;
    Double price;
    Boolean isFree;
    
    // Thống kê so sánh
    Double conversionRate; // Tỷ lệ chuyển đổi từ view sang mua
    Double averageRevenuePerUser;
} 