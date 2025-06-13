import { fetchApi } from './api';
import { ApiResponse } from '@/types/api';
import { AdminStatisticsResponse, AdminStatistics } from '@/types/statistics';

// Hàm chuyển đổi dữ liệu từ API response sang format UI
function transformStatistics(rawData: AdminStatisticsResponse): AdminStatistics {
  return {
    totalUsers: rawData.userGrowthStats.totalUsers,
    totalComics: rawData.contentPerformanceStats.totalComics,
    totalChapters: rawData.contentPerformanceStats.totalChapters,
    totalViews: rawData.contentPerformanceStats.totalViews,
    totalPublishers: rawData.publisherActivityStats.totalPublishers,
    totalVipUsers: rawData.userGrowthStats.totalVipUsers,
    totalRevenue: rawData.revenueStats.totalRevenue,
    // Thống kê tăng trưởng
    userGrowth: rawData.userGrowthStats.newUserGrowthPercentage,
    viewsGrowth: rawData.contentPerformanceStats.viewsGrowthPercentage,
    revenueGrowth: rawData.revenueStats.monthlyGrowthPercentage,
    // Dữ liệu từ API
    topComics: rawData.contentPerformanceStats.topComics.map(comic => ({
      id: comic.comicId,
      title: comic.comicTitle,
      views: comic.totalViews,
      thumbnailUrl: comic.thumbnailUrl
    })),
    transactionStats: {
      totalTransactions: rawData.transactionStatusStats.totalTransactions,
      successRate: rawData.transactionStatusStats.successRate,
      failureRate: rawData.transactionStatusStats.failureRate,
      statusDistribution: rawData.transactionStatusStats.statusDistribution.map(item => ({
        status: item.status,
        count: item.count,
        percentage: item.percentage
      }))
    }
  };
}

// Service cho API thống kê dashboard admin
export const dashboardService = {
  // Lấy dữ liệu thống kê tổng quan từ API /admin/statistics
  getStatistics: async (): Promise<ApiResponse<AdminStatistics>> => {
    const response = await fetchApi<AdminStatisticsResponse>('/admin/statistics', {
      method: 'GET',
    });

    if (response.status === 200 && response.data) {
      return {
        status: response.status,
        message: response.message,
        data: transformStatistics(response.data),
        timestamp: response.timestamp
      };
    }

    // Nếu không thành công, trả về response lỗi
    return {
      status: response.status,
      message: response.message,
      data: undefined as AdminStatistics | undefined,
      timestamp: response.timestamp
    };
  },
}; 