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

import com.thjvjpxx.backend_comic.model.User;
import com.thjvjpxx.backend_comic.model.UserFollow;

@Repository
public interface UserFollowRepository extends JpaRepository<UserFollow, String> {
	/**
	 * Tìm kiếm theo dõi của người dùng cho truyện tranh cụ thể
	 * @param userId ID của người dùng
	 * @param comicId ID của truyện tranh
	 * @return Optional chứa UserFollow nếu tìm thấy
	 */
	Optional<UserFollow> findByUserIdAndComicId(String userId, String comicId);

	/**
	 * Tìm tất cả truyện tranh mà người dùng đang theo dõi với phân trang
	 * @param userId ID của người dùng
	 * @param pageable thông tin phân trang và sắp xếp
	 * @return danh sách truyện tranh được theo dõi với phân trang
	 */
	Page<UserFollow> findByUserId(String userId, Pageable pageable);

	/**
	 * Đếm tổng số lượt theo dõi của tất cả truyện tranh thuộc về một nhà xuất bản
	 * @param publisher nhà xuất bản cần đếm số lượt theo dõi
	 * @return tổng số lượt theo dõi của nhà xuất bản
	 */
	@Query("SELECT COUNT(uf) FROM UserFollow uf WHERE uf.comic.publisher = :publisher")
	Long countTotalFollowersByPublisher(@Param("publisher") User publisher);

	/**
	 * Lấy thống kê số lượt theo dõi theo tháng cho nhà xuất bản trong khoảng thời gian
	 * @param publisherId ID của nhà xuất bản
	 * @param startDate ngày bắt đầu thống kê
	 * @param endDate ngày kết thúc thống kê
	 * @return danh sách Object[] chứa thông tin [month, followCount]
	 *         - month: tháng (định dạng YYYY-MM)
	 *         - followCount: số lượt theo dõi trong tháng
	 */
	@Query(value = """
			SELECT
			    DATE_FORMAT(uf.created_at, '%Y-%m') as month,
			    COUNT(*) as followCount
			FROM user_follows uf
			INNER JOIN comics c ON uf.comic_id = c.id
			WHERE c.publisher_id = :publisherId
			    AND uf.created_at >= :startDate
			    AND uf.created_at < :endDate
			GROUP BY DATE_FORMAT(uf.created_at, '%Y-%m')
			ORDER BY month DESC
			""", nativeQuery = true)
	List<Object[]> getMonthlyFollowsByPublisher(@Param("publisherId") String publisherId,
			@Param("startDate") LocalDateTime startDate,
			@Param("endDate") LocalDateTime endDate);

	/**
	 * Lấy danh sách truyện tranh phổ biến nhất theo số lượt theo dõi của nhà xuất bản
	 * @param publisher nhà xuất bản cần lấy thống kê
	 * @param pageable thông tin phân trang để giới hạn số lượng kết quả
	 * @return danh sách Object[] chứa thông tin [comic, followCount]
	 *         - comic: đối tượng truyện tranh
	 *         - followCount: số lượt theo dõi của truyện tranh
	 *         Sắp xếp theo số lượt theo dõi giảm dần
	 */
	@Query("""
			SELECT uf.comic, COUNT(uf) as followCount
			FROM UserFollow uf
			WHERE uf.comic.publisher = :publisher
			GROUP BY uf.comic
			ORDER BY followCount DESC
			""")
	List<Object[]> getTopComicsByFollowCount(@Param("publisher") User publisher, Pageable pageable);
}
