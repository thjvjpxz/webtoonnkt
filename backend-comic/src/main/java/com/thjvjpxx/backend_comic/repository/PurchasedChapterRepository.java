package com.thjvjpxx.backend_comic.repository;

import java.time.LocalDateTime;
import java.util.List;

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

	/**
	 * Kiểm tra xem người dùng đã mua chapter này chưa
	 * 
	 * @param user người dùng cần kiểm tra
	 * @param chapter chapter cần kiểm tra
	 * @return true nếu người dùng đã mua chapter, false nếu chưa
	 */
	boolean existsByUserAndChapter(User user, Chapter chapter);

	/**
	 * Lấy danh sách các chapter đã mua của người dùng theo comic, sắp xếp theo số chapter tăng dần
	 * 
	 * @param user người dùng cần lấy danh sách chapter đã mua
	 * @param comic truyện cần lấy danh sách chapter
	 * @return danh sách các chapter đã mua của người dùng theo comic
	 */
	@Query("SELECT pc FROM purchased_chapters pc WHERE pc.user = :user AND pc.chapter.comic = :comic ORDER BY pc.chapter.chapterNumber ASC")
	List<PurchasedChapter> findByUserAndComic(@Param("user") User user, @Param("comic") Comic comic);

	// === QUERIES CHO THỐNG KÊ PUBLISHER ===

	/**
	 * Tính tổng doanh thu của publisher từ tất cả các chapter đã bán
	 * 
	 * @param publisher publisher cần tính doanh thu
	 * @return tổng doanh thu của publisher, trả về 0 nếu không có doanh thu
	 */
	@Query("SELECT COALESCE(SUM(pc.purchasePrice), 0) FROM purchased_chapters pc WHERE pc.chapter.comic.publisher = :publisher")
	Double getTotalRevenueByPublisher(@Param("publisher") User publisher);

	/**
	 * Tính doanh thu của publisher trong khoảng thời gian cụ thể
	 * 
	 * @param publisher publisher cần tính doanh thu
	 * @param startDate ngày bắt đầu (bao gồm)
	 * @param endDate ngày kết thúc (không bao gồm)
	 * @return doanh thu của publisher trong khoảng thời gian, trả về 0 nếu không có doanh thu
	 */
	@Query("SELECT COALESCE(SUM(pc.purchasePrice), 0) FROM purchased_chapters pc WHERE pc.chapter.comic.publisher = :publisher AND pc.purchasedAt >= :startDate AND pc.purchasedAt < :endDate")
	Double getRevenueByPublisherBetweenDates(@Param("publisher") User publisher,
			@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

	/**
	 * Đếm tổng số lượt mua chapter của publisher từ tất cả các truyện
	 * 
	 * @param publisher publisher cần đếm số lượt mua
	 * @return tổng số lượt mua chapter của publisher
	 */
	@Query("SELECT COUNT(pc) FROM purchased_chapters pc WHERE pc.chapter.comic.publisher = :publisher")
	Long getTotalPurchasesByPublisher(@Param("publisher") User publisher);

	/**
	 * Đếm số lượt mua chapter của publisher trong khoảng thời gian cụ thể
	 * 
	 * @param publisher publisher cần đếm số lượt mua
	 * @param startDate ngày bắt đầu (bao gồm)
	 * @param endDate ngày kết thúc (không bao gồm)
	 * @return số lượt mua chapter của publisher trong khoảng thời gian
	 */
	@Query("SELECT COUNT(pc) FROM purchased_chapters pc WHERE pc.chapter.comic.publisher = :publisher AND pc.purchasedAt >= :startDate AND pc.purchasedAt < :endDate")
	Long getPurchasesByPublisherBetweenDates(@Param("publisher") User publisher,
			@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

	/**
	 * Lấy danh sách top truyện theo doanh thu cao nhất của publisher
	 * 
	 * @param publisher publisher cần lấy thống kê
	 * @param pageable thông tin phân trang và sắp xếp
	 * @return danh sách Object[] chứa thông tin [Comic, totalRevenue] sắp xếp theo doanh thu giảm dần
	 */
	@Query("""
			SELECT pc.chapter.comic, SUM(pc.purchasePrice) as totalRevenue
			FROM purchased_chapters pc
			WHERE pc.chapter.comic.publisher = :publisher
			GROUP BY pc.chapter.comic
			ORDER BY totalRevenue DESC
			""")
	List<Object[]> getTopComicsByRevenueForPublisher(@Param("publisher") User publisher, Pageable pageable);

	/**
	 * Lấy top chapter bán chạy nhất của publisher với thông tin chi tiết
	 * 
	 * @param publisher publisher cần lấy thống kê
	 * @param pageable thông tin phân trang để giới hạn số lượng kết quả
	 * @return danh sách Object[] chứa thông tin [Chapter, purchaseCount, totalRevenue, Comic] 
	 *         sắp xếp theo số lượt mua giảm dần
	 */
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

	/**
	 * Đếm số lượng người mua duy nhất (unique users) của publisher
	 * 
	 * @param publisher publisher cần đếm số người mua
	 * @return số lượng người dùng duy nhất đã mua ít nhất một chapter của publisher
	 */
	@Query("SELECT COUNT(DISTINCT pc.user) FROM purchased_chapters pc WHERE pc.chapter.comic.publisher = :publisher")
	Long getUniquePurchasersByPublisher(@Param("publisher") User publisher);
}