// Interface cho response từ API /admin/statistics  
export interface AdminStatisticsResponse {
  revenueStats: {
    totalRevenue: number;
    currentMonthRevenue: number;
    previousMonthRevenue: number;
    monthlyGrowthPercentage: number;
    currentYearRevenue: number;
    previousYearRevenue: number;
    yearlyGrowthPercentage: number;
    monthlyRevenues: {
      month: string;
      revenue: number;
      transactionCount: number;
    }[];
  };
  userGrowthStats: {
    totalUsers: number;
    newUsersThisMonth: number;
    newUsersLastMonth: number;
    newUserGrowthPercentage: number;
    totalVipUsers: number;
    activeUserRate: number;
    totalChapterViews: number;
    monthlyUserRegistrations: {
      month: string;
      newUsers: number;
      totalUsers: number;
      activeUsers: number;
    }[];
  };
  contentPerformanceStats: {
    totalViews: number;
    currentMonthViews: number;
    previousMonthViews: number;
    viewsGrowthPercentage: number;
    totalComics: number;
    totalChapters: number;
    averageViewsPerComic: number;
    monthlyViews: {
      month: string;
      totalViews: number;
      uniqueViewers: number;
    }[];
    topComics: {
      comicId: string;
      comicTitle: string;
      totalViews: number;
      thumbnailUrl: string;
    }[];
  };
  transactionStatusStats: {
    totalTransactions: number;
    completedTransactions: number;
    failedTransactions: number;
    pendingTransactions: number;
    cancelledTransactions: number;
    successRate: number;
    failureRate: number;
    statusDistribution: {
      status: string;
      count: number;
      percentage: number;
      totalAmount: number;
    }[];
    paymentMethodStats: {
      paymentMethod: string;
      count: number;
      totalAmount: number;
      successRate: number;
    }[];
  };
  publisherActivityStats: {
    totalPublishers: number;
    pendingRequests: number;
    approvedThisMonth: number;
    rejectedThisMonth: number;
    requestStatusStats: {
      status: string;
      count: number;
      percentage: number;
    }[];
    topPublishers: {
      publisherId: string;
      publisherName: string;
      totalComics: number;
      totalRevenue: number;
      totalViews: number;
    }[];
    monthlyActivity: {
      month: string;
      newRequests: number;
      approvedRequests: number;
      rejectedRequests: number;
    }[];
  };
}

// Interface đã được chuẩn hóa để sử dụng trong UI - chỉ các trường có trong API
export interface AdminStatistics {
  totalUsers: number;
  totalComics: number;
  totalChapters: number;
  totalViews: number;
  totalPublishers: number;
  totalVipUsers: number;
  totalRevenue: number;
  // Thống kê theo thời gian
  userGrowth: number; // % tăng trưởng user trong tháng
  viewsGrowth: number; // % tăng trưởng lượt xem trong tháng
  revenueGrowth: number; // % tăng trưởng doanh thu trong tháng
  // Dữ liệu từ API
  topComics: {
    id: string;
    title: string;
    views: number;
    thumbnailUrl: string;
  }[];
  // Thống kê giao dịch
  transactionStats: {
    totalTransactions: number;
    successRate: number;
    failureRate: number;
    statusDistribution: {
      status: string;
      count: number;
      percentage: number;
    }[];
  };
}

// Interface cho thống kê theo khoảng thời gian
export interface DateRangeStatistics extends AdminStatistics {
  startDate: string;
  endDate: string;
}

// Interface cho thống kê theo tháng
export interface MonthlyStatistics extends AdminStatistics {
  year: number;
  month: number;
}

// Interface cho thống kê danh mục
export interface CategoryStatistics {
  id: number;
  name: string;
  totalComics: number;
  totalViews: number;
  percentage: number;
  growth: number;
}

// Interface cho thống kê truyện tranh hàng đầu
export interface TopComicStatistics {
  id: number;
  title: string;
  author: string;
  views: number;
  comments: number;
  rating: number;
  publishedDate: string;
}

// Interface cho dữ liệu biểu đồ
export interface ChartData {
  label: string;
  value: number;
  color?: string;
}

// Interface cho dữ liệu biểu đồ theo thời gian
export interface TimeSeriesData {
  date: string;
  users: number;
  comics: number;
  revenue: number;
  views: number;
} 