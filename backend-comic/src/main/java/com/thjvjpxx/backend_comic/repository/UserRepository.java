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
    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    Page<User> findByRole(Role role, Pageable pageable);

    Optional<User> findByVerificationToken(String token);

    // Tìm tất cả user chưa bị xóa (deleted = false)
    Page<User> findByDeletedFalse(Pageable pageable);

    // Tìm user theo username hoặc email và chưa bị xóa
    Page<User> findByDeletedFalseAndUsernameContainingOrEmailContaining(String username, String email,
            Pageable pageable);

    // Tìm user theo role và chưa bị xóa
    Page<User> findByDeletedFalseAndRole(Role role, Pageable pageable);

    // Tìm user theo role và (username hoặc email) và chưa bị xóa
    @Query("SELECT u FROM users u WHERE u.deleted = false AND u.role = :role AND (u.username LIKE %:searchTerm% OR u.email LIKE %:searchTerm%)")
    Page<User> findByDeletedFalseAndRoleAndUsernameOrEmailContaining(@Param("role") Role role,
            @Param("searchTerm") String searchTerm, Pageable pageable);

    // Tìm tất cả user đã bị xóa (deleted = true)
    Page<User> findByDeletedTrue(Pageable pageable);

    // Tìm user theo username hoặc email và đã bị xóa
    Page<User> findByDeletedTrueAndUsernameContainingOrEmailContaining(String username, String email,
            Pageable pageable);

    // Tìm user theo role và đã bị xóa
    Page<User> findByDeletedTrueAndRole(Role role, Pageable pageable);

    // Tìm user theo role và (username hoặc email) và đã bị xóa
    @Query("SELECT u FROM users u WHERE u.deleted = true AND u.role = :role AND (u.username LIKE %:searchTerm% OR u.email LIKE %:searchTerm%)")
    Page<User> findByDeletedTrueAndRoleAndUsernameOrEmailContaining(@Param("role") Role role,
            @Param("searchTerm") String searchTerm, Pageable pageable);

    // Tìm tất cả user (bao gồm cả đã xóa và chưa xóa)
    Page<User> findByUsernameContainingOrEmailContaining(String username, String email, Pageable pageable);

    // Tìm user theo role và (username hoặc email) - tất cả user
    @Query("SELECT u FROM users u WHERE u.role = :role AND (u.username LIKE %:searchTerm% OR u.email LIKE %:searchTerm%)")
    Page<User> findByRoleAndUsernameOrEmailContaining(@Param("role") Role role,
            @Param("searchTerm") String searchTerm,
            Pageable pageable);

    // === QUERIES CHO ADMIN STATISTICS ===

    // Đếm tổng số user
    @Query("SELECT COUNT(u) FROM users u WHERE u.deleted = false")
    Long countTotalUsers();

    // Đếm số user VIP
    @Query("SELECT COUNT(u) FROM users u WHERE u.deleted = false AND u.vip = true")
    Long countVipUsers();

    // Thống kê user đăng ký theo tháng (12 tháng gần nhất)
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

    // Đếm user mới trong tháng hiện tại
    @Query(value = """
            SELECT COUNT(*)
            FROM users u
            WHERE u.deleted = false
                AND YEAR(u.created_at) = YEAR(CURDATE())
                AND MONTH(u.created_at) = MONTH(CURDATE())
            """, nativeQuery = true)
    Long countNewUsersThisMonth();

    // Đếm user mới tháng trước
    @Query(value = """
            SELECT COUNT(*)
            FROM users u
            WHERE u.deleted = false
                AND YEAR(u.created_at) = YEAR(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
                AND MONTH(u.created_at) = MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
            """, nativeQuery = true)
    Long countNewUsersLastMonth();

    // Đếm tổng số publisher
    @Query(value = """
            SELECT COUNT(*)
            FROM users u
            INNER JOIN roles r ON u.role_id = r.id
            WHERE u.deleted = false
                AND r.name = 'PUBLISHER'
            """, nativeQuery = true)
    Long countTotalPublishers();
}
