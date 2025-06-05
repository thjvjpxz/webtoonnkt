package com.thjvjpxx.backend_comic.model;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.thjvjpxx.backend_comic.enums.TransactionStatus;
import com.thjvjpxx.backend_comic.enums.TransactionType;

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

@Entity(name = "transactions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
@Table(indexes = {
        @Index(name = "idx_transaction_user", columnList = "user_id"),
        @Index(name = "idx_transaction_type", columnList = "transaction_type"),
        @Index(name = "idx_transaction_status", columnList = "status"),
        @Index(name = "idx_transaction_created", columnList = "created_at"),
        @Index(name = "idx_transaction_payos_order", columnList = "payos_order_code")
})
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "VARCHAR(36)")
    String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    User user;

    @Column(name = "amount", nullable = false)
    Double amount; // Số linh thạch cho TOPUP/PURCHASE, số VND cho WITHDRAWAL

    @Column(name = "transaction_type", nullable = false)
    @Enumerated(EnumType.STRING)
    TransactionType transactionType;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    TransactionStatus status;

    @Column(name = "description")
    String description;

    // PayOS specific fields
    @Column(name = "payos_order_code")
    Long payosOrderCode;

    @Column(name = "payos_transaction_id")
    String payosTransactionId;

    @Column(name = "payos_reference")
    String payosReference;

    @Column(name = "payos_amount_vnd")
    Double payosAmountVnd; // Số tiền VND thực tế thanh toán qua PayOS

    @Column(name = "payment_method")
    String paymentMethod;

    @Column(name = "created_at")
    @CreationTimestamp
    LocalDateTime createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    LocalDateTime updatedAt;
}