import { useState } from "react";
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

interface DeleteLevelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  itemType?: "level" | "level-type";
  itemName: string;
};


export default function DeleteLevelModal({
  isOpen,
  onClose,
  onConfirm,
  itemType = "level",
  itemName,
}: DeleteLevelModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error("Lỗi khi xóa level:", error);
      setIsDeleting(false);
      onClose();
    }
  };

  const itemTypeText = itemType === "level" ? "level" : "loại level";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border shadow-strong">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <div className="bg-destructive/10 p-2 rounded-full text-destructive">
              <FiAlertTriangle size={20} />
            </div>
            Xác nhận xóa {itemTypeText}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            <p className="text-foreground mb-2">
              Bạn có chắc chắn muốn xóa {itemTypeText}
              <span className="font-semibold text-primary"> &quot;{itemName}&quot;</span> không?
            </p>
            <p className="text-muted-foreground text-sm">
              Hành động này không thể hoàn tác.
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
            onClick={handleDelete}
            variant="destructive"
            disabled={isDeleting}
          >
            {isDeleting ? "Đang xóa..." : "Xóa"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}