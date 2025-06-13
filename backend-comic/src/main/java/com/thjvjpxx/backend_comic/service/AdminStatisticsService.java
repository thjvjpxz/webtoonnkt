package com.thjvjpxx.backend_comic.service;

import com.thjvjpxx.backend_comic.dto.response.AdminStatisticsResponse;

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
}