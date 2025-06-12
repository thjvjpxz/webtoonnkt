"use client";

import DashboardLayout from "@/components/admin/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Pagination from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useTransaction } from "@/hooks/useTransaction";
import { formatDate } from "@/utils/helpers";
import TransactionDetailModal from "@/components/admin/transactions/TransactionDetailModal";
import { useState } from "react";
import { TransactionResponse } from "@/types/payment";
import Image from "next/image";
import {
  FiAlertCircle,
  FiCreditCard,
  FiDollarSign,
  FiEye,
  FiFilter,
  FiRefreshCw,
  FiSearch,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";

// Hàm helper để format số linh thạch
const formatPrice = (price: number | undefined | null) => {
  if (price === undefined || price === null || isNaN(price)) {
    return '0';
  }
  return price.toLocaleString('vi-VN');
};

// Hàm helper để render trạng thái giao dịch
const renderTransactionStatus = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return (
        <Badge className="text-xs bg-emerald-500 text-white border-0 shadow-md hover:shadow-lg hover:bg-emerald-600 transition-all duration-300 hover:scale-105 font-medium">
          Đã thanh toán
        </Badge>
      );
    case "PENDING":
      return (
        <Badge className="text-xs bg-yellow-500 text-white border-0 shadow-md hover:shadow-lg hover:bg-yellow-600 transition-all duration-300 hover:scale-105 font-medium">
          Đang xử lý
        </Badge>
      );
    case "CANCELLED":
      return (
        <Badge className="text-xs bg-red-500 text-white border-0 shadow-md hover:shadow-lg hover:bg-red-600 transition-all duration-300 hover:scale-105 font-medium">
          Đã hủy
        </Badge>
      );
    case "FAILED":
      return (
        <Badge className="text-xs bg-red-500 text-white border-0 shadow-md hover:shadow-lg hover:bg-red-600 transition-all duration-300 hover:scale-105 font-medium">
          Thất bại
        </Badge>
      );
    default:
      return (
        <Badge className="text-xs bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200 transition-all duration-200 hover:scale-105">
          {status}
        </Badge>
      );
  }
};

// Hàm helper để render phương thức thanh toán
const renderPaymentMethod = (method: string) => {
  switch (method) {
    case "BALANCE":
      return (
        <Badge className="text-xs bg-blue-500 text-white border-0 shadow-md hover:shadow-lg hover:bg-blue-600 transition-all duration-300 hover:scale-105 font-medium">
          💰 Số dư
        </Badge>
      );
    case "PayOS":
      return (
        <Badge className="text-xs bg-purple-500 text-white border-0 shadow-md hover:shadow-lg hover:bg-purple-600 transition-all duration-300 hover:scale-105 font-medium">
          💳 PayOS
        </Badge>
      );
    default:
      return (
        <Badge className="text-xs bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200 transition-all duration-200 hover:scale-105">
          💰 {method}
        </Badge>
      );
  }
};

