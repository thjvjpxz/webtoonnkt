package com.thjvjpxx.backend_comic.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.thjvjpxx.backend_comic.model.User;
import com.thjvjpxx.backend_comic.model.UserVipSubscription;

@Repository
public interface UserVipSubscriptionRepository extends JpaRepository<UserVipSubscription, String> {

    // Tìm subscription hiện tại của user (đang hoạt động)
    @Query("SELECT uvs FROM user_vip_subscriptions uvs WHERE uvs.user = :user AND uvs.status = 'ACTIVE' AND uvs.endDate > :now ORDER BY uvs.endDate DESC")
    Optional<UserVipSubscription> findActiveSubscriptionByUser(@Param("user") User user,
            @Param("now") LocalDateTime now);

    // Tìm subscription của user vẫn còn hiệu lực
    @Query("SELECT uvs FROM user_vip_subscriptions uvs WHERE uvs.user = :user AND uvs.status = 'ACTIVE' AND uvs.endDate > :now")
    Optional<UserVipSubscription> findByUserAndActive(@Param("user") User user, @Param("now") LocalDateTime now);

    // Tìm subscription đã hết hạn (để cleanup)
    @Query("SELECT uvs FROM user_vip_subscriptions uvs WHERE uvs.endDate <= :now AND uvs.status = 'ACTIVE'")
    List<UserVipSubscription> findExpiredActiveSubscriptions(@Param("now") LocalDateTime now);

    // Kiểm tra user có VIP hiện tại không
    @Query("SELECT COUNT(uvs) > 0 FROM user_vip_subscriptions uvs WHERE uvs.user = :user AND uvs.status = 'ACTIVE' AND uvs.endDate > :now")
    boolean hasActiveVip(@Param("user") User user, @Param("now") LocalDateTime now);
}
