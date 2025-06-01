"use client";

import { FiAlertTriangle } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DeleteUserModalProps } from "@/types/user";

export default function DeleteUserModal({
  username,
  onClose,
  onConfirm,
  isDeleting,
}: DeleteUserModalProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border shadow-strong">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <div className="bg-destructive/10 p-2 rounded-full text-destructive">
              <FiAlertTriangle size={20} />
            </div>
            Xác nhận xóa người dùng
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Hành động này không thể hoàn tác và sẽ xóa vĩnh viễn tài khoản người dùng.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="bg-destructive/10 p-4 rounded-full text-destructive mb-4 shadow-soft">
            <FiAlertTriangle size={32} />
          </div>
          <p className="text-foreground mb-2">
            Bạn có chắc chắn muốn xóa người dùng{" "}
            <span className="font-semibold text-primary">{username}</span> không?
          </p>
          <p className="text-muted-foreground text-sm">
            Tất cả dữ liệu liên quan sẽ bị xóa vĩnh viễn.
          </p>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="border-border hover:bg-muted"
          >
            Hủy
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            variant="destructive"
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          >
            {isDeleting ? "Đang xóa..." : "Xóa người dùng"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 