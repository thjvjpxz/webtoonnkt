package com.thjvjpxx.backend_comic.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.thjvjpxx.backend_comic.enums.VipSubscriptionStatus;

@Entity(name = "user_vip_subscriptions")
@Table(name = "user_vip_subscriptions")
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserVipSubscription {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "VARCHAR(36)")
    String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    User user; // FK đến bảng users

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vip_package_id", nullable = false)
    VipPackage vipPackage; // FK đến vip_packages

    @Column(name = "start_date", nullable = false)
    LocalDateTime startDate; // Ngày bắt đầu kích hoạt VIP

    @Column(name = "end_date", nullable = false)
    LocalDateTime endDate; // Ngày kết thúc VIP

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    VipSubscriptionStatus status = VipSubscriptionStatus.ACTIVE; // Trạng thái đăng ký

    @Column(name = "created_at")
    @CreationTimestamp
    LocalDateTime createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    LocalDateTime updatedAt;

    /**
     * Kiểm tra xem subscription có đang hoạt động không
     * 
     * @return true nếu subscription đang hoạt động và chưa hết hạn
     */
    public boolean isActive() {
        return status == VipSubscriptionStatus.ACTIVE &&
                LocalDateTime.now().isBefore(endDate);
    }

    /**
     * Kiểm tra xem subscription có đã hết hạn không
     * 
     * @return true nếu đã hết hạn
     */
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(endDate) ||
                status == VipSubscriptionStatus.EXPIRED;
    }

    /**
     * Tính số ngày còn lại của subscription
     * 
     * @return số ngày còn lại, 0 nếu đã hết hạn
     */
    public long getDaysRemaining() {
        if (isExpired()) {
            return 0;
        }

        LocalDateTime now = LocalDateTime.now();
        return java.time.Duration.between(now, endDate).toDays();
    }

    /**
     * Gia hạn subscription thêm số ngày
     * 
     * @param additionalDays số ngày cần gia hạn thêm
     */
    public void extendSubscription(int additionalDays) {
        if (isExpired()) {
            // Nếu đã hết hạn, bắt đầu từ thời điểm hiện tại
            this.startDate = LocalDateTime.now();
            this.endDate = this.startDate.plusDays(additionalDays);
        } else {
            // Nếu chưa hết hạn, gia hạn thêm từ ngày kết thúc hiện tại
            this.endDate = this.endDate.plusDays(additionalDays);
        }
        this.status = VipSubscriptionStatus.ACTIVE;
    }

    /**
     * Hủy subscription
     */
    public void cancelSubscription() {
        this.status = VipSubscriptionStatus.CANCELLED;
    }

    /**
     * Đánh dấu subscription đã hết hạn
     */
    public void markAsExpired() {
        this.status = VipSubscriptionStatus.EXPIRED;
    }
}