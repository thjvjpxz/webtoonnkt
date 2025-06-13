package com.thjvjpxx.backend_comic.service;

import com.thjvjpxx.backend_comic.model.User;

public interface VipExpirationService {
    void checkAndUpdateUserVipStatus(User user);
}