package com.thjvjpxx.backend_comic.repository;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.thjvjpxx.backend_comic.model.Chapter;
import com.thjvjpxx.backend_comic.model.Comic;
import com.thjvjpxx.backend_comic.model.PurchasedChapter;
import com.thjvjpxx.backend_comic.model.User;

@Repository
public interface PurchasedChapterRepository extends JpaRepository<PurchasedChapter, String> {

    // Kiểm tra user đã mua chapter chưa
    boolean existsByUserAndChapter(User user, Chapter chapter);

    // Tìm chapter đã mua của user
    Optional<PurchasedChapter> findByUserAndChapter(User user, Chapter chapter);

    // Lấy danh sách chapter đã mua của user theo comic
    @Query("SELECT pc FROM purchased_chapters pc WHERE pc.user = :user AND pc.chapter.comic = :comic ORDER BY pc.chapter.chapterNumber ASC")
    List<PurchasedChapter> findByUserAndComic(@Param("user") User user, @Param("comic") Comic comic);

    // Lấy tất cả chapter đã mua của user
    Page<PurchasedChapter> findByUser(User user, Pageable pageable);

    // Lấy danh sách user đã mua chapter
    @Query("SELECT pc FROM purchased_chapters pc WHERE pc.chapter = :chapter")
    List<PurchasedChapter> findByChapter(@Param("chapter") Chapter chapter);

    // Đếm số lượng người mua chapter
    long countByChapter(Chapter chapter);

    // Tính tổng doanh thu của một chapter
    @Query("SELECT COALESCE(SUM(pc.purchasePrice), 0) FROM purchased_chapters pc WHERE pc.chapter = :chapter")
    Double getTotalRevenueByChapter(@Param("chapter") Chapter chapter);

    // Thống kê chapter theo thời gian
    @Query("SELECT COUNT(pc) FROM purchased_chapters pc WHERE pc.chapter = :chapter AND pc.purchasedAt >= :startDate")
    Long countPurchasesByChapterAfterDate(@Param("chapter") Chapter chapter,
            @Param("startDate") LocalDateTime startDate);

    @Query("SELECT COALESCE(SUM(pc.purchasePrice), 0) FROM purchased_chapters pc WHERE pc.chapter = :chapter AND pc.purchasedAt >= :startDate")
    Double getRevenueByChapterAfterDate(@Param("chapter") Chapter chapter, @Param("startDate") LocalDateTime startDate);

    @Query("SELECT COUNT(pc) FROM purchased_chapters pc WHERE pc.chapter = :chapter AND pc.purchasedAt >= :startDate AND pc.purchasedAt < :endDate")
    Long countPurchasesByChapterBetweenDates(@Param("chapter") Chapter chapter,
            @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT COALESCE(SUM(pc.purchasePrice), 0) FROM purchased_chapters pc WHERE pc.chapter = :chapter AND pc.purchasedAt >= :startDate AND pc.purchasedAt < :endDate")
    Double getRevenueByChapterBetweenDates(@Param("chapter") Chapter chapter,
            @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    // Lấy danh sách chapter được mua nhiều nhất của publisher
    @Query("""
            SELECT pc.chapter, COUNT(pc) as purchaseCount
            FROM purchased_chapters pc
            JOIN pc.chapter ch
            JOIN ch.comic c
            WHERE c.publisher = :publisher
            GROUP BY pc.chapter
            ORDER BY purchaseCount DESC
            """)
    List<Object[]> getTopPurchasedChaptersByPublisher(@Param("publisher") User publisher, Pageable pageable);

    // === PUBLISHER STATS QUERIES ===

    // Tính tổng doanh thu của publisher
    @Query("SELECT COALESCE(SUM(pc.purchasePrice), 0) FROM purchased_chapters pc WHERE pc.chapter.comic.publisher = :publisher")
    Double getTotalRevenueByPublisher(@Param("publisher") User publisher);

    // Tính doanh thu của publisher trong khoảng thời gian
    @Query("SELECT COALESCE(SUM(pc.purchasePrice), 0) FROM purchased_chapters pc WHERE pc.chapter.comic.publisher = :publisher AND pc.purchasedAt >= :startDate AND pc.purchasedAt < :endDate")
    Double getRevenueByPublisherBetweenDates(@Param("publisher") User publisher,
            @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    // Đếm tổng số lượt mua của publisher
    @Query("SELECT COUNT(pc) FROM purchased_chapters pc WHERE pc.chapter.comic.publisher = :publisher")
    Long getTotalPurchasesByPublisher(@Param("publisher") User publisher);

    // Đếm số lượt mua của publisher trong khoảng thời gian
    @Query("SELECT COUNT(pc) FROM purchased_chapters pc WHERE pc.chapter.comic.publisher = :publisher AND pc.purchasedAt >= :startDate AND pc.purchasedAt < :endDate")
    Long getPurchasesByPublisherBetweenDates(@Param("publisher") User publisher,
            @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    // Lấy top truyện theo doanh thu của publisher
    @Query("""
            SELECT pc.chapter.comic, SUM(pc.purchasePrice) as totalRevenue
            FROM purchased_chapters pc
            WHERE pc.chapter.comic.publisher = :publisher
            GROUP BY pc.chapter.comic
            ORDER BY totalRevenue DESC
            """)
    List<Object[]> getTopComicsByRevenueForPublisher(@Param("publisher") User publisher, Pageable pageable);

    // Lấy top 5 chapter bán chạy nhất với thông tin chi tiết
    @Query("""
            SELECT
                pc.chapter,
                COUNT(pc) as purchaseCount,
                SUM(pc.purchasePrice) as totalRevenue,
                pc.chapter.comic
            FROM purchased_chapters pc
            WHERE pc.chapter.comic.publisher = :publisher
            GROUP BY pc.chapter, pc.chapter.comic
            ORDER BY purchaseCount DESC
            """)
    List<Object[]> getTopSellingChaptersWithDetails(@Param("publisher") User publisher, Pageable pageable);

    // Đếm số người mua unique (distinct users) của publisher
    @Query("SELECT COUNT(DISTINCT pc.user) FROM purchased_chapters pc WHERE pc.chapter.comic.publisher = :publisher")
    Long getUniquePurchasersByPublisher(@Param("publisher") User publisher);
}