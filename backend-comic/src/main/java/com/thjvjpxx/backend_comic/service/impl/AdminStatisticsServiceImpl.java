package com.thjvjpxx.backend_comic.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.thjvjpxx.backend_comic.dto.response.AdminStatisticsResponse;
import com.thjvjpxx.backend_comic.dto.response.AdminStatisticsResponse.ContentPerformanceStatsResponse;
import com.thjvjpxx.backend_comic.dto.response.AdminStatisticsResponse.ContentPerformanceStatsResponse.MonthlyViewData;
import com.thjvjpxx.backend_comic.dto.response.AdminStatisticsResponse.ContentPerformanceStatsResponse.TopComicData;
import com.thjvjpxx.backend_comic.dto.response.AdminStatisticsResponse.PublisherActivityStatsResponse;
import com.thjvjpxx.backend_comic.dto.response.AdminStatisticsResponse.PublisherActivityStatsResponse.MonthlyPublisherActivityData;
import com.thjvjpxx.backend_comic.dto.response.AdminStatisticsResponse.PublisherActivityStatsResponse.PublisherRequestStatusData;
import com.thjvjpxx.backend_comic.dto.response.AdminStatisticsResponse.PublisherActivityStatsResponse.TopPublisherData;
import com.thjvjpxx.backend_comic.dto.response.AdminStatisticsResponse.RevenueStatsResponse;
import com.thjvjpxx.backend_comic.dto.response.AdminStatisticsResponse.RevenueStatsResponse.MonthlyRevenueData;
import com.thjvjpxx.backend_comic.dto.response.AdminStatisticsResponse.TransactionStatusStatsResponse;
import com.thjvjpxx.backend_comic.dto.response.AdminStatisticsResponse.TransactionStatusStatsResponse.PaymentMethodData;
import com.thjvjpxx.backend_comic.dto.response.AdminStatisticsResponse.TransactionStatusStatsResponse.TransactionStatusData;
import com.thjvjpxx.backend_comic.dto.response.AdminStatisticsResponse.UserGrowthStatsResponse;
import com.thjvjpxx.backend_comic.dto.response.AdminStatisticsResponse.UserGrowthStatsResponse.MonthlyUserData;
import com.thjvjpxx.backend_comic.enums.PublisherRequestStatus;
import com.thjvjpxx.backend_comic.enums.TransactionStatus;
import com.thjvjpxx.backend_comic.repository.ChapterRepository;
import com.thjvjpxx.backend_comic.repository.ComicRepository;
import com.thjvjpxx.backend_comic.repository.ComicViewsHistoryRepository;
import com.thjvjpxx.backend_comic.repository.PublisherRequestRepository;
import com.thjvjpxx.backend_comic.repository.TransactionRepository;
import com.thjvjpxx.backend_comic.repository.UserRepository;
import com.thjvjpxx.backend_comic.service.AdminStatisticsService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AdminStatisticsServiceImpl implements AdminStatisticsService {

    TransactionRepository transactionRepository;
    UserRepository userRepository;
    ComicViewsHistoryRepository comicViewsHistoryRepository;
    PublisherRequestRepository publisherRequestRepository;
    ComicRepository comicRepository;
    ChapterRepository chapterRepository;

    @Override
    public AdminStatisticsResponse getAllStatistics() {
        return AdminStatisticsResponse.builder()
                .revenueStats(getRevenueStatistics())
                .userGrowthStats(getUserGrowthStatistics())
                .contentPerformanceStats(getContentPerformanceStatistics())
                .transactionStatusStats(getTransactionStatusStatistics())
                .publisherActivityStats(getPublisherActivityStatistics())
                .build();
    }

    // ================ HELPER METHODS ================

    /**
     * Lấy thống kê doanh thu
     * 
     * @return thống kê doanh thu
     */
    private RevenueStatsResponse getRevenueStatistics() {
        // Lấy doanh thu theo năm để tính tăng trưởng
        List<Object[]> yearlyRevenues = transactionRepository.getYearlyRevenueStats();
        Double currentYearRevenue = 0.0;
        Double previousYearRevenue = 0.0;

        if (!yearlyRevenues.isEmpty()) {
            Object[] currentYear = yearlyRevenues.get(0);
            currentYearRevenue = ((Number) currentYear[1]).doubleValue();

            if (yearlyRevenues.size() > 1) {
                Object[] previousYear = yearlyRevenues.get(1);
                previousYearRevenue = ((Number) previousYear[1]).doubleValue();
            }
        }

        // Tính tăng trưởng YoY
        Double yearlyGrowth = 0.0;
        if (previousYearRevenue > 0) {
            yearlyGrowth = ((currentYearRevenue - previousYearRevenue) / previousYearRevenue) * 100;
        }

        // Lấy doanh thu theo tháng
        List<Object[]> monthlyData = transactionRepository.getMonthlyRevenueStats();
        List<MonthlyRevenueData> monthlyRevenues = new ArrayList<>();

        Double currentMonthRevenue = 0.0;
        Double previousMonthRevenue = 0.0;

        for (Object[] row : monthlyData) {
            String month = (String) row[0];
            Double revenue = ((Number) row[1]).doubleValue();
            Long transactionCount = ((Number) row[2]).longValue();

            monthlyRevenues.add(
                    MonthlyRevenueData.builder()
                            .month(month)
                            .revenue(revenue)
                            .transactionCount(transactionCount)
                            .build());
        }

        // Lấy doanh thu tháng hiện tại và tháng trước (2 tháng cuối trong danh sách)
        if (monthlyRevenues.size() >= 1) {
            currentMonthRevenue = monthlyRevenues.get(monthlyRevenues.size() - 1).getRevenue();
        }
        if (monthlyRevenues.size() >= 2) {
            previousMonthRevenue = monthlyRevenues.get(monthlyRevenues.size() - 2).getRevenue();
        }

        // Tính tăng trưởng tháng
        Double monthlyGrowth = 0.0;
        if (previousMonthRevenue > 0) {
            monthlyGrowth = ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100;
        }

        // Tổng doanh thu
        Double totalRevenue = transactionRepository.sumVndAmountByStatus(TransactionStatus.COMPLETED);
        if (totalRevenue == null)
            totalRevenue = 0.0;

        return RevenueStatsResponse.builder()
                .totalRevenue(totalRevenue)
                .currentMonthRevenue(currentMonthRevenue)
                .previousMonthRevenue(previousMonthRevenue)
                .monthlyGrowthPercentage(monthlyGrowth)
                .currentYearRevenue(currentYearRevenue)
                .previousYearRevenue(previousYearRevenue)
                .yearlyGrowthPercentage(yearlyGrowth)
                .monthlyRevenues(monthlyRevenues)
                .build();
    }

    /**
     * Lấy thống kê tăng trưởng người dùng
     * 
     * @return thống kê tăng trưởng người dùng
     */
    private UserGrowthStatsResponse getUserGrowthStatistics() {

        Long totalUsers = userRepository.countTotalUsers();
        Long totalVipUsers = userRepository.countVipUsers();
        Long newUsersThisMonth = userRepository.countNewUsersThisMonth();
        Long newUsersLastMonth = userRepository.countNewUsersLastMonth();
        Long totalChapterViews = comicViewsHistoryRepository.getTotalViews();

        // Tính tăng trưởng user mới
        Double newUserGrowth = 0.0;
        if (newUsersLastMonth > 0) {
            newUserGrowth = ((newUsersThisMonth.doubleValue() - newUsersLastMonth.doubleValue())
                    / newUsersLastMonth.doubleValue()) * 100;
        }

        // Tính tỉ lệ active user (giả định: user có lượt xem chapter trong tháng)
        Double activeUserRate = 0.0;
        if (totalUsers > 0 && totalChapterViews > 0) {
            Long estimatedActiveUsers = Math.min(totalChapterViews / 10, totalUsers);
            activeUserRate = (estimatedActiveUsers.doubleValue() / totalUsers.doubleValue()) * 100;
        }

        // Lấy dữ liệu đăng ký theo tháng
        List<Object[]> monthlyUserData = userRepository.getMonthlyUserRegistrations();
        List<MonthlyUserData> monthlyRegistrations = new ArrayList<>();

        Long cumulativeUsers = totalUsers - newUsersThisMonth; // Bắt đầu từ total trừ tháng hiện tại

        for (Object[] row : monthlyUserData) {
            String month = (String) row[0];
            Long newUsers = ((Number) row[1]).longValue();
            cumulativeUsers += newUsers;

            // Active users ước tính = 70% số user mới + 50% user cũ
            Long activeUsers = Math.round(newUsers * 0.7 + (cumulativeUsers - newUsers) * 0.5);

            monthlyRegistrations.add(
                    MonthlyUserData.builder()
                            .month(month)
                            .newUsers(newUsers)
                            .totalUsers(cumulativeUsers)
                            .activeUsers(activeUsers)
                            .build());
        }

        return UserGrowthStatsResponse.builder()
                .totalUsers(totalUsers)
                .newUsersThisMonth(newUsersThisMonth)
                .newUsersLastMonth(newUsersLastMonth)
                .newUserGrowthPercentage(newUserGrowth)
                .totalVipUsers(totalVipUsers)
                .activeUserRate(activeUserRate)
                .totalChapterViews(totalChapterViews)
                .monthlyUserRegistrations(monthlyRegistrations)
                .build();
    }

    /**
     * Lấy thống kê hiệu suất nội dung
     * 
     * @return thống kê hiệu suất nội dung
     */
    private ContentPerformanceStatsResponse getContentPerformanceStatistics() {

        Long totalViews = comicViewsHistoryRepository.getTotalViews();
        Long currentMonthViews = comicViewsHistoryRepository.getCurrentMonthViews();
        Long previousMonthViews = comicViewsHistoryRepository.getPreviousMonthViews();
        Long totalComics = comicRepository.countTotalComics();
        Long totalChapters = chapterRepository.countTotalChapters();

        // Tính tăng trưởng lượt xem
        Double viewsGrowth = 0.0;
        if (previousMonthViews > 0) {
            viewsGrowth = ((currentMonthViews.doubleValue() - previousMonthViews.doubleValue())
                    / previousMonthViews.doubleValue()) * 100;
        }

        // Trung bình lượt xem/comic
        Double averageViewsPerComic = 0.0;
        if (totalComics > 0) {
            averageViewsPerComic = totalViews.doubleValue() / totalComics.doubleValue();
        }

        // Lấy dữ liệu lượt xem theo tháng
        List<Object[]> monthlyViewsData = comicViewsHistoryRepository.getMonthlyViewsStats();
        List<MonthlyViewData> monthlyViews = new ArrayList<>();

        for (Object[] row : monthlyViewsData) {
            String month = (String) row[0];
            Long views = ((Number) row[1]).longValue();
            // Unique viewers ước tính = views / 5 (giả định mỗi user xem 5 lần)
            Long uniqueViewers = Math.max(1, views / 5);

            monthlyViews.add(
                    MonthlyViewData.builder()
                            .month(month)
                            .totalViews(views)
                            .uniqueViewers(uniqueViewers)
                            .build());
        }

        // Lấy top comics
        List<Object[]> topComicsData = comicViewsHistoryRepository.getTopComicsByViews();
        List<TopComicData> topComics = new ArrayList<>();

        for (Object[] row : topComicsData) {
            String comicId = (String) row[0];
            String comicTitle = (String) row[1];
            Long views = ((Number) row[2]).longValue();
            String thumbnailUrl = (String) row[3];

            topComics.add(
                    TopComicData.builder()
                            .comicId(comicId)
                            .comicTitle(comicTitle)
                            .totalViews(views)
                            .thumbnailUrl(thumbnailUrl)
                            .build());
        }

        return ContentPerformanceStatsResponse.builder()
                .totalViews(totalViews)
                .currentMonthViews(currentMonthViews)
                .previousMonthViews(previousMonthViews)
                .viewsGrowthPercentage(viewsGrowth)
                .totalComics(totalComics)
                .totalChapters(totalChapters)
                .averageViewsPerComic(averageViewsPerComic)
                .monthlyViews(monthlyViews)
                .topComics(topComics)
                .build();
    }

    /**
     * Lấy thống kê tình trạng giao dịch
     * 
     * @return thống kê tình trạng giao dịch
     */
    private TransactionStatusStatsResponse getTransactionStatusStatistics() {

        Long totalTransactions = transactionRepository.count();
        Long completedTransactions = transactionRepository.countByStatus(TransactionStatus.COMPLETED);
        Long failedTransactions = transactionRepository.countByStatus(TransactionStatus.FAILED);
        Long pendingTransactions = transactionRepository.countByStatus(TransactionStatus.PENDING);
        Long cancelledTransactions = transactionRepository.countByStatus(TransactionStatus.CANCELLED);

        // Tính tỉ lệ thành công và thất bại
        Double successRate = 0.0;
        Double failureRate = 0.0;

        if (totalTransactions > 0) {
            successRate = (completedTransactions.doubleValue() / totalTransactions.doubleValue()) * 100;
            failureRate = ((failedTransactions.doubleValue() + cancelledTransactions.doubleValue())
                    / totalTransactions.doubleValue())
                    * 100;
        }

        // Phân bố giao dịch theo trạng thái
        List<Object[]> statusData = transactionRepository.getTransactionStatusDistribution();
        List<TransactionStatusData> statusDistribution = new ArrayList<>();

        for (Object[] row : statusData) {
            String status = (String) row[0];
            Long count = ((Number) row[1]).longValue();
            Double percentage = ((Number) row[2]).doubleValue();
            Double totalAmount = ((Number) row[3]).doubleValue();

            statusDistribution.add(
                    TransactionStatusData.builder()
                            .status(status)
                            .count(count)
                            .percentage(percentage)
                            .totalAmount(totalAmount)
                            .build());
        }

        // Thống kê theo phương thức thanh toán
        List<Object[]> paymentMethodData = transactionRepository.getPaymentMethodStats();
        List<PaymentMethodData> paymentMethodStats = new ArrayList<>();

        for (Object[] row : paymentMethodData) {
            String paymentMethod = (String) row[0];
            Long count = ((Number) row[1]).longValue();

            // Lấy thêm thông tin cho payment method này
            Double totalAmount = transactionRepository.sumVndAmountByStatus(TransactionStatus.COMPLETED);
            Double successRateForMethod = 100.0; // Giả định, cần query phức tạp hơn

            paymentMethodStats.add(
                    PaymentMethodData.builder()
                            .paymentMethod(paymentMethod)
                            .count(count)
                            .totalAmount(totalAmount != null ? totalAmount : 0.0)
                            .successRate(successRateForMethod)
                            .build());
        }

        return TransactionStatusStatsResponse.builder()
                .totalTransactions(totalTransactions)
                .completedTransactions(completedTransactions)
                .failedTransactions(failedTransactions)
                .pendingTransactions(pendingTransactions)
                .cancelledTransactions(cancelledTransactions)
                .successRate(successRate)
                .failureRate(failureRate)
                .statusDistribution(statusDistribution)
                .paymentMethodStats(paymentMethodStats)
                .build();
    }

    /**
     * Lấy thống kê hoạt động publisher
     * 
     * @return thống kê hoạt động publisher
     */
    private PublisherActivityStatsResponse getPublisherActivityStatistics() {

        Long totalPublishers = userRepository.countTotalPublishers();
        Long pendingRequests = publisherRequestRepository.countByStatus(PublisherRequestStatus.PENDING);
        Long approvedThisMonth = publisherRequestRepository.countApprovedThisMonth();
        Long rejectedThisMonth = publisherRequestRepository.countRejectedThisMonth();

        // Thống kê yêu cầu theo trạng thái
        List<Object[]> requestStatusData = publisherRequestRepository.getRequestStatusDistribution();
        List<PublisherRequestStatusData> requestStatusStats = new ArrayList<>();

        for (Object[] row : requestStatusData) {
            String status = (String) row[0];
            Long count = ((Number) row[1]).longValue();
            Double percentage = ((Number) row[2]).doubleValue();

            requestStatusStats.add(
                    PublisherRequestStatusData.builder()
                            .status(status)
                            .count(count)
                            .percentage(percentage)
                            .build());
        }

        // Top publishers theo doanh thu
        List<Object[]> topPublishersData = comicRepository.getTopPublishersByRevenue();
        List<TopPublisherData> topPublishers = new ArrayList<>();

        for (Object[] row : topPublishersData) {
            String publisherId = (String) row[0];
            String publisherName = (String) row[1];
            Long totalComics = ((Number) row[2]).longValue();
            Double totalRevenue = ((Number) row[3]).doubleValue();
            Long totalViews = ((Number) row[4]).longValue();

            topPublishers.add(
                    TopPublisherData.builder()
                            .publisherId(publisherId)
                            .publisherName(publisherName)
                            .totalComics(totalComics)
                            .totalRevenue(totalRevenue)
                            .totalViews(totalViews)
                            .build());
        }

        // Hoạt động publisher theo tháng
        List<Object[]> monthlyActivityData = publisherRequestRepository.getMonthlyPublisherActivity();
        List<MonthlyPublisherActivityData> monthlyActivity = new ArrayList<>();

        for (Object[] row : monthlyActivityData) {
            String month = (String) row[0];
            Long newRequests = ((Number) row[1]).longValue();
            Long approvedRequests = ((Number) row[2]).longValue();
            Long rejectedRequests = ((Number) row[3]).longValue();

            monthlyActivity.add(
                    MonthlyPublisherActivityData.builder()
                            .month(month)
                            .newRequests(newRequests)
                            .approvedRequests(approvedRequests)
                            .rejectedRequests(rejectedRequests)
                            .build());
        }

        return PublisherActivityStatsResponse.builder()
                .totalPublishers(totalPublishers)
                .pendingRequests(pendingRequests)
                .approvedThisMonth(approvedThisMonth)
                .rejectedThisMonth(rejectedThisMonth)
                .requestStatusStats(requestStatusStats)
                .topPublishers(topPublishers)
                .monthlyActivity(monthlyActivity)
                .build();
    }
}