import { FiAlertTriangle } from "react-icons/fi";
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

interface DeleteChapterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  comicName: string;
  chapterTitle: string;
  chapterNumber: number;
};

export default function DeleteChapterModal({
  isOpen,
  onClose,
  onConfirm,
  comicName,
  chapterTitle,
  chapterNumber,
}: DeleteChapterModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      // onConfirm sẽ đóng modal sau khi xử lý xong
    } catch (error) {
      console.error("Error deleting chapter:", error);
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border shadow-strong">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <div className="bg-destructive/10 p-2 rounded-full text-destructive">
              <FiAlertTriangle size={20} />
            </div>
            Xác nhận xóa chapter
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            <p className="text-foreground mb-2">
              Bạn có chắc chắn muốn xóa chapter{" "}
              <span className="font-semibold text-primary">&quot;{chapterTitle}&quot;</span> - Chapter {chapterNumber} của truyện{" "}
              <span className="font-semibold text-primary">&quot;{comicName}&quot;</span> không?
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
            {isDeleting ? "Đang xóa..." : "Xóa"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 