export default function Transactions() {
  const {
    // Data
    transactions,
    stats,

    // Pagination
    currentPage,
    totalPages,

    // Loading & Error states
    isLoading,
    error,

    // Filters
    searchTerm,
    statusFilter,
    paymentMethodFilter,

    // Actions
    setSearchTerm,
    handleSearch,
    handlePageChange,
    handleStatusFilterChange,
    handlePaymentMethodFilterChange,
    refreshData,
  } = useTransaction();

  // State cho modal chi tiết
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionResponse | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Hàm mở modal chi tiết
  const handleOpenDetailModal = (transaction: TransactionResponse) => {
    setSelectedTransaction(transaction);
    setIsDetailModalOpen(true);
  };

  // Hàm đóng modal chi tiết
  const handleCloseDetailModal = () => {
    setSelectedTransaction(null);
    setIsDetailModalOpen(false);
  };

  return (
    <DashboardLayout title="Lịch sử giao dịch">
      {/* Cards thống kê */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tổng giao dịch
              </CardTitle>
              <FiUsers className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stats.totalTransactions.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tổng linh thạch thu được
              </CardTitle>
              <FiDollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground flex items-center gap-1">
                <Image
                  src="/images/linh-thach.webp"
                  alt="Linh thạch"
                  width={20}
                  height={20}
                  className="flex-shrink-0"
                />
                <span>{formatPrice(stats.totalAmount)}</span>
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Tương đương: {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                }).format(stats.totalAmount * 1000)}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Đã thanh toán
              </CardTitle>
              <FiTrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.paidCount.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Đang xử lý
              </CardTitle>
              <FiCreditCard className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stats.pendingCount.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search và Filters */}
      <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          {/* Tìm kiếm */}
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="text"
              placeholder="Tìm kiếm theo mã giao dịch, người dùng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-80 border-border focus:border-primary"
            />
            <FiSearch className="h-5 w-5 text-primary absolute left-3 top-2" />
            <button type="submit" className="hidden">
              Tìm kiếm
            </button>
          </form>

          {/* Bộ lọc trạng thái */}
          <div className="w-full sm:w-60">
            <Select
              value={statusFilter || "all"}
              onValueChange={(value) => {
                handleStatusFilterChange(value === "all" ? "" : value);
              }}
            >
              <SelectTrigger className="w-full">
                <div className="flex items-center">
                  <FiFilter className="h-4 w-4 mr-2 text-primary" />
                  <SelectValue placeholder="Tất cả trạng thái" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="COMPLETED">Đã thanh toán</SelectItem>
                <SelectItem value="PENDING">Đang xử lý</SelectItem>
                <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                <SelectItem value="FAILED">Thất bại</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bộ lọc phương thức thanh toán */}
          <div className="w-full sm:w-60">
            <Select
              value={paymentMethodFilter || "all"}
              onValueChange={(value) => {
                handlePaymentMethodFilterChange(value === "all" ? "" : value);
              }}
            >
              <SelectTrigger className="w-full">
                <div className="flex items-center">
                  <FiCreditCard className="h-4 w-4 mr-2 text-primary" />
                  <SelectValue placeholder="Tất cả phương thức" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả phương thức</SelectItem>
                <SelectItem value="BALANCE">Số dư</SelectItem>
                <SelectItem value="PayOS">PayOS</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Nút refresh */}
        <Button
          variant="outline"
          onClick={refreshData}
          className="border-border hover:bg-muted"
          disabled={isLoading}
        >
          <FiRefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Làm mới
        </Button>
      </div>

      {/* Bảng giao dịch */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center">
            <FiCreditCard className="mr-2" />
            Danh sách giao dịch
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <FiAlertCircle className="h-12 w-12 mb-4 text-destructive" />
              <p className="text-lg font-medium mb-2">Có lỗi xảy ra</p>
              <p className="text-sm">{error}</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <FiCreditCard className="h-12 w-12 mb-4" />
              <p className="text-lg font-medium mb-2">Không có giao dịch nào</p>
              <p className="text-sm">Chưa có giao dịch nào được tìm thấy</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-muted/30">
                    <TableHead className="font-semibold text-foreground text-center min-w-[120px]">
                      Mã giao dịch
                    </TableHead>
                    <TableHead className="font-semibold text-foreground text-center min-w-[150px]">
                      Người dùng
                    </TableHead>
                    <TableHead className="font-semibold text-foreground text-center">
                      Số linh thạch
                    </TableHead>
                    <TableHead className="font-semibold text-foreground text-center">
                      Phương thức
                    </TableHead>
                    <TableHead className="font-semibold text-foreground text-center">
                      Trạng thái
                    </TableHead>
                    <TableHead className="font-semibold text-foreground text-center min-w-[250px]">
                      Mô tả
                    </TableHead>
                    <TableHead className="font-semibold text-foreground text-center">
                      Thời hạn (ngày)
                    </TableHead>
                    <TableHead className="font-semibold text-foreground text-center">
                      Thời gian giao dịch
                    </TableHead>
                    <TableHead className="font-semibold text-foreground text-center">
                      Thao tác
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id} className="border-border/50 hover:bg-muted/50">
                      <TableCell className="text-center">
                        <span className="font-mono text-sm">
                          {transaction.transactionCode}
                        </span>
                      </TableCell>

                      <TableCell className="text-center">
                        <div className="font-medium">{transaction.username}</div>
                        <div className="text-xs text-muted-foreground font-mono">
                          {transaction.userId.slice(0, 8)}...
                        </div>
                      </TableCell>

                      <TableCell className="text-center">
                        <div className="font-semibold text-primary flex items-center justify-center gap-1">
                          <Image
                            src="/images/linh-thach.webp"
                            alt="Linh thạch"
                            width={16}
                            height={16}
                            className="flex-shrink-0"
                          />
                          <span>{formatPrice(transaction.amount)}</span>
                        </div>
                      </TableCell>

                      <TableCell className="text-center">
                        {renderPaymentMethod(transaction.paymentMethod)}
                      </TableCell>

                      <TableCell className="text-center">
                        {renderTransactionStatus(transaction.status)}
                      </TableCell>

                      <TableCell className="max-w-[250px]">
                        <div className="truncate text-sm" title={transaction.description}>
                          {transaction.description}
                        </div>
                      </TableCell>

                      <TableCell className="text-center">
                        <span className="text-sm font-medium">
                          {transaction.durationDays > 0 ? `${transaction.durationDays} ngày` : '-'}
                        </span>
                      </TableCell>

                      <TableCell className="text-center">
                        <div className="text-sm">
                          {formatDate(transaction.updatedAt)}
                        </div>
                      </TableCell>

                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDetailModal(transaction)}
                          className="h-8 px-2 text-info hover:bg-info/10 hover:text-info"
                          aria-label="Xem chi tiết"
                          title="Xem chi tiết"
                        >
                          <FiEye size={14} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {!isLoading && !error && transactions.length > 0 && (
            <div className="p-4 border-t border-border/50">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal chi tiết giao dịch */}
      <TransactionDetailModal
        transaction={selectedTransaction}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
      />
    </DashboardLayout>
  );
} 