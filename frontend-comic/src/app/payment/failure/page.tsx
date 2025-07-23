"use client";

import Main from "@/components/layout/Main";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { cancelTransaction } from "@/services/paymentService";
import { TransactionResponse } from "@/types/payment";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { FiAlertTriangle, FiArrowLeft, FiClock, FiDollarSign, FiHome, FiRefreshCw, FiXCircle } from "react-icons/fi";

function PaymentFailureContent() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [transaction, setTransaction] = useState<TransactionResponse | null>(null);
  const [errorCode, setErrorCode] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const fetchTransactionInfo = async () => {
      try {
        setIsLoading(true);

        // Lấy thông tin từ URL params
        const orderCode = searchParams.get("orderCode");
        const code = searchParams.get("code");
        const urlErrorCode = searchParams.get("errorCode");
        const urlErrorMessage = searchParams.get("errorMessage");

        // Set error info từ URL
        setErrorCode(urlErrorCode || code || "UNKNOWN");
        setErrorMessage(urlErrorMessage || "Thanh toán không thành công");

        if (orderCode) {
          try {
            const response = await cancelTransaction(orderCode);
            if (response.status === 200 && response.data) {
              setTransaction(response.data);
            }
          } catch (err) {
            console.log("Cannot fetch transaction info:", err);
          }
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching transaction info:", err);
        setIsLoading(false);
      }
    };

    fetchTransactionInfo();
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

  const getErrorDisplay = () => {
    if (errorMessage && errorCode && errorCode !== "UNKNOWN") {
      return `${errorMessage} (Mã lỗi: ${errorCode})`;
    }
    return errorMessage || "Thanh toán không thành công";
  };

  const getHelpMessage = () => {
    switch (errorCode) {
      case "INSUFFICIENT_BALANCE":
        return "Số dư trong tài khoản không đủ để thực hiện giao dịch.";
      case "EXPIRED_PAYMENT":
        return "Liên kết thanh toán đã hết hạn. Vui lòng tạo giao dịch mới.";
      case "CANCELLED_BY_USER":
      case "true": // cancel=true
        return "Giao dịch đã bị hủy bởi người dùng.";
      case "BANK_ERROR":
        return "Có lỗi từ phía ngân hàng. Vui lòng thử lại sau.";
      case "NETWORK_ERROR":
        return "Lỗi kết nối mạng. Vui lòng kiểm tra internet và thử lại.";
      case "01":
        return "Ngân hàng từ chối giao dịch. Vui lòng kiểm tra thông tin thẻ.";
      case "02":
        return "Ngân hàng từ chối giao dịch. Vui lòng liên hệ ngân hàng.";
      case "05":
        return "Ngân hàng từ chối giao dịch. Vui lòng liên hệ ngân hàng.";
      case "06":
        return "Có lỗi xảy ra. Vui lòng thử lại sau.";
      case "07":
        return "Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).";
      default:
        return "Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại hoặc liên hệ hỗ trợ.";
    }
  };

  if (isLoading) {
    return (
      <div className="my-8">
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="lg" className="mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Đang kiểm tra giao dịch</h2>
            <p className="text-muted-foreground">
              Vui lòng chờ trong giây lát...
            </p>
          </div>
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
                <FiXCircle className="w-4 h-4" />
                Thanh toán thất bại
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Error Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiXCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-red-600 dark:text-red-400 mb-2">
            {transaction?.status === "FAILED"
              ? "Thanh toán thất bại"
              : transaction?.status === "PENDING"
                ? "Thanh toán đang xử lý"
                : "Thanh toán thất bại"
            }
          </h1>
          <p className="text-lg text-muted-foreground">
            {transaction?.status === "FAILED"
              ? "Giao dịch của bạn không thể hoàn tất"
              : transaction?.status === "PENDING"
                ? "Giao dịch đang được xử lý, vui lòng chờ"
                : "Giao dịch của bạn không thể hoàn tất"
            }
          </p>
        </div>

        {/* Error Details */}
        <Card className="mb-6 border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <FiXCircle className="w-5 h-5" />
              Thông tin giao dịch
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-red-50 dark:bg-red-950/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
              <div className="space-y-3">
                {transaction && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Số lượng dự định nạp:</span>
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
                      <span className="text-sm text-muted-foreground">Số tiền dự định thanh toán:</span>
                      <span className="font-semibold">
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
                  </>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Trạng thái:</span>
                  <Badge
                    className={
                      transaction?.status === "FAILED"
                        ? "bg-red-600 dark:bg-red-500"
                        : transaction?.status === "PENDING"
                          ? "bg-yellow-600 dark:bg-yellow-500"
                          : "bg-red-600 dark:bg-red-500"
                    }
                  >
                    {transaction?.status === "FAILED"
                      ? "Thất bại"
                      : transaction?.status === "PENDING"
                        ? "Đang xử lý"
                        : transaction?.status === "COMPLETED"
                          ? "Hoàn thành"
                          : "Thất bại"
                    }
                  </Badge>
                </div>

                <div className="pt-2 border-t">
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-muted-foreground">Lỗi:</span>
                    <span className="text-sm text-red-600 dark:text-red-400 text-right max-w-[60%]">
                      {getErrorDisplay()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Help Message */}
            <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex gap-2">
                <FiAlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800 dark:text-yellow-200">
                  <p className="font-medium mb-1">Nguyên nhân có thể:</p>
                  <p className="text-xs">
                    {getHelpMessage()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Suggested Solutions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FiRefreshCw className="w-5 h-5" />
              Giải pháp đề xuất
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <span className="w-6 h-6 bg-blue-600 dark:bg-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <p className="font-medium text-sm text-blue-800 dark:text-blue-200">
                    Kiểm tra thông tin thanh toán
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-300">
                    Đảm bảo số dư tài khoản đủ và thông tin thẻ chính xác
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <span className="w-6 h-6 bg-blue-600 dark:bg-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <p className="font-medium text-sm text-blue-800 dark:text-blue-200">
                    Thử lại sau ít phút
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-300">
                    Hệ thống có thể tạm thời bận, vui lòng thử lại sau 5-10 phút
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <span className="w-6 h-6 bg-blue-600 dark:bg-blue-500 text-white text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <p className="font-medium text-sm text-blue-800 dark:text-blue-200">
                    Liên hệ hỗ trợ
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-300">
                    Nếu vẫn gặp vấn đề, liên hệ với chúng tôi để được hỗ trợ
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button
            asChild
            className="h-12 w-full"
          >
            <Link href="/payment" className="flex items-center justify-center gap-2">
              <FiRefreshCw className="w-4 h-4" />
              Thử lại
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full h-12 text-base"
            size="lg"
          >
            <Link href="/" className="flex items-center justify-center gap-2">
              <FiArrowLeft className="w-5 h-5" />
              Về trang chủ
            </Link>
          </Button>
        </div>

        {/* Footer Note */}
        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border text-center">
          <p className="text-xs text-muted-foreground">
            Nếu tiền đã bị trừ nhưng giao dịch thất bại, vui lòng{" "}
            <Link href="/contact" className="text-primary hover:underline">
              liên hệ hỗ trợ ngay
            </Link>{" "}
            để được hoàn tiền.
          </p>
        </div>
      </div>
    </div>
  );
}

function PaymentFailurePage() {
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
        <PaymentFailureContent />
      </Suspense>
    </Main>
  );
}

export default PaymentFailurePage; 