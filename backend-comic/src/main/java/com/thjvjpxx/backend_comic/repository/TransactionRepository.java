package com.thjvjpxx.backend_comic.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.thjvjpxx.backend_comic.enums.TransactionStatus;
import com.thjvjpxx.backend_comic.model.Transaction;
import com.thjvjpxx.backend_comic.model.User;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, String> {
    // Tìm giao dịch theo user
    Page<Transaction> findByUser(User user, Pageable pageable);

    // Tìm giao dịch theo PayOS order code
    Optional<Transaction> findByPayosOrderCode(Long payosOrderCode);

    // Tìm giao dịch theo trạng thái
    List<Transaction> findByStatus(TransactionStatus status);

    Page<Transaction> findByStatus(TransactionStatus status, Pageable pageable);

    // Tính tổng số linh thạch đã nạp thành công của user (dựa vào PayOS amount)
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM transactions t WHERE t.user = :user AND t.payosAmountVnd IS NOT NULL AND t.status = 'COMPLETED'")
    Double getTotalTopupByUser(@Param("user") User user);

    // Tính tổng số linh thạch đã chi tiêu của user (dựa vào purchased chapters)
    @Query("SELECT COALESCE(SUM(pc.purchasePrice), 0) FROM purchased_chapters pc WHERE pc.user = :user")
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
    @Query("SELECT COALESCE(SUM(t.payosAmountVnd), 0) FROM transactions t WHERE t.user = :user AND t.payosAmountVnd IS NOT NULL AND t.status = 'COMPLETED'")
    Double getTotalVndTopupByUser(@Param("user") User user);

    // === QUERIES MỚI CHO FILTERING VÀ THỐNG KÊ ===

    // Tìm giao dịch theo user và khoảng thời gian
    @Query("SELECT t FROM transactions t WHERE t.user = :user AND t.createdAt BETWEEN :fromDate AND :toDate ORDER BY t.createdAt DESC")
    Page<Transaction> findByUserAndDateRange(@Param("user") User user,
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate,
            Pageable pageable);

    // Tìm giao dịch theo user và trạng thái
    Page<Transaction> findByUserAndStatus(User user, TransactionStatus status, Pageable pageable);

    // Tìm giao dịch theo user, trạng thái và khoảng thời gian
    @Query("SELECT t FROM transactions t WHERE t.user = :user AND t.status = :status AND t.createdAt BETWEEN :fromDate AND :toDate ORDER BY t.createdAt DESC")
    Page<Transaction> findByUserAndStatusAndDateRange(@Param("user") User user,
            @Param("status") TransactionStatus status,
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate,
            Pageable pageable);

    // Tìm giao dịch theo user và khoảng số tiền
    @Query("SELECT t FROM transactions t WHERE t.user = :user AND t.amount BETWEEN :minAmount AND :maxAmount ORDER BY t.createdAt DESC")
    Page<Transaction> findByUserAndAmountRange(@Param("user") User user,
            @Param("minAmount") Double minAmount,
            @Param("maxAmount") Double maxAmount,
            Pageable pageable);

    // Tìm giao dịch theo khoảng thời gian (cho admin)
    @Query("SELECT t FROM transactions t WHERE t.createdAt BETWEEN :fromDate AND :toDate ORDER BY t.createdAt DESC")
    Page<Transaction> findByDateRange(@Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate,
            Pageable pageable);

    // === QUERIES THỐNG KÊ ===

    // Đếm số giao dịch theo trạng thái của user
    @Query("SELECT COUNT(t) FROM transactions t WHERE t.user = :user AND t.status = :status")
    Long countByUserAndStatus(@Param("user") User user, @Param("status") TransactionStatus status);

    // Tính tổng tiền theo trạng thái của user
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM transactions t WHERE t.user = :user AND t.status = :status")
    Double sumAmountByUserAndStatus(@Param("user") User user, @Param("status") TransactionStatus status);

    // Đếm tổng số giao dịch theo trạng thái (admin)
    Long countByStatus(TransactionStatus status);

    // Tính tổng tiền theo trạng thái (admin)
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM transactions t WHERE t.status = :status")
    Double sumAmountByStatus(@Param("status") TransactionStatus status);

    // Tính tổng tiền VND theo trạng thái (admin)
    @Query("SELECT COALESCE(SUM(t.payosAmountVnd), 0) FROM transactions t WHERE t.status = :status AND t.payosAmountVnd IS NOT NULL")
    Double sumVndAmountByStatus(@Param("status") TransactionStatus status);

    // Thống kê theo phương thức thanh toán
    @Query("SELECT t.paymentMethod, COUNT(t) FROM transactions t WHERE t.paymentMethod IS NOT NULL GROUP BY t.paymentMethod")
    List<Object[]> getPaymentMethodStats();

    // Lấy giao dịch gần nhất của user
    Optional<Transaction> findTopByUserOrderByCreatedAtDesc(User user);

    // Lấy giao dịch gần nhất (admin)
    Optional<Transaction> findTopByOrderByCreatedAtDesc();

    // Thống kê giao dịch theo user trong khoảng thời gian
    @Query("SELECT COUNT(t), COALESCE(SUM(t.amount), 0), COALESCE(SUM(t.payosAmountVnd), 0) FROM transactions t WHERE t.user = :user AND t.createdAt BETWEEN :fromDate AND :toDate")
    List<Object[]> getUserStatsInDateRange(@Param("user") User user,
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate);

    // Thống kê tổng giao dịch trong khoảng thời gian (admin)
    @Query("SELECT COUNT(t), COALESCE(SUM(t.amount), 0), COALESCE(SUM(t.payosAmountVnd), 0) FROM transactions t WHERE t.createdAt BETWEEN :fromDate AND :toDate")
    List<Object[]> getAllStatsInDateRange(@Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate);
}