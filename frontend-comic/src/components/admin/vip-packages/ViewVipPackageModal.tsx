"use client";

import { FiX, FiPackage, FiCalendar, FiClock, FiPercent, FiEye, FiEyeOff } from "react-icons/fi";
import { VipPackage } from "@/types/vipPackage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/helpers";
import Image from "next/image";

interface ViewVipPackageModalProps {
  vipPackage: VipPackage | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ViewVipPackageModal({
  vipPackage,
  isOpen,
  onClose,
}: ViewVipPackageModalProps) {
  if (!isOpen || !vipPackage) return null;

  // Hàm format giá tiền
  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN');
  };

  // Hàm tính giá sau giảm
  const calculateDiscountedPrice = (originalPrice: number, discountPercent: number) => {
    return originalPrice * (1 - discountPercent / 100);
  };

  // Hàm kiểm tra xem có đang trong thời gian giảm giá không
  const isInDiscountPeriod = () => {
    if (!vipPackage.discountStartDate ||
      !vipPackage.discountEndDate ||
      !vipPackage.discountedPrice ||
      vipPackage.discountedPrice <= 0) {
      return false;
    }

    const now = new Date();
    const startDate = new Date(vipPackage.discountStartDate);
    const endDate = new Date(vipPackage.discountEndDate);

    return now >= startDate && now <= endDate;
  };

  const hasDiscount = isInDiscountPeriod();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl shadow-lg w-full max-w-2xl border border-border max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <FiPackage className="text-primary" size={20} />
            Chi tiết gói VIP
          </h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Thông tin cơ bản */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tên gói VIP */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Tên gói VIP</label>
              <div className="p-3 bg-muted/30 rounded-lg border">
                <p className="font-semibold text-foreground">{vipPackage.name}</p>
              </div>
            </div>

            {/* Trạng thái */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Trạng thái</label>
              <div className="p-3 bg-muted/30 rounded-lg border">
                <Badge
                  variant={vipPackage.isActive ? "default" : "secondary"}
                  className={`${vipPackage.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"} flex items-center gap-1 w-fit`}
                >
                  {vipPackage.isActive ? (
                    <>
                      <FiEye className="w-3 h-3" />
                      Còn bán
                    </>
                  ) : (
                    <>
                      <FiEyeOff className="w-3 h-3" />
                      Ngừng bán
                    </>
                  )}
                </Badge>
              </div>
            </div>
          </div>

          {/* Mô tả */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Mô tả</label>
            <div className="p-3 bg-muted/30 rounded-lg border">
              <p className="text-foreground">{vipPackage.description || "Không có mô tả"}</p>
            </div>
          </div>

          {/* Thông tin giá và thời hạn */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Giá gốc */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Giá gốc</label>
              <div className="p-3 bg-muted/30 rounded-lg border">
                <div className="flex items-center gap-2">
                  <Image
                    src="/images/linh-thach.webp"
                    alt="Linh thạch"
                    width={16}
                    height={16}
                    className="flex-shrink-0"
                  />
                  <span className="font-semibold text-foreground">{formatPrice(vipPackage.originalPrice)}</span>
                </div>
              </div>
            </div>

            {/* Thời hạn */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Thời hạn</label>
              <div className="p-3 bg-muted/30 rounded-lg border">
                <div className="flex items-center gap-2">
                  <FiClock className="text-primary" size={16} />
                  <span className="font-semibold text-foreground">{vipPackage.durationDays} ngày</span>
                </div>
              </div>
            </div>
          </div>

          {/* Thông tin giảm giá */}
          {vipPackage.discountedPrice !== null && vipPackage.discountedPrice !== undefined && vipPackage.discountedPrice > 0 && (
            <div className="space-y-4 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950/20 dark:to-yellow-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="flex items-center gap-2 mb-3">
                <FiPercent className="text-orange-600" size={20} />
                <h4 className="font-semibold text-foreground">Thông tin giảm giá</h4>
                {hasDiscount && (
                  <Badge variant="destructive" className="bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200">
                    Đang áp dụng
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Phần trăm giảm giá */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Phần trăm giảm</label>
                  <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg border">
                    <div className="flex items-center gap-2">
                      <FiPercent className="text-orange-600" size={16} />
                      <span className="font-bold text-orange-600">{vipPackage.discountedPrice}%</span>
                    </div>
                  </div>
                </div>

                {/* Giá sau giảm */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Giá sau giảm</label>
                  <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg border">
                    <div className="flex items-center gap-2">
                      <Image
                        src="/images/linh-thach.webp"
                        alt="Linh thạch"
                        width={16}
                        height={16}
                        className="flex-shrink-0"
                      />
                      <span className="font-bold text-green-600">
                        {formatPrice(calculateDiscountedPrice(vipPackage.originalPrice, vipPackage.discountedPrice))}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tiết kiệm */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Tiết kiệm</label>
                  <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg border">
                    <div className="flex items-center gap-2">
                      <Image
                        src="/images/linh-thach.webp"
                        alt="Linh thạch"
                        width={16}
                        height={16}
                        className="flex-shrink-0"
                      />
                      <span className="font-bold text-red-600">
                        {formatPrice(vipPackage.originalPrice - calculateDiscountedPrice(vipPackage.originalPrice, vipPackage.discountedPrice))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Thời gian áp dụng giảm giá */}
              {vipPackage.discountStartDate && vipPackage.discountEndDate && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Ngày bắt đầu</label>
                    <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg border">
                      <div className="flex items-center gap-2">
                        <FiCalendar className="text-blue-600" size={16} />
                        <span className="font-medium text-foreground">
                          {formatDate(vipPackage.discountStartDate)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Ngày kết thúc</label>
                    <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg border">
                      <div className="flex items-center gap-2">
                        <FiCalendar className="text-red-600" size={16} />
                        <span className="font-medium text-foreground">
                          {formatDate(vipPackage.discountEndDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Thông tin hệ thống */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Ngày tạo</label>
              <div className="p-3 bg-muted/30 rounded-lg border">
                <div className="flex items-center gap-2">
                  <FiCalendar className="text-blue-600" size={16} />
                  <span className="text-foreground">{formatDate(vipPackage.createdAt)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Lần cập nhật cuối</label>
              <div className="p-3 bg-muted/30 rounded-lg border">
                <div className="flex items-center gap-2">
                  <FiCalendar className="text-green-600" size={16} />
                  <span className="text-foreground">{formatDate(vipPackage.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-border">
          <Button
            onClick={onClose}
            variant="outline"
          >
            Đóng
          </Button>
        </div>
      </div>
    </div>
  );
} 