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
    /**
     * Tìm gói đăng ký VIP hiện tại đang hoạt động của người dùng
     * @param user người dùng cần tìm gói đăng ký VIP
     * @param now thời điểm hiện tại để kiểm tra tính hiệu lực
     * @return Optional chứa gói đăng ký VIP đang hoạt động nếu tìm thấy, sắp xếp theo ngày kết thúc giảm dần
     */
    @Query("SELECT uvs FROM user_vip_subscriptions uvs WHERE uvs.user = :user AND uvs.status = 'ACTIVE' AND uvs.endDate > :now ORDER BY uvs.endDate DESC")
    Optional<UserVipSubscription> findActiveSubscriptionByUser(@Param("user") User user,
            @Param("now") LocalDateTime now);

    /**
     * Tìm gói đăng ký VIP của người dùng vẫn còn hiệu lực
     * @param user người dùng cần kiểm tra gói đăng ký VIP
     * @param now thời điểm hiện tại để kiểm tra tính hiệu lực
     * @return Optional chứa gói đăng ký VIP còn hiệu lực nếu tìm thấy
     */
    @Query("SELECT uvs FROM user_vip_subscriptions uvs WHERE uvs.user = :user AND uvs.status = 'ACTIVE' AND uvs.endDate > :now")
    Optional<UserVipSubscription> findByUserAndActive(@Param("user") User user, @Param("now") LocalDateTime now);

    /**
     * Tìm tất cả gói đăng ký VIP đã hết hạn (dành cho việc dọn dẹp dữ liệu)
     * @param now thời điểm hiện tại để kiểm tra gói đăng ký đã hết hạn
     * @return danh sách các gói đăng ký VIP đã hết hạn nhưng vẫn có trạng thái ACTIVE
     */
    @Query("SELECT uvs FROM user_vip_subscriptions uvs WHERE uvs.endDate <= :now AND uvs.status = 'ACTIVE'")
    List<UserVipSubscription> findExpiredActiveSubscriptions(@Param("now") LocalDateTime now);

    /**
     * Kiểm tra người dùng có gói VIP đang hoạt động hay không
     * @param user người dùng cần kiểm tra trạng thái VIP
     * @param now thời điểm hiện tại để kiểm tra tính hiệu lực
     * @return true nếu người dùng có gói VIP đang hoạt động, false nếu không có
     */
    @Query("SELECT COUNT(uvs) > 0 FROM user_vip_subscriptions uvs WHERE uvs.user = :user AND uvs.status = 'ACTIVE' AND uvs.endDate > :now")
    boolean hasActiveVip(@Param("user") User user, @Param("now") LocalDateTime now);
}
