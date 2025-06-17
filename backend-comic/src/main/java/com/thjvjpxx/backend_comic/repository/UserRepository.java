package com.thjvjpxx.backend_comic.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.thjvjpxx.backend_comic.model.Role;
import com.thjvjpxx.backend_comic.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

	/**
	 * Tìm người dùng theo mã token đặt lại mật khẩu
	 * 
	 * @param token mã token đặt lại mật khẩu cần tìm kiếm
	 * @return Optional chứa User nếu tìm thấy
	 */
	Optional<User> findByResetPasswordToken(String token);

	/**
	 * Tìm người dùng theo tên đăng nhập
	 * 
	 * @param username tên đăng nhập cần tìm kiếm
	 * @return Optional chứa User nếu tìm thấy
	 */
	Optional<User> findByUsername(String username);

	/**
	 * Tìm người dùng theo địa chỉ email
	 * 
	 * @param email địa chỉ email cần tìm kiếm
	 * @return Optional chứa User nếu tìm thấy
	 */
	Optional<User> findByEmail(String email);

	/**
	 * Tìm người dùng theo mã token xác thực
	 * 
	 * @param token mã token xác thực cần tìm kiếm
	 * @return Optional chứa User nếu tìm thấy
	 */
	Optional<User> findByVerificationToken(String token);

	/**
	 * Tìm tất cả người dùng chưa bị xóa với phân trang
	 * 
	 * @param pageable thông tin phân trang và sắp xếp
	 * @return danh sách người dùng chưa bị xóa với phân trang
	 */
	Page<User> findByDeletedFalse(Pageable pageable);

	/**
	 * Tìm người dùng theo tên đăng nhập hoặc email và chưa bị xóa với phân trang
	 * 
	 * @param username tên đăng nhập cần tìm kiếm
	 * @param email    địa chỉ email cần tìm kiếm
	 * @param pageable thông tin phân trang và sắp xếp
	 * @return danh sách người dùng khớp điều kiện với phân trang
	 */
	Page<User> findByDeletedFalseAndUsernameContainingOrEmailContaining(String username, String email,
			Pageable pageable);

	/**
	 * Tìm người dùng theo vai trò và chưa bị xóa với phân trang
	 * 
	 * @param role     vai trò của người dùng
	 * @param pageable thông tin phân trang và sắp xếp
	 * @return danh sách người dùng theo vai trò và chưa bị xóa với phân trang
	 */
	Page<User> findByDeletedFalseAndRole(Role role, Pageable pageable);

	/**
	 * Tìm người dùng theo vai trò và tìm kiếm theo tên đăng nhập hoặc email, chưa
	 * bị xóa với phân trang
	 * 
	 * @param role       vai trò của người dùng
	 * @param searchTerm từ khóa tìm kiếm (tên đăng nhập hoặc email)
	 * @param pageable   thông tin phân trang và sắp xếp
	 * @return danh sách người dùng khớp điều kiện với phân trang
	 */
	@Query("SELECT u FROM users u WHERE u.deleted = false AND u.role = :role AND (u.username LIKE %:searchTerm% OR u.email LIKE %:searchTerm%)")
	Page<User> findByDeletedFalseAndRoleAndUsernameOrEmailContaining(@Param("role") Role role,
			@Param("searchTerm") String searchTerm, Pageable pageable);

	/**
	 * Tìm tất cả người dùng đã bị xóa với phân trang
	 * 
	 * @param pageable thông tin phân trang và sắp xếp
	 * @return danh sách người dùng đã bị xóa với phân trang
	 */
	Page<User> findByDeletedTrue(Pageable pageable);

	/**
	 * Tìm người dùng theo tên đăng nhập hoặc email và đã bị xóa với phân trang
	 * 
	 * @param username tên đăng nhập cần tìm kiếm
	 * @param email    địa chỉ email cần tìm kiếm
	 * @param pageable thông tin phân trang và sắp xếp
	 * @return danh sách người dùng khớp điều kiện với phân trang
	 */
	Page<User> findByDeletedTrueAndUsernameContainingOrEmailContaining(String username, String email,
			Pageable pageable);

	/**
	 * Tìm người dùng theo vai trò và đã bị xóa với phân trang
	 * 
	 * @param role     vai trò của người dùng
	 * @param pageable thông tin phân trang và sắp xếp
	 * @return danh sách người dùng theo vai trò và đã bị xóa với phân trang
	 */
	Page<User> findByDeletedTrueAndRole(Role role, Pageable pageable);

	/**
	 * Tìm người dùng theo vai trò và tìm kiếm theo tên đăng nhập hoặc email, đã bị
	 * xóa với phân trang
	 * 
	 * @param role       vai trò của người dùng
	 * @param searchTerm từ khóa tìm kiếm (tên đăng nhập hoặc email)
	 * @param pageable   thông tin phân trang và sắp xếp
	 * @return danh sách người dùng khớp điều kiện với phân trang
	 */
	@Query("SELECT u FROM users u WHERE u.deleted = true AND u.role = :role AND (u.username LIKE %:searchTerm% OR u.email LIKE %:searchTerm%)")
	Page<User> findByDeletedTrueAndRoleAndUsernameOrEmailContaining(@Param("role") Role role,
			@Param("searchTerm") String searchTerm, Pageable pageable);

	// === QUERIES CHO ADMIN STATISTICS ===

	/**
	 * Đếm tổng số người dùng chưa bị xóa (dành cho admin)
	 * 
	 * @return tổng số người dùng hoạt động trong hệ thống
	 */
	@Query("SELECT COUNT(u) FROM users u WHERE u.deleted = false")
	Long countTotalUsers();

	/**
	 * Đếm số người dùng VIP chưa bị xóa (dành cho admin)
	 * 
	 * @return tổng số người dùng VIP trong hệ thống
	 */
	@Query("SELECT COUNT(u) FROM users u WHERE u.deleted = false AND u.vip = true")
	Long countVipUsers();

	/**
	 * Thống kê số người dùng đăng ký theo tháng trong 12 tháng gần nhất (dành cho
	 * admin)
	 * 
	 * @return danh sách Object[] chứa thông tin [month, new_users]
	 *         - month: tháng (định dạng YYYY-MM)
	 *         - new_users: số người dùng mới đăng ký trong tháng
	 */
	@Query(value = """
			SELECT
			    DATE_FORMAT(u.created_at, '%Y-%m') as month,
			    COUNT(*) as new_users
			FROM users u
			WHERE u.deleted = false
			    AND u.created_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
			GROUP BY DATE_FORMAT(u.created_at, '%Y-%m')
			ORDER BY month ASC
			""", nativeQuery = true)
	List<Object[]> getMonthlyUserRegistrations();

	/**
	 * Đếm số người dùng mới đăng ký trong tháng hiện tại (dành cho admin)
	 * 
	 * @return số lượng người dùng mới trong tháng hiện tại
	 */
	@Query(value = """
			SELECT COUNT(*)
			FROM users u
			WHERE u.deleted = false
			    AND YEAR(u.created_at) = YEAR(CURDATE())
			    AND MONTH(u.created_at) = MONTH(CURDATE())
			""", nativeQuery = true)
	Long countNewUsersThisMonth();

	/**
	 * Đếm số người dùng mới đăng ký trong tháng trước (dành cho admin)
	 * 
	 * @return số lượng người dùng mới trong tháng trước
	 */
	@Query(value = """
			SELECT COUNT(*)
			FROM users u
			WHERE u.deleted = false
			    AND YEAR(u.created_at) = YEAR(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
			    AND MONTH(u.created_at) = MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
			""", nativeQuery = true)
	Long countNewUsersLastMonth();

	/**
	 * Đếm tổng số nhà xuất bản trong hệ thống (dành cho admin)
	 * 
	 * @return tổng số người dùng có vai trò PUBLISHER chưa bị xóa
	 */
	@Query(value = """
			SELECT COUNT(*)
			FROM users u
			INNER JOIN roles r ON u.role_id = r.id
			WHERE u.deleted = false
			    AND r.name = 'PUBLISHER'
			""", nativeQuery = true)
	Long countTotalPublishers();
}
