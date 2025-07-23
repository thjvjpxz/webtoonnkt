package com.thjvjpxx.backend_comic.service;

import com.thjvjpxx.backend_comic.dto.response.PublisherPersonalStatsResponse;
import com.thjvjpxx.backend_comic.model.User;

import java.time.LocalDateTime;

/**
 * Service xử lý thống kê cá nhân của publisher
 */
public interface PublisherPersonalStatsService {

    /**
     * Lấy thống kê cá nhân tổng thể của publisher
     * 
     * @param publisher Publisher cần lấy thống kê
     * @return PublisherPersonalStatsResponse chứa tất cả thống kê
     */
    PublisherPersonalStatsResponse getPersonalStats(User publisher);

    /**
     * Lấy thống kê cá nhân trong khoảng thời gian
     * 
     * @param publisher Publisher cần lấy thống kê
     * @param startDate Ngày bắt đầu
     * @param endDate   Ngày kết thúc
     * @return PublisherPersonalStatsResponse chứa thống kê trong khoảng thời gian
     */
    PublisherPersonalStatsResponse getPersonalStatsInDateRange(User publisher, LocalDateTime startDate,
            LocalDateTime endDate);
}