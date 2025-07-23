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

interface DeleteUserModalProps {
  username: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
};

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
            <p className="text-foreground mb-2">
              Bạn có chắc chắn muốn xóa người dùng
              <span className="font-semibold text-primary"> {username}</span> không?
            </p>
            <p className="text-muted-foreground text-sm">
              Tất cả dữ liệu liên quan sẽ bị xóa vĩnh viễn.
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
            onClick={onConfirm}
            disabled={isDeleting}
            variant="destructive"
          >
            {isDeleting ? "Đang xóa..." : "Xóa người dùng"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 