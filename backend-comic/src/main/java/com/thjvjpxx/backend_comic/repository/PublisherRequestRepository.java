package com.thjvjpxx.backend_comic.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.thjvjpxx.backend_comic.enums.PublisherRequestStatus;
import com.thjvjpxx.backend_comic.model.PublisherRequest;
import com.thjvjpxx.backend_comic.model.User;

@Repository
public interface PublisherRequestRepository extends JpaRepository<PublisherRequest, String> {
    Optional<PublisherRequest> findByUser(User user);

    Page<PublisherRequest> findByStatus(PublisherRequestStatus status, Pageable pageable);

    Page<PublisherRequest> findByStatusAndUserUsernameContaining(PublisherRequestStatus status, String username,
            Pageable pageable);

    Page<PublisherRequest> findByUserUsernameContaining(String username, Pageable pageable);

    // === QUERIES CHO ADMIN STATISTICS ===

    // Đếm số yêu cầu theo trạng thái
    Long countByStatus(PublisherRequestStatus status);

    // Thống kê yêu cầu theo trạng thái
    @Query(value = """
            SELECT
                pr.status,
                COUNT(*) as count,
                (COUNT(*) * 100.0 / (SELECT COUNT(*) FROM publisher_requests)) as percentage
            FROM publisher_requests pr
            GROUP BY pr.status
            """, nativeQuery = true)
    List<Object[]> getRequestStatusDistribution();

    // Thống kê hoạt động publisher theo tháng (12 tháng gần nhất)
    @Query(value = """
            SELECT
                DATE_FORMAT(pr.created_at, '%Y-%m') as month,
                COUNT(*) as new_requests,
                SUM(CASE WHEN pr.status = 'APPROVED' THEN 1 ELSE 0 END) as approved_requests,
                SUM(CASE WHEN pr.status = 'REJECTED' THEN 1 ELSE 0 END) as rejected_requests
            FROM publisher_requests pr
            WHERE pr.created_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
            GROUP BY DATE_FORMAT(pr.created_at, '%Y-%m')
            ORDER BY month ASC
            """, nativeQuery = true)
    List<Object[]> getMonthlyPublisherActivity();

    // Đếm yêu cầu được duyệt trong tháng hiện tại
    @Query(value = """
            SELECT COUNT(*)
            FROM publisher_requests pr
            WHERE pr.status = 'APPROVED'
                AND YEAR(pr.updated_at) = YEAR(CURDATE())
                AND MONTH(pr.updated_at) = MONTH(CURDATE())
            """, nativeQuery = true)
    Long countApprovedThisMonth();

    // Đếm yêu cầu bị từ chối trong tháng hiện tại
    @Query(value = """
            SELECT COUNT(*)
            FROM publisher_requests pr
            WHERE pr.status = 'REJECTED'
                AND YEAR(pr.updated_at) = YEAR(CURDATE())
                AND MONTH(pr.updated_at) = MONTH(CURDATE())
            """, nativeQuery = true)
    Long countRejectedThisMonth();
}
