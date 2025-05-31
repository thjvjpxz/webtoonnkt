"use client";

import { FiAlertTriangle } from "react-icons/fi";
import { DeleteConfirmModalProps } from "@/types/category";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function DeleteConfirmModal({
  categoryName,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      // onConfirm sẽ xử lý việc đóng modal sau khi thành công
    } catch (error) {
      console.error("Lỗi khi xóa thể loại:", error);
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border shadow-strong">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <div className="bg-destructive/10 p-2 rounded-full text-destructive">
              <FiAlertTriangle size={20} />
            </div>
            Xác nhận xóa thể loại
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Hành động này không thể hoàn tác và sẽ xóa vĩnh viễn thể loại.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="bg-destructive/10 p-4 rounded-full text-destructive mb-4 shadow-soft">
            <FiAlertTriangle size={32} />
          </div>
          <p className="text-foreground mb-2">
            Bạn có chắc chắn muốn xóa thể loại{" "}
            <span className="font-semibold text-primary">&quot;{categoryName}&quot;</span> không?
          </p>
          <p className="text-muted-foreground text-sm">
            Tất cả truyện thuộc thể loại này sẽ bị ảnh hưởng.
          </p>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="border-border hover:bg-muted"
          >
            Hủy
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          >
            {isDeleting ? "Đang xóa..." : "Xóa thể loại"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
