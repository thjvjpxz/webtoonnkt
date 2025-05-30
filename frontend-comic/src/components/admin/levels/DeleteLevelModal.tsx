import { useState } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import { DeleteLevelModalProps } from "@/types/level";
import Button from "@/components/ui/Button";

export default function DeleteLevelModal({
  isOpen,
  onClose,
  onConfirm,
  itemType = "level",
  itemName,
}: DeleteLevelModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black/50 p-4">
      <div className="relative max-w-md w-full bg-white rounded-lg shadow-xl dark:bg-gray-800 dark:border dark:border-gray-700">
        <div className="p-6">
          <div className="flex items-center justify-center mb-4 text-red-500">
            <FiAlertTriangle size={60} />
          </div>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white text-center mb-4">
            Xác nhận xóa
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-center">
            Bạn có chắc chắn muốn xóa {itemTypeText} &quot;{itemName}&quot;?
          </p>
          <p className="text-gray-600 dark:text-gray-300 text-center mt-2">
            Hành động này không thể hoàn tác.
          </p>
        </div>

        <div className="flex justify-center p-4 gap-4">
          <Button
            onClick={onClose}
            disabled={isDeleting}
            variant="secondary"
            size="md"
          >
            Hủy
          </Button>
          <Button
            onClick={handleDelete}
            disabled={isDeleting}
            variant="danger"
            size="md"
            isLoading={isDeleting}
          >
            Xóa
          </Button>
        </div>
      </div>
    </div>
  );
}