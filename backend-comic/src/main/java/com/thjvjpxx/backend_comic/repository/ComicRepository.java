package com.thjvjpxx.backend_comic.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.thjvjpxx.backend_comic.dto.response.HomeResponse.PopulerToday;
import com.thjvjpxx.backend_comic.enums.ComicStatus;
import com.thjvjpxx.backend_comic.model.Comic;
import com.thjvjpxx.backend_comic.model.User;

@Repository
public interface ComicRepository extends JpaRepository<Comic, String> {

    /**
     * Tìm comic theo slug
     * 
     * @param slug Slug của comic
     * @return Optional<Comic>
     */
    Optional<Comic> findBySlug(String slug);

    /**
     * Tìm tất cả comic
     * 
     * @param pageable Pageable
     * @return Page<Comic>
     */
    Page<Comic> findAll(Pageable pageable);

    /**
     * Tìm comic theo slug hoặc name
     * 
     * @param slug     Slug của comic
     * @param name     Tên comic
     * @param pageable Pageable
     * @return Page<Comic>
     */
    Page<Comic> findBySlugContainingOrNameContaining(String slug, String name, Pageable pageable);

    /**
     * Tìm comic theo trạng thái
     * 
     * @param status   Trạng thái comic
     * @param pageable Pageable
     * @return Page<Comic>
     */
    Page<Comic> findByStatus(ComicStatus status, Pageable pageable);

    /**
     * Tìm comic theo category ID
     * 
     * @param categoryId ID của category
     * @param pageable   Pageable
     * @return Page<Comic>
     */
    @Query("SELECT c FROM comics c JOIN c.categories cat WHERE cat.id = :categoryId")
    Page<Comic> findByCategory(@Param("categoryId") String category, Pageable pageable);

    /**
     * Tìm comic theo slug category với sorting theo lượt xem
     * 
     * @param slugCategory Slug của category
     * @param pageable     Pageable
     * @return Page<Comic>
     */
    @Query(value = """
            SELECT
                c.*
            FROM
                comics c
            JOIN
                comic_categories cc ON c.id = cc.comic_id
            JOIN
                categories cat ON cc.category_id = cat.id
            WHERE
                cat.slug = :slugCategory
            ORDER BY c.views_count DESC
            """, countQuery = """
            SELECT COUNT(c.id)
            FROM
                comics c
            JOIN
                comic_categories cc ON c.id = cc.comic_id
            JOIN
                categories cat ON cc.category_id = cat.id
            WHERE
                cat.slug = :slugCategory
            """, nativeQuery = true)
    Page<Comic> findBySlugCategory(@Param("slugCategory") String slugCategory, Pageable pageable);

    /**
     * Tìm top 10 comic phổ biến theo khoảng thời gian
     * 
     * @param startDate Ngày bắt đầu
     * @param endDate   Ngày kết thúc
     * @return List<PopulerToday>
     */
    @Query(value = """
            SELECT
                c.id,
                COALESCE(c.thumb_url, '') AS thumb_url,
                COALESCE(c.slug, '') AS slug,
                COALESCE(c.name, '') AS name,
                CAST(COALESCE(v.viewCount, 0) AS SIGNED) AS viewCount,
                MAX(ch.chapter_number) AS latestChapter
            FROM
                comics c
            LEFT JOIN
                (
                    SELECT
                        comic_id,
                        CAST(COALESCE(SUM(view_count), 0) AS SIGNED) AS viewCount
                    FROM
                        comic_views_history
                    WHERE
                        DATE(view_date) BETWEEN :startDate AND :endDate
                    GROUP BY
                        comic_id
                ) v
                ON c.id = v.comic_id
            INNER JOIN
                chapters ch
                ON c.id = ch.comic_id
            GROUP BY
                c.id, c.thumb_url, c.slug, c.name, v.viewCount
            ORDER BY
                viewCount DESC
            LIMIT 10;
            """, nativeQuery = true)
    List<PopulerToday> findTopComicsByStartAndEndDate(LocalDate startDate, LocalDate endDate);

    /**
     * Tìm top 10 comic phổ biến tất cả thời gian
     * 
     * @return List<PopulerToday>
     */
    @Query(value = """
            SELECT
                c.id,
                c.thumb_url,
                c.slug,
                c.name,
                CAST(COALESCE(SUM(cvh.view_count), 0) AS SIGNED) AS viewCount
            FROM
                comics c
            LEFT JOIN
                comic_views_history cvh
                ON c.id = cvh.comic_id
            GROUP BY
                c.id, c.thumb_url, c.slug, c.name
            ORDER BY
                viewCount DESC
            LIMIT 10
            """, nativeQuery = true)
    List<PopulerToday> findTopComicsAll();

