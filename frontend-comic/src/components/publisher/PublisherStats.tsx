// Component demo để minh họa cách sử dụng thống kê publisher
import { useState } from 'react';
import { usePublisherStats } from '@/hooks/usePublisherStats';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, RefreshCw, DollarSign, Eye, Users, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { chooseImageUrl } from '@/utils/string';

export function PublisherStats() {
  const { stats, isLoading, error, refetch, fetchStatsInRange } = usePublisherStats();
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Handler để fetch thống kê theo khoảng thời gian
  const handleFetchRange = async () => {
    if (!startDate || !endDate) {
      toast.error('Vui lòng chọn cả ngày bắt đầu và ngày kết thúc');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      toast.error('Ngày bắt đầu phải nhỏ hơn ngày kết thúc');
      return;
    }

    await fetchStatsInRange(start, end);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin mr-2" />
        <span>Đang tải thống kê...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={refetch} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Thử lại
        </Button>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500 mb-4">Chưa có dữ liệu thống kê</p>
        <Button onClick={refetch}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Tải dữ liệu
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Thống Kê</h1>
        <Button onClick={refetch} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Làm mới
        </Button>
      </div>

      {/* Bộ lọc khoảng thời gian */}
      <Card>
        <CardHeader>
          <CardTitle>Lọc theo khoảng thời gian</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <Label htmlFor="startDate">Từ ngày</Label>
              <Input
                id="startDate"
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="endDate">Đến ngày</Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <Button onClick={handleFetchRange} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <TrendingUp className="w-4 h-4 mr-2" />
              )}
              Lọc thống kê
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Thống kê doanh thu */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.revenueStats.totalRevenue.toLocaleString()} VNĐ
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.revenueStats.totalPurchases} lượt mua
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doanh thu tháng</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.revenueStats.monthlyRevenue.toLocaleString()} VNĐ
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng lượt xem</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.viewFollowStats.totalViews.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +{stats.viewFollowStats.monthlyViews.toLocaleString()} tháng này
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Người theo dõi</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.viewFollowStats.totalFollowers.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +{stats.viewFollowStats.monthlyFollowers} tháng này
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top truyện */}
      <Card>
        <CardHeader>
          <CardTitle>Top Truyện Nổi Bật</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.topComics.map((comic) => (
              <div key={comic.comicId} className="flex items-center gap-4 p-4 border rounded-lg">
                <Image
                  src={chooseImageUrl(comic.thumbUrl)}
                  alt={comic.comicName}
                  className="w-16 h-20 object-cover rounded"
                  width={64}
                  height={80}
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{comic.comicName}</h3>
                  <div className="grid grid-cols-3 gap-4 mt-2 text-sm text-gray-600">
                    <div>
                      <span className="block font-medium">Lượt xem</span>
                      {comic.totalViews.toLocaleString()}
                    </div>
                    <div>
                      <span className="block font-medium">Theo dõi</span>
                      {comic.totalFollowers.toLocaleString()}
                    </div>
                    <div>
                      <span className="block font-medium">Doanh thu</span>
                      {comic.totalRevenue.toLocaleString()} VNĐ
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Thống kê chuyển đổi */}
      <Card>
        <CardHeader>
          <CardTitle>Tỷ Lệ Chuyển Đổi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {(stats.conversionStats.overallConversionRate * 100).toFixed(2)}%
              </div>
              <p className="text-sm text-gray-600">Tỷ lệ chuyển đổi</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {stats.conversionStats.averageRevenuePerView.toLocaleString()} VNĐ
              </div>
              <p className="text-sm text-gray-600">Doanh thu/lượt xem</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {stats.conversionStats.totalUniqueViewers.toLocaleString()}
              </div>
              <p className="text-sm text-gray-600">Người xem duy nhất</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {stats.conversionStats.totalPurchasers.toLocaleString()}
              </div>
              <p className="text-sm text-gray-600">Người đã mua</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top chương bán chạy */}
      <Card>
        <CardHeader>
          <CardTitle>Chương Bán Chạy Nhất</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.topSellingChapters.map((chapter) => (
              <div key={chapter.chapterId} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{chapter.chapterTitle}</h4>
                  <p className="text-sm text-gray-600">
                    {chapter.comicName} - Chương {chapter.chapterNumber}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">
                    {chapter.revenue.toLocaleString()} VNĐ
                  </div>
                  <div className="text-sm text-gray-600">
                    {chapter.purchaseCount} lượt mua
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 