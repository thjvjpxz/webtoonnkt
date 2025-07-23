"use client";

import { FiAlertTriangle, FiX } from "react-icons/fi";
import { VipPackage } from "@/types/vipPackage";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface DeleteVipPackageModalProps {
  vipPackage: VipPackage | null;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
  isPermanent?: boolean;
}

export default function DeleteVipPackageModal({
  vipPackage,
  onClose,
  onConfirm,
  isDeleting = false,
  isPermanent = false,
}: DeleteVipPackageModalProps) {
  if (!vipPackage) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl shadow-lg w-full max-w-md border border-border">
        <div className="flex justify-between items-center p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <FiAlertTriangle className="text-destructive" size={20} />
            {isPermanent ? "Xóa vĩnh viễn gói VIP" : "Xóa gói VIP"}
          </h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
            disabled={isDeleting}
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <p className="text-foreground mb-2">
              {isPermanent
                ? "Bạn có chắc chắn muốn xóa vĩnh viễn gói VIP này?"
                : "Bạn có chắc chắn muốn xóa gói VIP này?"
              }
            </p>
            <div className="bg-muted/50 p-3 rounded-lg border">
              <p className="font-semibold text-foreground">{vipPackage.name}</p>
              <div className="text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <span>Giá:</span>
                  <Image
                    src="/images/linh-thach.webp"
                    alt="Linh thạch"
                    width={14}
                    height={14}
                    className="flex-shrink-0"
                  />
                  <span>{vipPackage.originalPrice?.toLocaleString('vi-VN')}</span>
                  <span>- {vipPackage.durationDays} ngày</span>
                </div>
              </div>
            </div>
            {isPermanent && (
              <p className="text-sm text-destructive mt-3 font-medium">
                ⚠️ Hành động này không thể hoàn tác!
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isDeleting}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? "Đang xóa..." : (isPermanent ? "Xóa vĩnh viễn" : "Xóa")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 