package com.thjvjpxx.backend_comic.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.thjvjpxx.backend_comic.enums.TransactionStatus;
import com.thjvjpxx.backend_comic.enums.TransactionType;
import com.thjvjpxx.backend_comic.model.Transaction;
import com.thjvjpxx.backend_comic.model.User;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, String> {

    // Tìm giao dịch theo user và type
    Page<Transaction> findByUserAndTransactionType(User user, TransactionType transactionType, Pageable pageable);

    // Tìm giao dịch theo user
    Page<Transaction> findByUser(User user, Pageable pageable);

    // Tìm giao dịch theo PayOS order code
    Optional<Transaction> findByPayosOrderCode(Long payosOrderCode);

    // Tìm giao dịch theo trạng thái
    List<Transaction> findByStatus(TransactionStatus status);

    // Tính tổng số linh thạch đã nạp thành công của user
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM transactions t WHERE t.user = :user AND t.transactionType = 'TOPUP' AND t.status = 'COMPLETED'")
    Double getTotalTopupByUser(@Param("user") User user);

    // Tính tổng số linh thạch đã chi tiêu của user
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM transactions t WHERE t.user = :user AND t.transactionType = 'PURCHASE' AND t.status = 'COMPLETED'")
    Double getTotalSpentByUser(@Param("user") User user);

    // Tính tổng doanh thu của publisher (bằng linh thạch)
    @Query("""
            SELECT COALESCE(SUM(t.amount), 0)
            FROM transactions t
            JOIN purchased_chapters pc ON t.id = pc.transaction.id
            JOIN chapters ch ON pc.chapter.id = ch.id
            JOIN comics c ON ch.comic.id = c.id
            WHERE c.publisher = :publisher AND t.status = 'COMPLETED'
            """)
    Double getTotalRevenueByPublisher(@Param("publisher") User publisher);

    // Tính tổng số VND đã nạp qua PayOS của user
    @Query("SELECT COALESCE(SUM(t.payosAmountVnd), 0) FROM transactions t WHERE t.user = :user AND t.transactionType = 'TOPUP' AND t.status = 'COMPLETED'")
    Double getTotalVndTopupByUser(@Param("user") User user);
}