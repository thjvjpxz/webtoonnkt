"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuthState } from "@/hooks/useAuthState";
import { getPublicVipPackages } from "@/services/vipPackageService";
import { VipPackage } from "@/types/vipPackage";
import { FiStar, FiCalendar, FiPercent, FiLoader, FiGift } from "react-icons/fi";
import toast from "react-hot-toast";
import Main from "@/components/layout/Main";
import Image from "next/image";

export default function VipPurchasePage() {
  const { user, isAuthenticated } = useAuthState();
  const [vipPackages, setVipPackages] = useState<VipPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState<string | null>(null);

  // Fetch danh sách gói VIP
  useEffect(() => {
    const fetchVipPackages = async () => {
      try {
        setIsLoading(true);
        const response = await getPublicVipPackages();

        if (response.status === 200 && response.data) {
          // Sắp xếp theo giá từ thấp đến cao
          const sortedPackages = response.data.sort((a, b) => a.currentPrice - b.currentPrice);
          setVipPackages(sortedPackages);
        } else {
          toast.error(response.message || "Không thể tải danh sách gói VIP");
        }
      } catch (error) {
        console.error("Lỗi khi tải gói VIP:", error);
        toast.error("Có lỗi xảy ra khi tải danh sách gói VIP");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVipPackages();
  }, []);

  // Xử lý mua gói VIP
  const handlePurchase = async (packageId: string) => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để mua gói VIP");
      return;
    }

    try {
      setIsPurchasing(packageId);

      // TODO: Implement purchase API call
      // await purchaseVipPackage(packageId);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.success("Mua gói VIP thành công!");

    } catch (error) {
      console.error("Lỗi khi mua gói VIP:", error);
      toast.error("Có lỗi xảy ra khi mua gói VIP");
    } finally {
      setIsPurchasing(null);
    }
  };

  // Tính số ngày còn lại của discount
  const getDaysUntilDiscountEnd = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  if (isLoading) {
    return (
      <Main>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <FiLoader className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Đang tải danh sách gói VIP...</p>
            </div>
          </div>
        </div>
      </Main>
    );
  }

  return (
    <Main>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <FiGift className="w-8 h-8 text-yellow-500 mr-3" />
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
              Nâng cấp VIP
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Trở thành thành viên VIP để trải nghiệm đọc truyện không giới hạn và nhiều tính năng đặc biệt khác
          </p>
        </div>

        {/* Hiển thị thông tin user hiện tại */}
        {isAuthenticated && user && (
          <Card className="mb-8 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FiStar className="w-5 h-5 text-primary" />
                Thông tin tài khoản
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Tên tài khoản:</span>
                  <span className="font-medium">{user.username}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Số dư:</span>
                  <div className="flex items-center gap-1 font-medium text-primary">
                    <Image
                      src="/images/linh-thach.webp"
                      alt="linh thạch"
                      width={16}
                      height={16}
                      className="inline-block"
                    />
                    <span>{(0).toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Trạng thái VIP:</span>
                  <Badge variant={user.vip ? "default" : "secondary"}>
                    {user.vip ? "VIP" : "Thường"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Danh sách gói VIP */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vipPackages.map((vipPackage, index) => (
            <Card
              key={vipPackage.id}
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col h-full ${index === 1 ? 'border-primary shadow-lg scale-105' : 'hover:scale-102'
                }`}
            >
              {/* Badge cho gói phổ biến */}
              {index === 1 && (
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-primary text-primary-foreground">
                    Phổ biến nhất
                  </Badge>
                </div>
              )}

              {/* Badge discount nếu có */}
              {vipPackage.onDiscount && (
                <div className="absolute top-4 left-4 z-10">
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <FiPercent className="w-3 h-3" />
                    -{Math.round(((vipPackage.originalPrice - vipPackage.currentPrice) / vipPackage.originalPrice) * 100)}%
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center mb-2">
                  <FiGift className="w-6 h-6 text-yellow-500" />
                </div>
                <CardTitle className="text-xl font-bold">{vipPackage.name}</CardTitle>
                {vipPackage.description && (
                  <p className="text-sm text-muted-foreground">{vipPackage.description}</p>
                )}
              </CardHeader>

              <CardContent className="flex flex-col flex-1 space-y-4">
                {/* Thông tin giá */}
                <div className="text-center">
                  <div className="space-y-1">
                    {vipPackage.onDiscount ? (
                      <>
                        <div className="text-lg text-muted-foreground line-through flex items-center justify-center gap-1">
                          <Image
                            src="/images/linh-thach.webp"
                            alt="linh thạch"
                            width={16}
                            height={16}
                            className="inline-block"
                          />
                          <span>{vipPackage.originalPrice.toLocaleString()}</span>
                        </div>
                        <div className="text-2xl font-bold text-primary flex items-center justify-center gap-2">
                          <Image
                            src="/images/linh-thach.webp"
                            alt="linh thạch"
                            width={20}
                            height={20}
                            className="inline-block"
                          />
                          <span>{vipPackage.currentPrice.toLocaleString()}</span>
                        </div>
                      </>
                    ) : (
                      <div className="text-2xl font-bold text-primary flex items-center justify-center gap-2">
                        <Image
                          src="/images/linh-thach.webp"
                          alt="linh thạch"
                          width={20}
                          height={20}
                          className="inline-block"
                        />
                        <span>{vipPackage.currentPrice.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="text-sm text-muted-foreground">Giá gói VIP</div>
                  </div>
                </div>

                {/* Thông tin thời hạn */}
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <FiCalendar className="w-4 h-4" />
                  <span>{vipPackage.durationDays} ngày</span>
                </div>

                {/* Thông tin discount nếu có */}
                {vipPackage.onDiscount && (
                  <div className="text-center p-2 bg-destructive/10 rounded-lg">
                    <div className="text-sm text-destructive font-medium">
                      Ưu đãi còn {getDaysUntilDiscountEnd(vipPackage.discountEndDate)} ngày
                    </div>
                  </div>
                )}

                {/* Spacer để đẩy nút xuống dưới */}
                <div className="flex-1"></div>

                {/* Nút mua */}
                <Button
                  onClick={() => handlePurchase(vipPackage.id)}
                  disabled={!isAuthenticated || isPurchasing === vipPackage.id || !vipPackage.isActive}
                  className="w-full mt-auto"
                  size="lg"
                >
                  {isPurchasing === vipPackage.id ? (
                    <>
                      <FiLoader className="w-4 h-4 animate-spin mr-2" />
                      Đang xử lý...
                    </>
                  ) : !isAuthenticated ? (
                    "Đăng nhập để mua"
                  ) : !vipPackage.isActive ? (
                    "Không khả dụng"
                  ) : (
                    <>
                      <Image
                        src="/images/linh-thach.webp"
                        alt="linh thạch"
                        width={16}
                        height={16}
                        className="inline-block mr-2"
                      />
                      Mua ngay
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Thông tin bổ sung */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Quyền lợi thành viên VIP</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <FiStar className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">Đọc không giới hạn</h3>
                  <p className="text-sm text-muted-foreground">
                    Truy cập tất cả chương VIP của mọi bộ truyện
                  </p>
                </div>

                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <FiGift className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">Đọc trước</h3>
                  <p className="text-sm text-muted-foreground">
                    Đọc trước các chương mới nhất
                  </p>
                </div>

                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <FiStar className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">Không quảng cáo</h3>
                  <p className="text-sm text-muted-foreground">
                    Trải nghiệm đọc truyện không bị gián đoạn
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lưu ý cho user chưa đăng nhập */}
        {!isAuthenticated && (
          <div className="mt-8 text-center">
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <p className="text-muted-foreground">
                  Bạn cần <span className="font-semibold text-primary">đăng nhập</span> để có thể mua gói VIP
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Main>
  );
} 