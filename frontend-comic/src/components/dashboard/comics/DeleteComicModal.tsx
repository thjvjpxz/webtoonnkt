"use client";

import { FiAlertTriangle } from "react-icons/fi";
import { DeleteComicModalProps } from "@/types/comic";
import Button from "@/components/ui/Button";

export default function DeleteComicModal({
  comicTitle,
  onClose,
  onConfirm,
  isDeleting,
}: DeleteComicModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md dark:bg-gray-800 dark:border dark:border-gray-700">
        <div className="p-6">
          <div className="flex items-center justify-center mb-4 text-rose-500">
            <FiAlertTriangle size={48} />
          </div>

          <h3 className="text-lg font-semibold text-gray-800 text-center mb-2 dark:text-gray-200">
            Xác nhận xóa
          </h3>

          <p className="text-gray-600 text-center mb-6 dark:text-gray-400">
            Bạn có chắc chắn muốn xóa truyện{" "}
            <span className="font-semibold">&quot;{comicTitle}&quot;</span>?
            Hành động này không thể hoàn tác.
          </p>

          <div className="flex justify-center space-x-3">
            <Button
              onClick={onClose}
              variant="secondary"
              size="md"
            >
              Hủy
            </Button>
            <Button
              onClick={onConfirm}
              variant="danger"
              size="md"
              isLoading={isDeleting}
            >
              Xóa
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
