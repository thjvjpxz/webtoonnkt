package com.thjvjpxx.backend_comic.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.thjvjpxx.backend_comic.model.ComicViewsHistory;
import com.thjvjpxx.backend_comic.model.User;

public interface ComicViewsHistoryRepository extends JpaRepository<ComicViewsHistory, String> {
	/**
	 * Tìm lịch sử xem comic theo ID comic và ngày xem
	 * 
	 * @param comicId  ID của comic
	 * @param viewDate Ngày xem comic
	 * @return Optional<ComicViewsHistory>
	 */
	Optional<ComicViewsHistory> findByComicIdAndViewDate(String comicId, LocalDateTime viewDate);

	// === QUERIES CHO ADMIN STATISTICS ===

	/**
	 * Lấy tổng lượt xem toàn nền tảng
	 * 
	 * @return Long Tổng số lượt xem
	 */
	@Query("SELECT COALESCE(SUM(cvh.viewCount), 0) FROM comic_views_history cvh")
	Long getTotalViews();

	/**
	 * Lấy thống kê lượt xem theo tháng (12 tháng gần nhất)
	 * 
	 * @return List<Object[]> Danh sách thống kê với thứ tự: [month, total_views]
	 */
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

	/**
	 * Lấy tổng lượt xem trong tháng hiện tại
	 * 
	 * @return Long Số lượt xem tháng hiện tại
	 */
	@Query(value = """
			SELECT COALESCE(SUM(cvh.view_count), 0)
			FROM comic_views_history cvh
			WHERE YEAR(cvh.view_date) = YEAR(CURDATE())
			    AND MONTH(cvh.view_date) = MONTH(CURDATE())
			""", nativeQuery = true)
	Long getCurrentMonthViews();

	/**
	 * Lấy tổng lượt xem trong tháng trước
	 * 
	 * @return Long Số lượt xem tháng trước
	 */
	@Query(value = """
			SELECT COALESCE(SUM(cvh.view_count), 0)
			FROM comic_views_history cvh
			WHERE YEAR(cvh.view_date) = YEAR(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
			    AND MONTH(cvh.view_date) = MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
			""", nativeQuery = true)
	Long getPreviousMonthViews();

	/**
	 * Lấy top 10 comic có lượt xem cao nhất
	 * 
	 * @return List<Object[]> Danh sách comic với thứ tự: [comic_id, comic_title, total_views, thumbnail_url]
	 */
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

	// === PUBLISHER STATS QUERIES ===

	/**
	 * Lấy tổng lượt xem của tất cả comic thuộc publisher
	 * 
	 * @param publisher Publisher cần thống kê
	 * @return Long Tổng số lượt xem
	 */
	@Query("SELECT COALESCE(SUM(cvh.viewCount), 0) FROM comic_views_history cvh WHERE cvh.comic.publisher = :publisher")
	Long getTotalViewsByPublisher(@Param("publisher") User publisher);

	/**
	 * Lấy tổng lượt xem của publisher trong khoảng thời gian cụ thể
	 * 
	 * @param publisher Publisher cần thống kê
	 * @param startDate Ngày bắt đầu
	 * @param endDate   Ngày kết thúc
	 * @return Long Số lượt xem trong khoảng thời gian
	 */
	@Query("SELECT COALESCE(SUM(cvh.viewCount), 0) FROM comic_views_history cvh WHERE cvh.comic.publisher = :publisher AND cvh.viewDate >= :startDate AND cvh.viewDate < :endDate")
	Long getViewsByPublisherBetweenDates(@Param("publisher") User publisher,
			@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

	/**
	 * Lấy thống kê lượt xem theo tháng cho publisher
	 * 
	 * @param publisherId ID của publisher
	 * @param startDate   Ngày bắt đầu thống kê
	 * @param endDate     Ngày kết thúc thống kê
	 * @return List<Object[]> Danh sách thống kê với thứ tự: [month, total_views]
	 */
	@Query(value = """
			SELECT
			    DATE_FORMAT(cvh.view_date, '%Y-%m') as month,
			    COALESCE(SUM(cvh.view_count), 0) as total_views
			FROM comic_views_history cvh
			INNER JOIN comics c ON cvh.comic_id = c.id
			WHERE c.publisher_id = :publisherId
			    AND cvh.view_date >= :startDate
			    AND cvh.view_date < :endDate
			GROUP BY DATE_FORMAT(cvh.view_date, '%Y-%m')
			ORDER BY month DESC
			""", nativeQuery = true)
	List<Object[]> getMonthlyViewsByPublisher(@Param("publisherId") String publisherId,
			@Param("startDate") LocalDateTime startDate,
			@Param("endDate") LocalDateTime endDate);

	/**
	 * Lấy danh sách top comic theo lượt xem của publisher
	 * 
	 * @param publisher Publisher cần thống kê
	 * @param pageable  Thông tin phân trang
	 * @return List<Object[]> Danh sách comic với thứ tự: [comic, totalViews]
	 */
	@Query("""
			SELECT cvh.comic, SUM(cvh.viewCount) as totalViews
			FROM comic_views_history cvh
			WHERE cvh.comic.publisher = :publisher
			GROUP BY cvh.comic
			ORDER BY totalViews DESC
			""")
	List<Object[]> getTopComicsByViewsForPublisher(@Param("publisher") User publisher, Pageable pageable);

	/**
	 * Đếm số comic unique đã được xem của publisher (ước tính unique viewers)
	 * 
	 * @param publisher Publisher cần thống kê
	 * @return Long Số lượng comic unique đã được xem
	 */
	@Query("SELECT COUNT(DISTINCT cvh.comic.id) FROM comic_views_history cvh WHERE cvh.comic.publisher = :publisher")
	Long getUniqueComicViewsByPublisher(@Param("publisher") User publisher);
}
