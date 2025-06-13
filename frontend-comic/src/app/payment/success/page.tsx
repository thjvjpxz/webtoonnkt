"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Main from "@/components/layout/Main";
import Link from "next/link";
import Image from "next/image";
import { FiHome, FiCheckCircle, FiArrowRight, FiDollarSign, FiClock, FiUser, FiXCircle } from "react-icons/fi";
import { useAuthState } from "@/hooks/useAuthState";
import { getTransactionByOrderCode } from "@/services/paymentService";
import { TransactionResponse } from "@/types/payment";
import toast from "react-hot-toast";

function PaymentSuccessContent() {
  const { isAuthenticated } = useAuthState();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [transaction, setTransaction] = useState<TransactionResponse | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        setIsLoading(true);
        setError("");

        // Lấy orderCode từ URL params
        const orderCode = searchParams.get("orderCode");
        const code = searchParams.get("code");

        if (!orderCode) {
          setError("Không tìm thấy mã đơn hàng");
          setIsLoading(false);
          return;
        }

        // Kiểm tra status từ URL - cho phép cả COMPLETED và PENDING vào page success
        if (code !== "00") {
          setError("Thanh toán không thành công");
          setIsLoading(false);
          return;
        }

        // Call API để lấy thông tin giao dịch
        const response = await getTransactionByOrderCode(orderCode);

        if (response.status === 200 && response.data) {
          setTransaction(response.data);
          toast.success("Xác thực giao dịch thành công!");
        } else {
          setError(response.message || "Không thể xác thực giao dịch");
          toast.error("Không thể xác thực giao dịch");
        }
      } catch (err) {
        console.error("Error fetching transaction:", err);
        setError("Có lỗi xảy ra khi xác thực giao dịch");
        toast.error("Có lỗi xảy ra khi xác thực giao dịch");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransaction();
  }, [searchParams]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDateTime = (timestamp?: string) => {
    if (!timestamp) return "Không xác định";
    try {
      return new Date(timestamp).toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch {
      return "Không xác định";
    }
  };

  if (isLoading) {
    return (
      <div className="my-8">
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="lg" className="mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Đang xác minh thanh toán</h2>
            <p className="text-muted-foreground">
              Vui lòng chờ trong giây lát...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-8">
        <div className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiXCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Có lỗi xảy ra</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button asChild>
            <Link href="/payment">Quay lại trang nạp tiền</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="my-8">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-xl font-semibold mb-2">Không tìm thấy giao dịch</h2>
          <p className="text-muted-foreground mb-4">
            Không thể tìm thấy thông tin giao dịch
          </p>
          <Button asChild>
            <Link href="/payment">Quay lại trang nạp tiền</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
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
              <BreadcrumbLink asChild>
                <Link href="/payment" className="flex items-center gap-1">
                  <FiDollarSign className="w-4 h-4" />
                  Nạp Linh Thạch
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="flex items-center gap-1">
                <FiCheckCircle className="w-4 h-4" />
                Thanh toán thành công
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
            {transaction?.status === "COMPLETED"
              ? "Thanh toán thành công!"
              : transaction?.status === "PENDING"
                ? "Thanh toán đang xử lý"
                : "Thanh toán thành công!"
            }
          </h1>
          <p className="text-lg text-muted-foreground">
            {transaction?.status === "COMPLETED"
              ? "Linh thạch đã được cộng vào tài khoản của bạn"
              : transaction?.status === "PENDING"
                ? "Giao dịch đang được xử lý, vui lòng chờ trong giây lát"
                : "Linh thạch đã được cộng vào tài khoản của bạn"
            }
          </p>
        </div>

        {/* Payment Details */}
        <Card className="mb-6 border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <FiCheckCircle className="w-5 h-5" />
              Thông tin giao dịch
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Số lượng nạp:</span>
                  <div className="flex items-center gap-1 font-semibold">
                    <Image
                      src="/images/linh-thach.webp"
                      alt="linh thạch"
                      width={16}
                      height={16}
                      className="inline-block"
                    />
                    <span>{transaction.amount.toLocaleString()} Linh thạch</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Số tiền đã thanh toán:</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {formatCurrency(transaction.amount * 1000)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Mã đơn hàng:</span>
                  <Badge variant="outline" className="font-mono text-xs">
                    {searchParams.get("orderCode")}
                  </Badge>
                </div>



                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Thời gian:</span>
                  <div className="flex items-center gap-1 text-sm">
                    <FiClock className="w-4 h-4" />
                    <span>{formatDateTime(transaction.updatedAt)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Trạng thái:</span>
                  <Badge
                    className={
                      transaction.status === "COMPLETED"
                        ? "bg-green-600 dark:bg-green-500"
                        : transaction.status === "PENDING"
                          ? "bg-yellow-600 dark:bg-yellow-500"
                          : "bg-red-600 dark:bg-red-500"
                    }
                  >
                    {transaction.status === "COMPLETED"
                      ? "Hoàn thành"
                      : transaction.status === "PENDING"
                        ? "Đang xử lý"
                        : transaction.status === "FAILED"
                          ? "Thất bại"
                          : transaction.status
                    }
                  </Badge>
                </div>
              </div>
            </div>

            {/* Status Message */}
            <div className={`p-4 border rounded-lg ${transaction?.status === "COMPLETED"
              ? "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800"
              : transaction?.status === "PENDING"
                ? "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800"
                : "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800"
              }`}>
              <div className="flex gap-2">
                <FiCheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${transaction?.status === "COMPLETED"
                  ? "text-blue-600 dark:text-blue-400"
                  : transaction?.status === "PENDING"
                    ? "text-yellow-600 dark:text-yellow-400"
                    : "text-blue-600 dark:text-blue-400"
                  }`} />
                <div className={`text-sm ${transaction?.status === "COMPLETED"
                  ? "text-blue-800 dark:text-blue-200"
                  : transaction?.status === "PENDING"
                    ? "text-yellow-800 dark:text-yellow-200"
                    : "text-blue-800 dark:text-blue-200"
                  }`}>
                  <p className="font-medium mb-1">
                    {transaction?.status === "COMPLETED"
                      ? "Nạp tiền thành công!"
                      : transaction?.status === "PENDING"
                        ? "Đang xử lý giao dịch"
                        : "Nạp tiền thành công!"
                    }
                  </p>
                  <p className="text-xs">
                    {transaction?.status === "COMPLETED"
                      ? "Linh thạch đã được cộng vào tài khoản của bạn và có thể sử dụng ngay để đọc các chương VIP."
                      : transaction?.status === "PENDING"
                        ? "Giao dịch đang được xử lý bởi hệ thống. Linh thạch sẽ được cộng vào tài khoản sau khi hoàn tất."
                        : "Linh thạch đã được cộng vào tài khoản của bạn và có thể sử dụng ngay để đọc các chương VIP."
                    }
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              asChild
              variant="outline"
              className="h-12"
            >
              <Link href="/payment" className="flex items-center justify-center gap-2">
                <FiDollarSign className="w-4 h-4" />
                Nạp thêm
              </Link>
            </Button>

            {isAuthenticated && (
              <Button
                asChild
                variant="outline"
                className="h-12"
              >
                <Link href="/profile" className="flex items-center justify-center gap-2">
                  <FiUser className="w-4 h-4" />
                  Xem hồ sơ
                </Link>
              </Button>
            )}
          </div>

          <Button
            asChild
            className="w-full h-12 text-base"
            size="lg"
          >
            <Link href="/" className="flex items-center justify-center gap-2">
              <FiArrowRight className="w-5 h-5" />
              Về trang chủ
            </Link>
          </Button>
        </div>

        {/* Footer Note */}
        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border text-center">
          <p className="text-xs text-muted-foreground">
            Nếu bạn gặp vấn đề với giao dịch này, vui lòng{" "}
            <Link href="/contact" className="text-primary hover:underline">
              liên hệ hỗ trợ
            </Link>{" "}
            với mã giao dịch bên trên.
          </p>
        </div>
      </div>
    </div>
  );
}

function PaymentSuccessPage() {
  return (
    <Main>
      <Suspense fallback={
        <div className="my-8">
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center">
              <LoadingSpinner size="lg" className="mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Đang tải trang</h2>
              <p className="text-muted-foreground">
                Vui lòng chờ trong giây lát...
              </p>
            </div>
          </div>
        </div>
      }>
        <PaymentSuccessContent />
      </Suspense>
    </Main>
  );
}

export default PaymentSuccessPage; 