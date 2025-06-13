package com.thjvjpxx.backend_comic.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonInclude;

@Entity(name = "vip_packages")
@Table(name = "vip_packages")
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VipPackage {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "VARCHAR(36)")
    String id;

    @Column(name = "name", nullable = false)
    String name;

    @Column(name = "description")
    String description;

    @Column(name = "original", nullable = false)
    Integer originalPrice; // Giá gốc bằng gem

    @Column(name = "discounted")
    Integer discountedPrice; // Phần trăm giảm giá, null = không giảm giá

    @Column(name = "discount_start_date")
    LocalDateTime discountStartDate; // Bắt đầu giảm giá

    @Column(name = "discount_end_date")
    LocalDateTime discountEndDate; // Kết thúc giảm giá

    @Column(name = "duration_days", nullable = false)
    Integer durationDays; // Thời hạn VIP (số ngày)

    @Column(name = "is_active", nullable = false)
    Boolean isActive; // Trạng thái bán: true = còn bán, false = ngừng bán

    @Column(name = "created_at")
    @CreationTimestamp
    LocalDateTime createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    LocalDateTime updatedAt;

    /**
     * Tính giá hiện tại của gói VIP
     * 
     * @return giá hiện tại (có thể là giá giảm hoặc giá gốc)
     */
    public Double getCurrentPrice() {
        LocalDateTime now = LocalDateTime.now();

        // Kiểm tra xem có đang trong thời gian giảm giá không
        if (discountedPrice != null &&
                discountStartDate != null &&
                discountEndDate != null &&
                now.isAfter(discountStartDate) &&
                now.isBefore(discountEndDate)) {
            return Double.valueOf(originalPrice - (originalPrice * discountedPrice / 100.0));
        }

        return Double.valueOf(originalPrice);
    }

    /**
     * Kiểm tra xem gói VIP có đang giảm giá không
     * 
     * @return true nếu đang giảm giá
     */
    public boolean isOnDiscount() {
        LocalDateTime now = LocalDateTime.now();

        return discountedPrice != null &&
                discountStartDate != null &&
                discountEndDate != null &&
                now.isAfter(discountStartDate) &&
                now.isBefore(discountEndDate);
    }

    /**
     * Kiểm tra xem gói VIP có khả dụng để mua không
     * 
     * @return true nếu gói VIP còn được bán
     */
    public boolean isAvailableForPurchase() {
        return isActive != null && isActive;
    }
}