"use client";

import { FiAlertTriangle } from "react-icons/fi";
import { DeleteConfirmModalProps } from "@/types/category";
import { useState } from "react";
import Button from "@/components/ui/Button";


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
      setIsDeleting(false);
    }
  };

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
            Bạn có chắc chắn muốn xóa thể loại{" "}
            <span className="font-semibold">&quot;{categoryName}&quot;</span>?
            Hành động này không thể hoàn tác.
          </p>

          <div className="flex justify-center space-x-3">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={isDeleting}
              size="md"
            >
              Hủy
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              disabled={isDeleting}
              size="md"
              isLoading={isDeleting}
            >
              Xoá
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
