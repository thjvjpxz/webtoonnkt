"use client";

import { FiAlertTriangle } from "react-icons/fi";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DialogFooter,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogContent,
  Dialog,
} from "@/components/ui/dialog";

interface DeleteCategoryModalProps {
  categoryName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteCategoryModal({
  categoryName,
  onClose,
  onConfirm,
}: DeleteCategoryModalProps) {
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
            <p className="text-foreground mb-2">
              Bạn có chắc chắn muốn xóa thể loại
              <span className="font-semibold text-primary"> &quot;{categoryName}&quot;</span>?
            </p>
            <p className="text-muted-foreground text-sm">
              Hành động này không thể hoàn tác.
            </p>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
          >
            Hủy
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Đang xóa..." : "Xoá"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
