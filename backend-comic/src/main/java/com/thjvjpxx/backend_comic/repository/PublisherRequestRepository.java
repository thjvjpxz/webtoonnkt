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
    /**
     * Tìm yêu cầu publisher theo người dùng
     * @param user người dùng cần tìm yêu cầu
     * @return Optional chứa yêu cầu publisher nếu tìm thấy
     */
    Optional<PublisherRequest> findByUser(User user);

    /**
     * Tìm yêu cầu publisher theo trạng thái với phân trang
     * @param status trạng thái yêu cầu
     * @param pageable thông tin phân trang
     * @return danh sách yêu cầu publisher theo trạng thái với phân trang
     */
    Page<PublisherRequest> findByStatus(PublisherRequestStatus status, Pageable pageable);

    /**
     * Tìm yêu cầu publisher theo trạng thái và tên người dùng chứa keyword với phân trang
     * @param status trạng thái yêu cầu
     * @param username tên người dùng cần tìm kiếm
     * @param pageable thông tin phân trang
     * @return danh sách yêu cầu publisher phù hợp với phân trang
     */
    Page<PublisherRequest> findByStatusAndUserUsernameContaining(PublisherRequestStatus status, String username,
            Pageable pageable);

    /**
     * Tìm yêu cầu publisher theo tên người dùng chứa keyword với phân trang
     * @param username tên người dùng cần tìm kiếm
     * @param pageable thông tin phân trang
     * @return danh sách yêu cầu publisher có tên người dùng chứa keyword với phân trang
     */
    Page<PublisherRequest> findByUserUsernameContaining(String username, Pageable pageable);

    // === QUERIES CHO ADMIN STATISTICS ===

    /**
     * Đếm số yêu cầu publisher theo trạng thái
     * @param status trạng thái yêu cầu cần đếm
     * @return tổng số yêu cầu theo trạng thái
     */
    Long countByStatus(PublisherRequestStatus status);

    /**
     * Thống kê phân bố yêu cầu publisher theo trạng thái
     * @return danh sách Object[] chứa thông tin [status, count, percentage] 
     *         - status: trạng thái yêu cầu
     *         - count: số lượng yêu cầu
     *         - percentage: tỷ lệ phần trăm
     */
    @Query(value = """
            SELECT
                pr.status,
                COUNT(*) as count,
                (COUNT(*) * 100.0 / (SELECT COUNT(*) FROM publisher_requests)) as percentage
            FROM publisher_requests pr
            GROUP BY pr.status
            """, nativeQuery = true)
    List<Object[]> getRequestStatusDistribution();

    /**
     * Thống kê hoạt động yêu cầu publisher theo tháng (12 tháng gần nhất)
     * @return danh sách Object[] chứa thông tin [month, new_requests, approved_requests, rejected_requests]
     *         - month: tháng (định dạng YYYY-MM)
     *         - new_requests: số yêu cầu mới
     *         - approved_requests: số yêu cầu được duyệt
     *         - rejected_requests: số yêu cầu bị từ chối
     */
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

    /**
     * Đếm số yêu cầu publisher được duyệt trong tháng hiện tại
     * @return tổng số yêu cầu được duyệt trong tháng hiện tại
     */
    @Query(value = """
            SELECT COUNT(*)
            FROM publisher_requests pr
            WHERE pr.status = 'APPROVED'
                AND YEAR(pr.updated_at) = YEAR(CURDATE())
                AND MONTH(pr.updated_at) = MONTH(CURDATE())
            """, nativeQuery = true)
    Long countApprovedThisMonth();

    /**
     * Đếm số yêu cầu publisher bị từ chối trong tháng hiện tại
     * @return tổng số yêu cầu bị từ chối trong tháng hiện tại
     */
    @Query(value = """
            SELECT COUNT(*)
            FROM publisher_requests pr
            WHERE pr.status = 'REJECTED'
                AND YEAR(pr.updated_at) = YEAR(CURDATE())
                AND MONTH(pr.updated_at) = MONTH(CURDATE())
            """, nativeQuery = true)
    Long countRejectedThisMonth();
}
