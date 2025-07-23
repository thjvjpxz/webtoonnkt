export interface AdminStatistics {
  totalUsers: number;
  totalComics: number;
  totalChapters: number;
  totalViews: number;
  totalPublishers: number;
  totalVipUsers: number;
  totalRevenue: number;
  topComics: {
    id: string;
    title: string;
    views: number;
    thumbnailUrl: string;
  }[];
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
