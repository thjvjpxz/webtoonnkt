package com.thjvjpxx.backend_comic.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.thjvjpxx.backend_comic.dto.response.AdminStatisticsResponse;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.service.AdminStatisticsService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Controller xử lý API thống kê cho Admin
 */
@RestController
@RequestMapping("/admin/statistics")
@RequiredArgsConstructor
@Slf4j
public class AdminStatisticsController {

    private final AdminStatisticsService adminStatisticsService;

    /**
     * Lấy tất cả thống kê cho Admin dashboard
     *
     * @return ResponseEntity chứa tất cả thống kê
     */
    @GetMapping
    public ResponseEntity<BaseResponse<AdminStatisticsResponse>> getAllStatistics() {
        log.info("API: Lấy tất cả thống kê cho Admin");

        try {
            AdminStatisticsResponse statistics = adminStatisticsService.getAllStatistics();
            return ResponseEntity.ok(BaseResponse.success(statistics, "Lấy thống kê thành công"));
        } catch (Exception e) {
            log.error("Lỗi khi lấy thống kê: ", e);
            return ResponseEntity.status(500).body(
                    BaseResponse.error(500, "Lỗi hệ thống khi lấy thống kê"));
        }
    }

    /**
     * Lấy thống kê doanh thu
     *
     * @return ResponseEntity chứa thống kê doanh thu
     */
    @GetMapping("/revenue")
    public ResponseEntity<BaseResponse<AdminStatisticsResponse.RevenueStatsResponse>> getRevenueStatistics() {
        log.info("API: Lấy thống kê doanh thu");

        try {
            AdminStatisticsResponse.RevenueStatsResponse revenueStats = adminStatisticsService.getRevenueStatistics();
            return ResponseEntity.ok(BaseResponse.success(revenueStats, "Lấy thống kê doanh thu thành công"));
        } catch (Exception e) {
            log.error("Lỗi khi lấy thống kê doanh thu: ", e);
            return ResponseEntity.status(500).body(
                    BaseResponse.error(500, "Lỗi hệ thống khi lấy thống kê doanh thu"));
        }
    }

    /**
     * Lấy thống kê tăng trưởng người dùng
     *
     * @return ResponseEntity chứa thống kê người dùng
     */
    @GetMapping("/user-growth")
    public ResponseEntity<BaseResponse<AdminStatisticsResponse.UserGrowthStatsResponse>> getUserGrowthStatistics() {
        log.info("API: Lấy thống kê tăng trưởng người dùng");

        try {
            AdminStatisticsResponse.UserGrowthStatsResponse userGrowthStats = adminStatisticsService
                    .getUserGrowthStatistics();
            return ResponseEntity.ok(BaseResponse.success(userGrowthStats, "Lấy thống kê người dùng thành công"));
        } catch (Exception e) {
            log.error("Lỗi khi lấy thống kê người dùng: ", e);
            return ResponseEntity.status(500).body(
                    BaseResponse.error(500, "Lỗi hệ thống khi lấy thống kê người dùng"));
        }
    }

    /**
     * Lấy thống kê hiệu suất nội dung
     *
     * @return ResponseEntity chứa thống kê nội dung
     */
    @GetMapping("/content-performance")
    public ResponseEntity<BaseResponse<AdminStatisticsResponse.ContentPerformanceStatsResponse>> getContentPerformanceStatistics() {
        log.info("API: Lấy thống kê hiệu suất nội dung");

        try {
            AdminStatisticsResponse.ContentPerformanceStatsResponse contentStats = adminStatisticsService
                    .getContentPerformanceStatistics();
            return ResponseEntity.ok(BaseResponse.success(contentStats, "Lấy thống kê nội dung thành công"));
        } catch (Exception e) {
            log.error("Lỗi khi lấy thống kê nội dung: ", e);
            return ResponseEntity.status(500).body(
                    BaseResponse.error(500, "Lỗi hệ thống khi lấy thống kê nội dung"));
        }
    }

    /**
     * Lấy thống kê tình trạng giao dịch
     *
     * @return ResponseEntity chứa thống kê giao dịch
     */
    @GetMapping("/transaction-status")
    public ResponseEntity<BaseResponse<AdminStatisticsResponse.TransactionStatusStatsResponse>> getTransactionStatusStatistics() {
        log.info("API: Lấy thống kê tình trạng giao dịch");

        try {
            AdminStatisticsResponse.TransactionStatusStatsResponse transactionStats = adminStatisticsService
                    .getTransactionStatusStatistics();
            return ResponseEntity.ok(BaseResponse.success(transactionStats, "Lấy thống kê giao dịch thành công"));
        } catch (Exception e) {
            log.error("Lỗi khi lấy thống kê giao dịch: ", e);
            return ResponseEntity.status(500).body(
                    BaseResponse.error(500, "Lỗi hệ thống khi lấy thống kê giao dịch"));
        }
    }

    /**
     * Lấy thống kê hoạt động publisher
     *
     * @return ResponseEntity chứa thống kê publisher
     */
    @GetMapping("/publisher-activity")
    public ResponseEntity<BaseResponse<AdminStatisticsResponse.PublisherActivityStatsResponse>> getPublisherActivityStatistics() {
        log.info("API: Lấy thống kê hoạt động publisher");

        try {
            AdminStatisticsResponse.PublisherActivityStatsResponse publisherStats = adminStatisticsService
                    .getPublisherActivityStatistics();
            return ResponseEntity.ok(BaseResponse.success(publisherStats, "Lấy thống kê publisher thành công"));
        } catch (Exception e) {
            log.error("Lỗi khi lấy thống kê publisher: ", e);
            return ResponseEntity.status(500).body(
                    BaseResponse.error(500, "Lỗi hệ thống khi lấy thống kê publisher"));
        }
    }
}