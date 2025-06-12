'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiCalendar, FiDollarSign, FiHome, FiList, FiUser } from "react-icons/fi";
import Image from "next/image";

import Main from "@/components/layout/Main";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Pagination from "@/components/ui/pagination";

import { useAuthState } from "@/hooks/useAuthState";
import { getMyTransactions } from "@/services/paymentService";
import { TransactionResponse } from "@/types/payment";
import { formatDate } from "@/utils/helpers";

export default function TransactionsPage() {
  const { isAuthenticated } = useAuthState();
  const router = useRouter();

  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  // Redirect nếu chưa đăng nhập
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }
  }, [isAuthenticated, router]);

  // Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!isAuthenticated) return;

      try {
        setIsLoading(true);
        setError(null);
        const response = await getMyTransactions(currentPage, limit);

        if (response.status === 200 && response.data) {
          setTransactions(response.data);
          setTotalPages(Math.max(1, Math.ceil(response.data.length / limit)));
        } else {
          if (response.status === 401) {
            setError("Vui lòng đăng nhập để xem lịch sử giao dịch");
          } else {
            setError(response.message || "Không thể tải lịch sử giao dịch");
          }
        }
      } catch (error) {
        setError("Đã xảy ra lỗi khi tải lịch sử giao dịch");
        console.error('Lỗi khi fetch transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [isAuthenticated, currentPage]);

  // Format tiền tệ dưới dạng linh thạch
  const formatCurrency = (amount: number) => {
    return (
      <div className="flex items-center gap-1">
        <Image
          src="/images/linh-thach.webp"
          alt="linh thạch"
          width={16}
          height={16}
          className="inline-block"
        />
        <span>{amount.toLocaleString()}</span>
      </div>
    );
  };

  // Hiển thị trạng thái giao dịch
  const renderStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
      case 'completed':
        return <Badge className="bg-green-500">Thành công</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Đang xử lý</Badge>;
      case 'failed':
      case 'cancelled':
        return <Badge className="bg-red-500">Thất bại</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Xử lý khi thay đổi trang
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Không render gì nếu chưa đăng nhập (để tránh flash)
  if (!isAuthenticated) {
    return null;
  }

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
                <BreadcrumbLink asChild>
                  <Link href="/profile" className="flex items-center gap-1">
                    <FiUser className="w-4 h-4" />
                    Hồ sơ cá nhân
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="flex items-center gap-1">
                  <FiList className="w-4 h-4" />
                  Lịch sử giao dịch
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FiDollarSign className="w-5 h-5" />
              Lịch sử giao dịch
            </CardTitle>
            <CardDescription>
              Xem lịch sử nạp linh thạch và các giao dịch của bạn
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Error state */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-4">
                <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                <Button
                  variant="destructive"
                  onClick={() => window.location.reload()}
                >
                  Thử lại
                </Button>
              </div>
            )}

            {/* Loading state */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <LoadingSpinner size="lg" />
                  <p className="text-gray-600 dark:text-gray-400 mt-4">Đang tải lịch sử giao dịch...</p>
                </div>
              </div>
            ) : transactions.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã giao dịch</TableHead>
                      <TableHead>Mô tả</TableHead>
                      <TableHead>Linh thạch</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Thời gian</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">{transaction.transactionCode}</TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                        <TableCell>{renderStatus(transaction.status)}</TableCell>
                        <TableCell>{formatDate(transaction.updatedAt)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <FiCalendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Chưa có giao dịch nào</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Bạn chưa có giao dịch nào trong hệ thống
                </p>
                <Button asChild>
                  <Link href="/payment">Nạp linh thạch ngay</Link>
                </Button>
              </div>
            )}
          </CardContent>

          {/* Pagination */}
          {!isLoading && transactions.length > 0 && totalPages > 1 && (
            <CardFooter>
              <div className="w-full flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </Main>
  );
} 