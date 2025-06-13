package com.thjvjpxx.backend_comic.service;

import com.thjvjpxx.backend_comic.dto.response.AdminStatisticsResponse;
import com.thjvjpxx.backend_comic.dto.response.AdminStatisticsResponse.ContentPerformanceStatsResponse;
import com.thjvjpxx.backend_comic.dto.response.AdminStatisticsResponse.PublisherActivityStatsResponse;
import com.thjvjpxx.backend_comic.dto.response.AdminStatisticsResponse.RevenueStatsResponse;
import com.thjvjpxx.backend_comic.dto.response.AdminStatisticsResponse.TransactionStatusStatsResponse;
import com.thjvjpxx.backend_comic.dto.response.AdminStatisticsResponse.UserGrowthStatsResponse;

/**
 * Service interface cho thống kê Admin
 */
public interface AdminStatisticsService {

    /**
     * Lấy tất cả thống kê cho Admin dashboard
     * 
     * @return AdminStatisticsResponse chứa tất cả các thống kê
     */
    AdminStatisticsResponse getAllStatistics();

    /**
     * Lấy thống kê doanh thu
     * 
     * @return RevenueStatsResponse
     */
    RevenueStatsResponse getRevenueStatistics();

    /**
     * Lấy thống kê tăng trưởng người dùng
     * 
     * @return UserGrowthStatsResponse
     */
    UserGrowthStatsResponse getUserGrowthStatistics();

    /**
     * Lấy thống kê hiệu suất nội dung
     * 
     * @return ContentPerformanceStatsResponse
     */
    ContentPerformanceStatsResponse getContentPerformanceStatistics();

    /**
     * Lấy thống kê tình trạng giao dịch
     * 
     * @return TransactionStatusStatsResponse
     */
    TransactionStatusStatsResponse getTransactionStatusStatistics();

    /**
     * Lấy thống kê hoạt động publisher
     * 
     * @return PublisherActivityStatsResponse
     */
    PublisherActivityStatsResponse getPublisherActivityStatistics();
}