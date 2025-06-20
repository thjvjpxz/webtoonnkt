"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuthState } from "@/hooks/useAuthState";
import { getPublicVipPackages } from "@/services/vipPackageService";
import { VipPackage, VipSubscription } from "@/types/vipPackage";
import { FiStar, FiCalendar, FiPercent, FiLoader, FiGift, FiClock } from "react-icons/fi";
import toast from "react-hot-toast";
import Main from "@/components/layout/Main";
import Image from "next/image";
import { buyVipPackage, getMyVipSubscription } from "@/services/homeService";
import { getUserFromLocalStorage } from "@/utils/authUtils";

export default function VipPurchasePage() {
  const { user, isAuthenticated } = useAuthState();
  const [vipPackages, setVipPackages] = useState<VipPackage[]>([]);
  const [vipSubscription, setVipSubscription] = useState<VipSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState<string | null>(null);

  // Fetch danh sách gói VIP và thông tin subscription
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch gói VIP
        const packagesResponse = await getPublicVipPackages();
        if (packagesResponse.status === 200 && packagesResponse.data) {
          // Sắp xếp theo giá từ thấp đến cao
          const sortedPackages = packagesResponse.data.sort((a, b) => a.currentPrice - b.currentPrice);
          setVipPackages(sortedPackages);
        } else {
          toast.error(packagesResponse.message || "Không thể tải danh sách gói VIP");
        }

        // Fetch thông tin VIP subscription nếu user đã đăng nhập
        if (isAuthenticated) {
          try {
            const subscriptionResponse = await getMyVipSubscription();
            if (subscriptionResponse.status === 200 && subscriptionResponse.data) {
              setVipSubscription(subscriptionResponse.data);
            }
          } catch (error) {
            // Không hiển thị lỗi nếu user chưa có VIP
            console.log("User chưa có VIP subscription", error);
          }
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        toast.error("Có lỗi xảy ra khi tải dữ liệu");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  // Xử lý mua gói VIP
  const handlePurchase = async (packageId: string) => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để mua gói VIP");
      return;
    }

    try {
      setIsPurchasing(packageId);

      const response = await buyVipPackage(packageId);

      if (response.status === 200) {
        toast.success(response.message || "Mua gói VIP thành công!");
        // Refresh thông tin VIP subscription sau khi mua thành công
        try {
          const subscriptionResponse = await getMyVipSubscription();
          if (subscriptionResponse.status === 200 && subscriptionResponse.data) {
            setVipSubscription(subscriptionResponse.data);

            const userData = getUserFromLocalStorage();
            if (userData) {
              userData.vip = true;
              localStorage.setItem("user", JSON.stringify(userData));
              window.location.reload();
            }
          }
        } catch (error) {
          console.log("Không thể tải lại thông tin VIP", error);
        }
      } else {
        toast.error(response.message || "Có lỗi xảy ra khi mua gói VIP");
      }

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

  // Format date cho hiển thị
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Tên tài khoản:</span>
                  <span className="font-medium">{user.username}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Trạng thái VIP:</span>
                  <Badge variant={vipSubscription?.isActive ? "default" : "secondary"}>
                    {vipSubscription?.isActive ? "VIP" : "Thường"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Hiển thị thông tin VIP subscription nếu có */}
        {isAuthenticated && vipSubscription && vipSubscription.isActive && (
          <Card className="mb-8 border-primary/20 bg-gradient-to-r from-primary/5 to-yellow-500/10">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <FiStar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <span className="text-foreground font-bold text-lg">
                      Thành viên VIP
                    </span>
                    <p className="text-sm text-muted-foreground font-normal mt-1">
                      Bạn đang sử dụng gói VIP premium
                    </p>
                  </div>
                </CardTitle>
                <Badge className="bg-primary text-primary-foreground border-0 px-3 py-1 font-medium">
                  <FiGift className="w-3 h-3 mr-1" />
                  ACTIVE
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {/* Countdown section */}
              <div className="mb-6 p-4 bg-muted/50 rounded-lg border">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <FiClock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Thời gian còn lại</span>
                </div>
                <div className="text-center">
                  <div className={`text-4xl font-bold ${vipSubscription.daysRemaining <= 7 ? 'text-destructive' : 'text-green-600 dark:text-green-400'}`}>
                    {vipSubscription.daysRemaining}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">ngày</div>
                </div>
              </div>

              {/* Detail information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="p-2 bg-green-100 dark:bg-green-800 rounded-full">
                    <FiCalendar className="w-4 h-4 text-green-700 dark:text-green-300" />
                  </div>
                  <div>
                    <div className="text-xs text-green-600 dark:text-green-400 font-medium uppercase tracking-wide">Ngày bắt đầu</div>
                    <div className="font-semibold text-foreground">{formatDate(vipSubscription.startDate)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                  <div className="p-2 bg-red-100 dark:bg-red-800 rounded-full">
                    <FiCalendar className="w-4 h-4 text-red-700 dark:text-red-300" />
                  </div>
                  <div>
                    <div className="text-xs text-red-600 dark:text-red-400 font-medium uppercase tracking-wide">Ngày hết hạn</div>
                    <div className="font-semibold text-foreground">{formatDate(vipSubscription.endDate)}</div>
                  </div>
                </div>
              </div>

              {/* Warning for expiring subscription */}
              {vipSubscription.daysRemaining <= 7 && (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-yellow-100 dark:bg-yellow-800 rounded-full mt-0.5">
                      <FiClock className="w-4 h-4 text-yellow-700 dark:text-yellow-300" />
                    </div>
                    <div>
                      <h4 className="font-bold text-yellow-900 dark:text-yellow-100 mb-2">Gói VIP sắp hết hạn!</h4>
                      <p className="text-sm text-yellow-800 dark:text-yellow-200 leading-relaxed">
                        Gói VIP của bạn sẽ hết hạn trong <strong className="text-destructive">{vipSubscription.daysRemaining} ngày</strong>.
                        Hãy gia hạn ngay để tiếp tục trải nghiệm các tính năng VIP.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Danh sách gói VIP */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vipPackages.map((vipPackage, index) => {
            const discountPercent = vipPackage.onDiscount && vipPackage.originalPrice > 0
              ? Math.round(((vipPackage.originalPrice - vipPackage.currentPrice) / vipPackage.originalPrice) * 100)
              : 0;

            return (
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
                {vipPackage.onDiscount && discountPercent > 0 && (
                  <div className="absolute top-4 left-4 z-10">
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <FiPercent className="w-3 h-3" />
                      -{discountPercent}%
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
                      {vipPackage.onDiscount && vipPackage.originalPrice !== vipPackage.currentPrice ? (
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
                  {vipPackage.onDiscount && vipPackage.discountEndDate && (
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
                        {vipSubscription?.isActive ? "Gia hạn VIP" : "Mua ngay"}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
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
              <CardContent>
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