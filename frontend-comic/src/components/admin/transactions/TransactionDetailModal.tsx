"use client";

import { useState } from "react";
import { TransactionResponse } from "@/types/payment";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatDate } from "@/utils/helpers";
import { FiX, FiUser, FiCreditCard, FiCalendar, FiHash, FiDollarSign, FiInfo } from "react-icons/fi";
import Image from "next/image";

interface TransactionDetailModalProps {
  transaction: TransactionResponse | null;
  isOpen: boolean;
  onClose: () => void;
}

// Hàm helper để format số linh thạch
const formatPrice = (price: number) => {
  if (price === undefined || price === null || isNaN(price)) {
    return '0';
  }
  return price.toLocaleString('vi-VN');
};

// Hàm helper để format số tiền VND
const formatCurrency = (amount: number) => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '0 ₫';
  }
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

// Hàm helper để render trạng thái giao dịch
const renderTransactionStatus = (status: string) => {
  const statusConfig = {
    COMPLETED: { label: "Đã thanh toán", className: "bg-green-100 text-green-800 border-green-200" },
    PENDING: { label: "Đang xử lý", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    CANCELLED: { label: "Đã hủy", className: "bg-red-100 text-red-800 border-red-200" },
    FAILED: { label: "Thất bại", className: "bg-red-100 text-red-800 border-red-200" },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || {
    label: status,
    className: "bg-gray-100 text-gray-800 border-gray-200"
  };

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
};

// Hàm helper để render phương thức thanh toán
const renderPaymentMethod = (method: string) => {
  const methodConfig = {
    BALANCE: { label: "Số dư", icon: "💰", className: "bg-blue-100 text-blue-800 border-blue-200" },
    PayOS: { label: "PayOS", icon: "💳", className: "bg-purple-100 text-purple-800 border-purple-200" },
  };

  const config = methodConfig[method as keyof typeof methodConfig] || {
    label: method,
    icon: "💰",
    className: "bg-gray-100 text-gray-800 border-gray-200"
  };

  return (
    <Badge variant="outline" className={config.className}>
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </Badge>
  );
};

export default function TransactionDetailModal({
  transaction,
  isOpen,
  onClose,
}: TransactionDetailModalProps) {
  if (!transaction) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center">
            <FiInfo className="mr-2" />
            Chi tiết giao dịch
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Mã giao dịch */}
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <FiHash className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Mã giao dịch</p>
              <p className="text-sm font-mono text-muted-foreground">
                {transaction.transactionCode}
              </p>
            </div>
          </div>

          {/* Người dùng */}
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <FiUser className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Người dùng</p>
              <p className="text-sm text-muted-foreground">{transaction.username}</p>
              <p className="text-xs font-mono text-muted-foreground">
                ID: {transaction.userId}
              </p>
            </div>
          </div>

          {/* Số tiền */}
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <FiDollarSign className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Số tiền</p>

              {/* Số linh thạch */}
              <div className="flex items-center gap-2 mb-2">
                <Image
                  src="/images/linh-thach.webp"
                  alt="Linh thạch"
                  width={20}
                  height={20}
                  className="flex-shrink-0"
                />
                <span className="text-lg font-semibold text-primary">
                  {formatPrice(transaction.amount)}
                </span>
              </div>

              {/* Giá trị VND tương đương - chỉ hiển thị với PayOS */}
              {transaction.paymentMethod === 'PayOS' && (
                <div className="text-sm text-muted-foreground">
                  Tương đương: {formatCurrency(transaction.payosAmountVnd)}
                </div>
              )}
            </div>
          </div>

          {/* Phương thức thanh toán */}
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <FiCreditCard className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground mb-1">Phương thức thanh toán</p>
              {renderPaymentMethod(transaction.paymentMethod)}
            </div>
          </div>

          {/* Trạng thái */}
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <FiInfo className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground mb-1">Trạng thái</p>
              {renderTransactionStatus(transaction.status)}
            </div>
          </div>

          {/* Mô tả */}
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 pt-0.5">
              <FiInfo className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Mô tả</p>
              <p className="text-sm text-muted-foreground break-words">
                {transaction.description}
              </p>
            </div>
          </div>

          {/* Thời hạn */}
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <FiCalendar className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Thời hạn</p>
              <p className="text-sm text-muted-foreground">
                {transaction.durationDays > 0 ? `${transaction.durationDays} ngày` : '-'}
              </p>
            </div>
          </div>

          {/* Ngày cập nhật */}
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <FiCalendar className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Ngày cập nhật</p>
              <p className="text-sm text-muted-foreground">
                {formatDate(transaction.updatedAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-6"
          >
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 