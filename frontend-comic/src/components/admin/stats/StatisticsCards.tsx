"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminStatistics } from "@/types/statistics";
import {
  FiUsers,
  FiBook,
  FiEye,
  FiEdit,
  FiStar,
  FiDollarSign,
  FiFileText
} from "react-icons/fi";
import { formatNumber, formatCurrency } from "@/utils/format";

interface StatisticsCardsProps {
  statistics: AdminStatistics | null;
  isLoading: boolean;
}

export default function StatisticsCards({ statistics, isLoading }: StatisticsCardsProps) {
  // Chỉ hiển thị các trường có trong API response
  const statsCards = [
    {
      title: "Tổng người dùng",
      value: statistics?.totalUsers || 0,
      icon: <FiUsers className="h-4 w-4" />,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/20"
    },
    {
      title: "Tổng truyện tranh",
      value: statistics?.totalComics || 0,
      icon: <FiBook className="h-4 w-4" />,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/20"
    },
    {
      title: "Tổng chương",
      value: statistics?.totalChapters || 0,
      icon: <FiFileText className="h-4 w-4" />,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/20"
    },
    {
      title: "Tổng lượt xem",
      value: statistics?.totalViews || 0,
      icon: <FiEye className="h-4 w-4" />,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-100 dark:bg-orange-900/20"
    },
    {
      title: "Nhà xuất bản",
      value: statistics?.totalPublishers || 0,
      icon: <FiEdit className="h-4 w-4" />,
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-100 dark:bg-indigo-900/20"
    },
    {
      title: "Người dùng VIP",
      value: statistics?.totalVipUsers || 0,
      icon: <FiStar className="h-4 w-4" />,
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/20"
    },
    {
      title: "Tổng doanh thu",
      value: statistics?.totalRevenue || 0,
      icon: <FiDollarSign className="h-4 w-4" />,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/20",
      isCurrency: true
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 7 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4 rounded" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsCards.map((card, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`${card.bgColor} p-2 rounded-full`}>
              <div className={card.color}>
                {card.icon}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {card.isCurrency
                ? formatCurrency(card.value)
                : formatNumber(card.value)
              }
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 