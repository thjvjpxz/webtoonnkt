package com.thjvjpxx.backend_comic.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.thjvjpxx.backend_comic.enums.TransactionStatus;
import com.thjvjpxx.backend_comic.model.Transaction;
import com.thjvjpxx.backend_comic.model.User;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, String> {
	/**
	 * Tìm giao dịch theo người dùng với phân trang
	 * @param user người dùng cần tìm giao dịch
	 * @param pageable thông tin phân trang và sắp xếp
	 * @return danh sách giao dịch của người dùng với phân trang
	 */
	Page<Transaction> findByUser(User user, Pageable pageable);

	/**
	 * Tìm giao dịch theo mã đơn hàng PayOS
	 * @param payosOrderCode mã đơn hàng PayOS cần tìm kiếm
	 * @return Optional chứa giao dịch nếu tìm thấy
	 */
	Optional<Transaction> findByPayosOrderCode(Long payosOrderCode);

	/**
	 * Tìm tất cả giao dịch theo trạng thái
	 * @param status trạng thái giao dịch cần tìm kiếm
	 * @return danh sách tất cả giao dịch theo trạng thái
	 */
	List<Transaction> findByStatus(TransactionStatus status);

	/**
	 * Tìm giao dịch theo trạng thái với phân trang
	 * @param status trạng thái giao dịch cần tìm kiếm
	 * @param pageable thông tin phân trang và sắp xếp
	 * @return danh sách giao dịch theo trạng thái với phân trang
	 */
	Page<Transaction> findByStatus(TransactionStatus status, Pageable pageable);

	// === QUERIES THỐNG KÊ ===

	/**
	 * Đếm tổng số giao dịch theo trạng thái (dành cho admin)
	 * @param status trạng thái giao dịch cần đếm
	 * @return tổng số giao dịch theo trạng thái
	 */
	Long countByStatus(TransactionStatus status);

	/**
	 * Tính tổng số tiền VND theo trạng thái giao dịch (dành cho admin)
	 * @param status trạng thái giao dịch cần tính tổng
	 * @return tổng số tiền VND của các giao dịch theo trạng thái, trả về 0 nếu không có
	 */
	@Query("SELECT COALESCE(SUM(t.payosAmountVnd), 0) FROM transactions t WHERE t.status = :status AND t.payosAmountVnd IS NOT NULL")
	Double sumVndAmountByStatus(@Param("status") TransactionStatus status);

	/**
	 * Thống kê số lượng giao dịch theo phương thức thanh toán
	 * @return danh sách Object[] chứa thông tin [paymentMethod, count]
	 *         - paymentMethod: phương thức thanh toán
	 *         - count: số lượng giao dịch sử dụng phương thức đó
	 */
	@Query("SELECT t.paymentMethod, COUNT(t) FROM transactions t WHERE t.paymentMethod IS NOT NULL GROUP BY t.paymentMethod")
	List<Object[]> getPaymentMethodStats();

	// === QUERIES CHO ADMIN STATISTICS ===

	/**
	 * Thống kê doanh thu theo tháng trong 12 tháng gần nhất (chỉ giao dịch hoàn thành)
	 * @return danh sách Object[] chứa thông tin [month, revenue, transaction_count]
	 *         - month: tháng (định dạng YYYY-MM)
	 *         - revenue: tổng doanh thu VND trong tháng
	 *         - transaction_count: số lượng giao dịch trong tháng
	 */
	@Query(value = """
			SELECT
			    DATE_FORMAT(t.created_at, '%Y-%m') as month,
			    COALESCE(SUM(t.payos_amount_vnd), 0) as revenue,
			    COUNT(t.id) as transaction_count
			FROM transactions t
			WHERE t.status = 'COMPLETED'
			    AND t.payos_amount_vnd IS NOT NULL
			    AND t.created_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
			GROUP BY DATE_FORMAT(t.created_at, '%Y-%m')
			ORDER BY month ASC
			""", nativeQuery = true)
	List<Object[]> getMonthlyRevenueStats();

	/**
	 * Thống kê doanh thu theo năm (2 năm gần nhất, chỉ giao dịch hoàn thành)
	 * @return danh sách Object[] chứa thông tin [year, revenue]
	 *         - year: năm
	 *         - revenue: tổng doanh thu VND trong năm
	 */
	@Query(value = """
			SELECT
			    YEAR(t.created_at) as year,
			    COALESCE(SUM(t.payos_amount_vnd), 0) as revenue
			FROM transactions t
			WHERE t.status = 'COMPLETED'
			    AND t.payos_amount_vnd IS NOT NULL
			GROUP BY YEAR(t.created_at)
			ORDER BY year DESC
			LIMIT 2
			""", nativeQuery = true)
	List<Object[]> getYearlyRevenueStats();

	/**
	 * Thống kê phân bố giao dịch theo trạng thái với tỷ lệ phần trăm và tổng tiền
	 * @return danh sách Object[] chứa thông tin [status, count, percentage, total_amount]
	 *         - status: trạng thái giao dịch
	 *         - count: số lượng giao dịch theo trạng thái
	 *         - percentage: tỷ lệ phần trăm giao dịch theo trạng thái
	 *         - total_amount: tổng số tiền theo trạng thái
	 */
	@Query(value = """
			SELECT
			    t.status,
			    COUNT(*) as count,
			    (COUNT(*) * 100.0 / (SELECT COUNT(*) FROM transactions)) as percentage,
			    COALESCE(SUM(t.amount), 0) as total_amount
			FROM transactions t
			GROUP BY t.status
			""", nativeQuery = true)
	List<Object[]> getTransactionStatusDistribution();
}