"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { AdminStatistics } from "@/types/statistics";
import { Badge } from "@/components/ui/badge";

interface TransactionStatsProps {
  statistics: AdminStatistics | null;
  isLoading: boolean;
}

export default function TransactionStats({ statistics, isLoading }: TransactionStatsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-16" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-12" />
              </div>
              <Skeleton className="h-2 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const transactionStats = statistics?.transactionStats;

  if (!transactionStats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Thống kê giao dịch</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Không có dữ liệu giao dịch</p>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'Thành công';
      case 'failed':
        return 'Thất bại';
      case 'cancelled':
        return 'Đã hủy';
      case 'pending':
        return 'Đang chờ';
      default:
        return status;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Thống kê giao dịch</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overview metrics */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Tổng giao dịch</p>
            <p className="text-2xl font-bold">{transactionStats.totalTransactions}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Tỷ lệ thành công</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {transactionStats.successRate.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Success/Failure rates */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Thành công</span>
              <span className="text-sm text-green-600 dark:text-green-400">
                {transactionStats.successRate.toFixed(1)}%
              </span>
            </div>
            <Progress
              value={transactionStats.successRate}
              className="h-2"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Thất bại</span>
              <span className="text-sm text-red-600 dark:text-red-400">
                {transactionStats.failureRate.toFixed(1)}%
              </span>
            </div>
            <Progress
              value={transactionStats.failureRate}
              className="h-2"
            />
          </div>
        </div>

        {/* Status distribution */}
        <div className="space-y-4">
          <h4 className="font-medium">Phân bố trạng thái</h4>
          <div className="space-y-3">
            {transactionStats.statusDistribution.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-accent/20">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className={getStatusColor(item.status)}>
                    {getStatusLabel(item.status)}
                  </Badge>
                  <span className="font-medium">{item.count} giao dịch</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium">
                    {item.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 