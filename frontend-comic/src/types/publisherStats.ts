// Định nghĩa các kiểu dữ liệu cho thống kê cá nhân của publisher
export interface PublisherPersonalStatsResponse {
  // Doanh thu cá nhân
  revenueStats: RevenueStats;

  // Lượt xem & theo dõi
  viewFollowStats: ViewFollowStats;

  // Top truyện
  topComics: TopComicStats[];

  // Chương bán chạy nhất
  topSellingChapters: TopChapterStats[];
}

export interface RevenueStats {
  totalRevenue: number; // Tổng doanh thu từ bán chương
  monthlyRevenue: number; // Doanh thu tháng hiện tại
  weeklyRevenue: number; // Doanh thu tuần hiện tại
  dailyRevenue: number; // Doanh thu hôm nay
  totalPurchases: number; // Tổng số lượt mua
}

export interface ViewFollowStats {
  totalViews: number; // Tổng lượt xem tất cả truyện
  totalFollowers: number; // Tổng số follow
  monthlyHistory: MonthlyViewFollow[]; // Lịch sử theo tháng
}

export interface MonthlyViewFollow {
  month: string; // Tháng (format: yyyy-MM)
  views: number; // Lượt xem trong tháng
  follows: number; // Số follow trong tháng
}

export interface TopComicStats {
  comicId: string;
  comicName: string;
  comicSlug: string;
  thumbUrl: string;
  totalViews: number; // Tổng lượt xem
  totalFollowers: number; // Tổng số theo dõi
  totalRevenue: number; // Tổng doanh thu từ truyện này
  lastUpdated: string; // ISO date string
}

export interface TopChapterStats {
  chapterId: string;
  chapterTitle: string;
  chapterNumber: number;
  comicName: string;
  comicSlug: string;
  purchaseCount: number; // Số lượt mua
  revenue: number; // Doanh thu từ chapter này
  price: number; // Giá chapter
  publishedAt: string; // ISO date string
}

// Tham số cho API lấy thống kê theo khoảng thời gian
export interface PersonalStatsDateRangeParams {
  startDate: string; // ISO datetime string
  endDate: string; // ISO datetime string
} 