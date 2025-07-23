"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminStatistics } from "@/types/statistics";
import Image from "next/image";

interface StatisticsChartsProps {
  statistics: AdminStatistics | null;
  isLoading: boolean;
}

export default function StatisticsCharts({ statistics, isLoading }: StatisticsChartsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Stats Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Comics Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Chỉ sử dụng dữ liệu từ API, không có dữ liệu mặc định
  const topComics = statistics?.topComics || [];

  return (
    <div className="w-full">
      {/* Top Comics - chỉ hiển thị nếu có dữ liệu */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Top truyện phổ biến</CardTitle>
        </CardHeader>
        <CardContent>
          {topComics.length > 0 ? (
            <div className="space-y-4">
              {topComics.map((comic, index) => (
                <div key={comic.id} className="flex justify-between items-center p-3 rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">
                        #{index + 1}
                      </span>
                    </div>
                    <div className="w-10 h-12 rounded overflow-hidden bg-accent/20">
                      <Image
                        src={comic.thumbnailUrl || "/images/default-thumbnail.png"}
                        alt={comic.title}
                        width={40}
                        height={60}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/images/default-thumbnail.png";
                        }}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-foreground line-clamp-1">
                        {comic.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {comic.views.toLocaleString()} lượt xem
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {comic.views >= 1000000
                        ? `${(comic.views / 1000000).toFixed(1)}M`
                        : comic.views >= 1000
                          ? `${(comic.views / 1000).toFixed(1)}K`
                          : comic.views.toString()
                      }
                    </p>
                    <p className="text-xs text-muted-foreground">
                      lượt xem
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              Chưa có dữ liệu truyện
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 