"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createPaymentLink } from "@/services/paymentService";
import { useAuthState } from "@/hooks/useAuthState";
import Main from "@/components/layout/Main";
import Link from "next/link";
import Image from "next/image";
import { FiHome, FiDollarSign, FiCreditCard, FiInfo, FiArrowRight, FiLoader, FiCheckCircle, FiX } from "react-icons/fi";
import toast from "react-hot-toast";


function PaymentPage() {
  const { isAuthenticated } = useAuthState();
  const [amount, setAmount] = useState<number>(2); // Số linh thạch, tối thiểu 2
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Tỉ lệ quy đổi: 1000VND = 1 Linh thạch
  const EXCHANGE_RATE = 1000;
  const MIN_AMOUNT = 2;
  const MAX_AMOUNT = 1000;

  // Tính toán số tiền VND
  const vndAmount = amount * EXCHANGE_RATE;

  // Các gói nạp được đề xuất
  const suggestedPackages = [
    { coins: 2, vnd: 2000, popular: false },
    { coins: 5, vnd: 5000, popular: false },
    { coins: 10, vnd: 10000, popular: true },
    { coins: 20, vnd: 20000, popular: false },
    { coins: 50, vnd: 50000, popular: false },
    { coins: 100, vnd: 100000, popular: false },
  ];

  const handleAmountChange = (value: string) => {
    const numValue = parseInt(value) || 0;

    // Kiểm tra giá trị trong khoảng cho phép
    if (numValue >= 0 && numValue <= MAX_AMOUNT) {
      setAmount(numValue);

      // Xóa lỗi nếu giá trị hợp lệ
      if (numValue >= MIN_AMOUNT && numValue <= MAX_AMOUNT) {
        setError("");
      } else if (numValue > 0 && numValue < MIN_AMOUNT) {
        setError(`Số linh thạch tối thiểu là ${MIN_AMOUNT}`);
      } else if (numValue > MAX_AMOUNT) {
        setError(`Số linh thạch tối đa là ${MAX_AMOUNT}`);
      }
    }
  };

  const handleSuggestedPackage = (coins: number) => {
    setAmount(coins);
    setError("");
  };

  const handlePaymentClick = () => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để nạp tiền");
      return;
    }

    if (amount < MIN_AMOUNT) {
      setError(`Số linh thạch tối thiểu là ${MIN_AMOUNT}`);
      return;
    }

    if (amount > MAX_AMOUNT) {
      setError(`Số linh thạch tối đa là ${MAX_AMOUNT}`);
      return;
    }

    setError("");
    setShowConfirmModal(true);
  };

  const handleConfirmPayment = async () => {
    setShowConfirmModal(false);
    setIsLoading(true);
    setError("");

    try {
      const response = await createPaymentLink(amount);
      if (response.status === 200) {
        // Chuyển hướng đến link thanh toán
        window.open(response.data?.paymentLink);
        toast.success("Đã tạo liên kết thanh toán thành công!");
      } else {
        toast.error(response.message || "Có lỗi xảy ra khi tạo liên kết thanh toán");
        setError("Có lỗi xảy ra khi tạo liên kết thanh toán. Vui lòng thử lại.");
      }
    } catch (err) {
      toast.error("Có lỗi xảy ra khi tạo liên kết thanh toán");
      setError("Có lỗi xảy ra khi tạo liên kết thanh toán. Vui lòng thử lại.");
      console.error("Payment error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelPayment = () => {
    setShowConfirmModal(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <Main>
      <div className="my-4 sm:my-6 lg:my-8">
        {/* Breadcrumb Navigation */}
        <div className="mb-4 sm:mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/" className="flex items-center gap-1">
                    <FiHome className="w-4 h-4" />
                    Trang chủ
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="flex items-center gap-1">
                  <FiDollarSign className="w-4 h-4" />
                  Nạp Linh Thạch
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <FiDollarSign className="w-8 h-8 text-primary mr-3" />
            <h1 className="text-3xl md:text-4xl font-bold">Nạp Linh Thạch</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Nạp tiền để mua các chương truyện VIP và hỗ trợ tác giả yêu thích của bạn
          </p>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
              <FiLoader className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Đang tạo liên kết thanh toán...</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Thông tin tỉ lệ quy đổi */}
          <div className="lg:col-span-1">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FiInfo className="w-5 h-5" />
                  Thông Tin Nạp Tiền
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-sm mb-2 text-blue-800 dark:text-blue-200">
                    Tỉ lệ quy đổi
                  </h4>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    1,000 VND = 1 Linh thạch
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Nạp tối thiểu:</span>
                    <span className="font-medium">{MIN_AMOUNT} Linh thạch</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Nạp tối đa:</span>
                    <span className="font-medium">{MAX_AMOUNT.toLocaleString()} Linh thạch</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Phương thức:</span>
                    <span className="font-medium">Ví điện tử, Ngân hàng</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Thời gian xử lý:</span>
                    <span className="font-medium">Tức thì</span>
                  </div>
                </div>

                <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <p className="text-xs text-yellow-800 dark:text-yellow-200">
                    💡 <strong>Lưu ý:</strong> Linh thạch sẽ được cộng vào tài khoản ngay sau khi thanh toán thành công.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Form nạp tiền */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FiCreditCard className="w-5 h-5" />
                  Chọn Số Lượng Nạp
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Gói đề xuất */}
                <div>
                  <Label className="text-base font-semibold mb-3 block">
                    Gói được đề xuất
                  </Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {suggestedPackages.map((pkg, index) => (
                      <Button
                        key={pkg.coins}
                        variant={amount === pkg.coins ? "default" : "outline"}
                        className={`h-auto p-4 flex-col relative transition-all duration-300 hover:scale-105 ${index === 2 ? 'border-primary shadow-md' : ''
                          }`}
                        onClick={() => handleSuggestedPackage(pkg.coins)}
                      >
                        {pkg.popular && (
                          <Badge className="absolute -top-2 -right-2 text-xs bg-primary">
                            Phổ biến
                          </Badge>
                        )}
                        <div className="flex items-center gap-1 mb-2">
                          <Image
                            src="/images/linh-thach.webp"
                            alt="linh thạch"
                            width={16}
                            height={16}
                            className="inline-block"
                          />
                          <span className="font-bold">{pkg.coins}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatCurrency(pkg.vnd)}
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Nhập số lượng tùy chỉnh */}
                <div className="space-y-4">
                  <Label htmlFor="amount" className="text-base font-semibold">
                    Hoặc nhập số lượng tùy chỉnh
                  </Label>
                  <div className="space-y-2">
                    <div className="relative">
                      <Input
                        id="amount"
                        type="number"
                        min={MIN_AMOUNT}
                        max={MAX_AMOUNT}
                        value={amount}
                        onChange={(e) => handleAmountChange(e.target.value)}
                        className="pr-28 h-12"
                        placeholder={`Tối thiểu ${MIN_AMOUNT}`}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-sm text-muted-foreground">
                        <Image
                          src="/images/linh-thach.webp"
                          alt="linh thạch"
                          width={16}
                          height={16}
                          className="inline-block"
                        />
                        <span>Linh thạch</span>
                      </div>
                    </div>
                    {error && (
                      <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Hiển thị số tiền VND */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Số linh thạch:
                      </span>
                      <div className="flex items-center gap-1 font-semibold">
                        <Image
                          src="/images/linh-thach.webp"
                          alt="linh thạch"
                          width={16}
                          height={16}
                          className="inline-block"
                        />
                        <span>{amount.toLocaleString()}</span>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-base font-medium">
                        Số tiền thanh toán:
                      </span>
                      <span className="text-xl font-bold text-primary">
                        {formatCurrency(vndAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Nút thanh toán */}
                <Button
                  onClick={handlePaymentClick}
                  disabled={isLoading || amount < MIN_AMOUNT || amount > MAX_AMOUNT || !isAuthenticated}
                  className="w-full h-14 text-base font-semibold"
                  size="lg"
                >
                  {isLoading ? (
                    <LoadingSpinner className="mr-2" />
                  ) : (
                    <FiArrowRight className="mr-2 w-5 h-5" />
                  )}
                  {isLoading ? "Đang xử lý..." : "Thanh toán ngay"}
                </Button>

                {!isAuthenticated && (
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-center text-yellow-800 dark:text-yellow-200">
                    Vui lòng đăng nhập để thực hiện nạp tiền
                  </div>
                )}

                <p className="text-xs text-muted-foreground text-center">
                  Bằng cách nhấn &quot;Thanh toán ngay&quot;, bạn đồng ý với{" "}
                  <Link href="#" className="text-primary hover:underline">
                    điều khoản sử dụng
                  </Link>{" "}
                  của chúng tôi.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Modal xác nhận thanh toán */}
        <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FiCheckCircle className="w-5 h-5 text-primary" />
                Xác nhận thanh toán
              </DialogTitle>
              <DialogDescription>
                Vui lòng kiểm tra lại thông tin thanh toán trước khi xác nhận
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Thông tin giao dịch */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border">
                <h4 className="font-semibold mb-3 text-sm text-muted-foreground">
                  THÔNG TIN GIAO DỊCH
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Số lượng nạp:</span>
                    <div className="flex items-center gap-1 font-semibold">
                      <Image
                        src="/images/linh-thach.webp"
                        alt="linh thạch"
                        width={16}
                        height={16}
                        className="inline-block"
                      />
                      <span>{amount.toLocaleString()} Linh thạch</span>
                    </div>
                  </div>

                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Tỉ lệ quy đổi:</span>
                      <span className="text-sm text-muted-foreground">
                        1,000 VND = 1 Linh thạch
                      </span>
                    </div>
                  </div>

                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Tổng thanh toán:</span>
                      <span className="text-lg font-bold text-primary">
                        {formatCurrency(vndAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lưu ý */}
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex gap-2">
                  <FiInfo className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-blue-800 dark:text-blue-200">
                    <p className="font-medium mb-1">Lưu ý quan trọng:</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Linh thạch sẽ được cộng vào tài khoản ngay sau khi thanh toán thành công</li>
                      <li>• Vui lòng hoàn tất thanh toán trong 15 phút</li>
                      <li>• Nếu gặp sự cố, vui lòng liên hệ hỗ trợ</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={handleCancelPayment}
                disabled={isLoading}
                className="flex-1"
              >
                <FiX className="w-4 h-4 mr-2" />
                Hủy bỏ
              </Button>
              <Button
                onClick={handleConfirmPayment}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <LoadingSpinner className="w-4 h-4 mr-2" />
                ) : (
                  <FiCheckCircle className="w-4 h-4 mr-2" />
                )}
                {isLoading ? "Đang xử lý..." : "Xác nhận thanh toán"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Main>
  );
}

export default PaymentPage; 