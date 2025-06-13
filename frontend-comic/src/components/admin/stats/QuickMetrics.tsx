"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminStatistics } from "@/types/statistics";
import { FiTrendingUp, FiTrendingDown, FiMinus } from "react-icons/fi";

interface QuickMetricsProps {
  statistics: AdminStatistics | null;
  isLoading: boolean;
}

export default function QuickMetrics({ statistics, isLoading }: QuickMetricsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-16" />
              </div>
              <Skeleton className="h-8 w-8 rounded" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  const metrics = [
    {
      title: "Tăng trưởng người dùng",
      value: statistics?.userGrowth || 0,
      suffix: "%",
      type: "percentage" as const
    },
    {
      title: "Tăng trưởng lượt xem",
      value: statistics?.viewsGrowth || 0,
      suffix: "%",
      type: "percentage" as const
    },
    {
      title: "Tăng trưởng doanh thu",
      value: statistics?.revenueGrowth || 0,
      suffix: "%",
      type: "percentage" as const
    }
  ];

  const getTrendIcon = (value: number) => {
    if (value > 0) return <FiTrendingUp className="h-4 w-4 text-green-600" />;
    if (value < 0) return <FiTrendingDown className="h-4 w-4 text-red-600" />;
    return <FiMinus className="h-4 w-4 text-gray-600" />;
  };

  const getTrendColor = (value: number) => {
    if (value > 0) return "text-green-600 dark:text-green-400";
    if (value < 0) return "text-red-600 dark:text-red-400";
    return "text-gray-600 dark:text-gray-400";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index} className="p-4 hover:shadow-md transition-shadow">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {metric.title}
                </p>
                <div className="flex items-center gap-2">
                  <span className={`text-xl font-bold ${getTrendColor(metric.value)}`}>
                    {metric.value >= 0 ? '+' : ''}{metric.value.toFixed(1)}{metric.suffix}
                  </span>
                  {getTrendIcon(metric.value)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  So với tháng trước
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 