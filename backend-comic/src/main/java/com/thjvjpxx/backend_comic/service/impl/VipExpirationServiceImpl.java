package com.thjvjpxx.backend_comic.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.thjvjpxx.backend_comic.model.User;
import com.thjvjpxx.backend_comic.model.UserVipSubscription;
import com.thjvjpxx.backend_comic.repository.UserRepository;
import com.thjvjpxx.backend_comic.repository.UserVipSubscriptionRepository;
import com.thjvjpxx.backend_comic.service.VipExpirationService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class VipExpirationServiceImpl implements VipExpirationService {

    UserVipSubscriptionRepository userVipSubscriptionRepository;
    UserRepository userRepository;

    /**
     * Kiểm tra và cập nhật trạng thái VIP của user khi họ truy cập hệ thống
     * Phương pháp này chỉ xử lý khi user thực sự sử dụng app
     */
    @Override
    @Transactional
    public void checkAndUpdateUserVipStatus(User user) {
        // Kiểm tra user có VIP hiện tại còn hiệu lực không
        boolean hasActiveVip = hasActiveVip(user);

        if (hasActiveVip) {
            // User có VIP hoạt động, đảm bảo user.vip = true
            if (!user.getVip()) {
                user.setVip(true);
                userRepository.save(user);
                log.info("Đã cập nhật trạng thái VIP của user {} thành true", user.getUsername());
            }
        } else {
            // User không có VIP hoạt động, đảm bảo user.vip = false
            if (user.getVip()) {
                user.setVip(false);
                userRepository.save(user);
                log.info("VIP của user {} đã hết hạn, cập nhật thành false", user.getUsername());
            }

            // Cập nhật tất cả subscription hết hạn của user thành EXPIRED
            batchUpdateExpiredSubscriptionsForUser(user);
        }
    }

    /**
     * Cập nhật các subscription hết hạn của một user cụ thể
     */
    @Transactional
    public void batchUpdateExpiredSubscriptionsForUser(User user) {
        LocalDateTime now = LocalDateTime.now();

        // Tìm tất cả subscription đã hết hạn của user nhưng vẫn còn status ACTIVE
        List<UserVipSubscription> expiredSubscriptions = userVipSubscriptionRepository
                .findExpiredActiveSubscriptions(now)
                .stream()
                .filter(sub -> sub.getUser().getId().equals(user.getId()))
                .toList();

        for (UserVipSubscription subscription : expiredSubscriptions) {
            subscription.markAsExpired();
            userVipSubscriptionRepository.save(subscription);
        }

        if (!expiredSubscriptions.isEmpty()) {
            log.info("Đã cập nhật {} subscription hết hạn cho user {}",
                    expiredSubscriptions.size(), user.getUsername());
        }
    }

    /**
     * Kiểm tra xem user có VIP hoạt động không
     */
    private boolean hasActiveVip(User user) {
        LocalDateTime now = LocalDateTime.now();
        return userVipSubscriptionRepository.hasActiveVip(user, now);
    }
}
