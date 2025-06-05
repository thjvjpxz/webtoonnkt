package com.thjvjpxx.backend_comic.model;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.thjvjpxx.backend_comic.enums.WithdrawalStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Entity(name = "withdrawal_requests")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
@Table(indexes = {
        @Index(name = "idx_withdrawal_publisher", columnList = "publisher_id"),
        @Index(name = "idx_withdrawal_status", columnList = "status"),
        @Index(name = "idx_withdrawal_created", columnList = "created_at")
})
public class WithdrawalRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "VARCHAR(36)")
    String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "publisher_id", nullable = false)
    User publisher;

    @Column(name = "amount", nullable = false)
    Double amount;

    @Column(name = "bank_name", nullable = false)
    String bankName;

    @Column(name = "bank_account_number", nullable = false)
    String bankAccountNumber;

    @Column(name = "bank_account_name", nullable = false)
    String bankAccountName;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    WithdrawalStatus status;

    @Column(name = "admin_note")
    String adminNote;

    @Column(name = "processed_by")
    String processedBy;

    @Column(name = "processed_at")
    LocalDateTime processedAt;

    @Column(name = "created_at")
    @CreationTimestamp
    LocalDateTime createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    LocalDateTime updatedAt;
}