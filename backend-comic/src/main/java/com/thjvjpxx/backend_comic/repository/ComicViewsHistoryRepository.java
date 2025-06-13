package com.thjvjpxx.backend_comic.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.thjvjpxx.backend_comic.model.ComicViewsHistory;

public interface ComicViewsHistoryRepository extends JpaRepository<ComicViewsHistory, String> {
    Optional<ComicViewsHistory> findByComicIdAndViewDate(String comicId, LocalDateTime viewDate);

    // === QUERIES CHO ADMIN STATISTICS ===

    // Tổng lượt xem toàn nền tảng
    @Query("SELECT COALESCE(SUM(cvh.viewCount), 0) FROM comic_views_history cvh")
    Long getTotalViews();

    // Lượt xem theo tháng (12 tháng gần nhất)
    @Query(value = """
            SELECT
                DATE_FORMAT(cvh.view_date, '%Y-%m') as month,
                COALESCE(SUM(cvh.view_count), 0) as total_views
            FROM comic_views_history cvh
            WHERE cvh.view_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
            GROUP BY DATE_FORMAT(cvh.view_date, '%Y-%m')
            ORDER BY month ASC
            """, nativeQuery = true)
    List<Object[]> getMonthlyViewsStats();

    // Lượt xem tháng hiện tại
    @Query(value = """
            SELECT COALESCE(SUM(cvh.view_count), 0)
            FROM comic_views_history cvh
            WHERE YEAR(cvh.view_date) = YEAR(CURDATE())
                AND MONTH(cvh.view_date) = MONTH(CURDATE())
            """, nativeQuery = true)
    Long getCurrentMonthViews();

    // Lượt xem tháng trước
    @Query(value = """
            SELECT COALESCE(SUM(cvh.view_count), 0)
            FROM comic_views_history cvh
            WHERE YEAR(cvh.view_date) = YEAR(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
                AND MONTH(cvh.view_date) = MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
            """, nativeQuery = true)
    Long getPreviousMonthViews();

    // Top comic có lượt xem cao nhất
    @Query(value = """
            SELECT
                c.id as comic_id,
                c.name as comic_title,
                COALESCE(SUM(cvh.view_count), 0) as total_views,
                c.thumb_url as thumbnail_url
            FROM comics c
            LEFT JOIN comic_views_history cvh ON c.id = cvh.comic_id
            GROUP BY c.id, c.name, c.thumb_url
            ORDER BY total_views DESC
            LIMIT 10
            """, nativeQuery = true)
    List<Object[]> getTopComicsByViews();
}