    /**
     * Tìm top 20 comic cập nhật gần đây nhất
     * 
     * @return List<PopulerToday>
     */
    @Query(value = """
            SELECT
                c.id,
                c.thumb_url,
                c.slug,
                c.name,
                CAST(COALESCE(SUM(cvh.view_count), 0) AS SIGNED) AS viewCount
            FROM
                comics c
            LEFT JOIN
                comic_views_history cvh
                ON c.id = cvh.comic_id
            INNER JOIN
                chapters ch
                ON c.id = ch.comic_id
            GROUP BY
                c.id, c.thumb_url, c.slug, c.name
            ORDER BY
                MAX(ch.updated_at) DESC
            LIMIT 20
            """, nativeQuery = true)
    List<PopulerToday> findLastUpdateComics();

    // === QUERIES CHO PUBLISHER ===

    /**
     * Tìm comic theo publisher
     * 
     * @param publisher Publisher
     * @param pageable  Pageable
     * @return Page<Comic>
     */
    Page<Comic> findByPublisher(User publisher, Pageable pageable);

    /**
     * Tìm comic theo publisher và trạng thái
     * 
     * @param publisher Publisher
     * @param status    Trạng thái comic
     * @param pageable  Pageable
     * @return Page<Comic>
     */
    Page<Comic> findByPublisherAndStatus(User publisher, ComicStatus status, Pageable pageable);

    /**
     * Đếm số lượng comic theo publisher
     * 
     * @param publisher Publisher
     * @return long
     */
    long countByPublisher(User publisher);

    /**
     * Tìm comic theo publisher và từ khóa tìm kiếm
     * 
     * @param publisher  Publisher
     * @param searchTerm Từ khóa tìm kiếm
     * @param pageable   Pageable
     * @return Page<Comic>
     */
    @Query("SELECT c FROM comics c WHERE c.publisher = :publisher AND (c.name LIKE %:searchTerm% OR c.slug LIKE %:searchTerm%)")
    Page<Comic> findByPublisherAndSearchTerm(@Param("publisher") User publisher, @Param("searchTerm") String searchTerm,
            Pageable pageable);

    /**
     * Tìm comic theo publisher và category
     * 
     * @param publisher  Publisher
     * @param categoryId ID của category
     * @param pageable   Pageable
     * @return Page<Comic>
     */
    @Query("SELECT c FROM comics c JOIN c.categories cat WHERE c.publisher = :publisher AND cat.id = :categoryId")
    Page<Comic> findByPublisherAndCategory(@Param("publisher") User publisher, @Param("categoryId") String categoryId,
            Pageable pageable);

    // === QUERIES CHO ADMIN STATISTICS ===

    /**
     * Đếm tổng số comic
     * 
     * @return Long
     */
    @Query("SELECT COUNT(c) FROM comics c")
    Long countTotalComics();

    /**
     * Lấy top 10 publisher theo doanh thu
     * Tính từ purchased chapters và tổng lượt xem
     * 
     * @return List<Object[]> Danh sách thông tin publisher với thứ tự:
     *         [publisher_id, publisher_name, total_comics, total_revenue,
     *         total_views]
     */
    @Query(value = """
            SELECT
                u.id as publisher_id,
                u.username as publisher_name,
                COUNT(DISTINCT c.id) as total_comics,
                COALESCE(SUM(pc.purchase_price), 0) as total_revenue,
                COALESCE(SUM(cvh.view_count), 0) as total_views
            FROM users u
            INNER JOIN comics c ON u.id = c.publisher_id
            LEFT JOIN chapters ch ON c.id = ch.comic_id
            LEFT JOIN purchased_chapters pc ON ch.id = pc.chapter_id
            LEFT JOIN comic_views_history cvh ON c.id = cvh.comic_id
            INNER JOIN roles r ON u.role_id = r.id
            WHERE r.name = 'PUBLISHER'
            GROUP BY u.id, u.username
            ORDER BY total_revenue DESC, total_views DESC
            LIMIT 10
            """, nativeQuery = true)
    List<Object[]> getTopPublishersByRevenue();
}
