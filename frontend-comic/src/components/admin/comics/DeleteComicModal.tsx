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

interface DeleteComicModalProps {
  comicTitle: string;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
};

export default function DeleteComicModal({
  comicTitle,
  onClose,
  onConfirm,
  isDeleting,
}: DeleteComicModalProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border shadow-strong">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <div className="bg-destructive/10 p-2 rounded-full text-destructive">
              <FiAlertTriangle size={20} />
            </div>
            Xác nhận xóa truyện
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            <p className="text-foreground mb-2">
              Bạn có chắc chắn muốn xóa truyện
              <span className="font-semibold text-primary"> &quot;{comicTitle}&quot;</span> không?
            </p>
            <p className="text-muted-foreground text-sm">
              Tất cả chapter và dữ liệu liên quan sẽ bị xóa vĩnh viễn.
            </p>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2">
          <Button
            onClick={onClose}
            variant="outline"
            disabled={isDeleting}
          >
            Hủy
          </Button>
          <Button
            onClick={onConfirm}
            variant="destructive"
            disabled={isDeleting}
          >
            {isDeleting ? "Đang xóa..." : "Xóa truyện"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
