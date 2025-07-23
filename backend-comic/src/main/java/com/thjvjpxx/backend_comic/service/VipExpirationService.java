package com.thjvjpxx.backend_comic.service;

import com.thjvjpxx.backend_comic.model.User;

/**
 * Service xử lý việc kiểm tra và cập nhật trạng thái VIP của user
 */
public interface VipExpirationService {
    /**
     * Kiểm tra và cập nhật trạng thái VIP của user
     * 
     * @param user Người dùng cần kiểm tra và cập nhật
     */
    void checkAndUpdateUserVipStatus(User user);
}