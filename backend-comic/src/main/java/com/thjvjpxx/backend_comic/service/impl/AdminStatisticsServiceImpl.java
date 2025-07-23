package com.thjvjpxx.backend_comic.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.thjvjpxx.backend_comic.dto.response.AdminStatisticsResponse;
import com.thjvjpxx.backend_comic.dto.response.AdminStatisticsResponse.TopComicData;
import com.thjvjpxx.backend_comic.dto.response.AdminStatisticsResponse.TransactionStatsData;
import com.thjvjpxx.backend_comic.dto.response.AdminStatisticsResponse.TransactionStatsData.TransactionStatusData;
import com.thjvjpxx.backend_comic.enums.TransactionStatus;
import com.thjvjpxx.backend_comic.repository.ChapterRepository;
import com.thjvjpxx.backend_comic.repository.ComicRepository;
import com.thjvjpxx.backend_comic.repository.ComicViewsHistoryRepository;
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
    ComicRepository comicRepository;
    ChapterRepository chapterRepository;

    @Override
    public AdminStatisticsResponse getAllStatistics() {
        return AdminStatisticsResponse.builder()
                .totalUsers(userRepository.countTotalUsers())
                .totalComics(comicRepository.countTotalComics())
                .totalChapters(chapterRepository.countTotalChapters())
                .totalViews(comicViewsHistoryRepository.getTotalViews())
                .totalPublishers(userRepository.countTotalPublishers())
                .totalVipUsers(userRepository.countVipUsers())
                .totalRevenue(getTotalRevenue())
                .topComics(getTopComics())
                .transactionStats(getTransactionStats())
                .build();
    }

    // ================ HELPER METHODS ================

    /**
     * Lấy tổng doanh thu
     * 
     * @return tổng doanh thu
     */
    private Double getTotalRevenue() {
        Double totalRevenue = transactionRepository.sumVndAmountByStatus(TransactionStatus.COMPLETED);
        return totalRevenue != null ? totalRevenue : 0.0;
    }

    /**
     * Lấy danh sách top comics
     * 
     * @return danh sách top comics
     */
    private List<TopComicData> getTopComics() {
        List<Object[]> topComicsData = comicViewsHistoryRepository.getTopComicsByViews();
        List<TopComicData> topComics = new ArrayList<>();

        for (Object[] row : topComicsData) {
            String comicId = (String) row[0];
            String comicTitle = (String) row[1];
            Long views = ((Number) row[2]).longValue();
            String thumbnailUrl = (String) row[3];

            topComics.add(
                    TopComicData.builder()
                            .id(comicId)
                            .title(comicTitle)
                            .views(views)
                            .thumbnailUrl(thumbnailUrl)
                            .build());
        }

        return topComics;
    }

    /**
     * Lấy thống kê giao dịch
     * 
     * @return thống kê giao dịch
     */
    private TransactionStatsData getTransactionStats() {
        Long totalTransactions = transactionRepository.count();
        Long completedTransactions = transactionRepository.countByStatus(TransactionStatus.COMPLETED);
        Long failedTransactions = transactionRepository.countByStatus(TransactionStatus.FAILED);
        Long cancelledTransactions = transactionRepository.countByStatus(TransactionStatus.CANCELLED);

        // Tính tỉ lệ thành công và thất bại
        Double successRate = 0.0;
        Double failureRate = 0.0;

        if (totalTransactions > 0) {
            successRate = (completedTransactions.doubleValue() / totalTransactions.doubleValue()) * 100;
            failureRate = ((failedTransactions.doubleValue() + cancelledTransactions.doubleValue())
                    / totalTransactions.doubleValue()) * 100;
        }

        // Phân bố giao dịch theo trạng thái
        List<Object[]> statusData = transactionRepository.getTransactionStatusDistribution();
        List<TransactionStatusData> statusDistribution = new ArrayList<>();

        for (Object[] row : statusData) {
            String status = (String) row[0];
            Long count = ((Number) row[1]).longValue();
            Double percentage = ((Number) row[2]).doubleValue();

            statusDistribution.add(
                    TransactionStatusData.builder()
                            .status(status)
                            .count(count)
                            .percentage(percentage)
                            .build());
        }

        return TransactionStatsData.builder()
                .totalTransactions(totalTransactions)
                .successRate(successRate)
                .failureRate(failureRate)
                .statusDistribution(statusDistribution)
                .build();
    }
}