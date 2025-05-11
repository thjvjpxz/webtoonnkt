"use client";

import { FiAlertTriangle, FiX } from "react-icons/fi";
import Button from "@/components/ui/Button";
import { DeleteUserModalProps } from "@/types/user";

export default function DeleteUserModal({
  username,
  onClose,
  onConfirm,
  isDeleting,
}: DeleteUserModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 dark:bg-gray-800 dark:border dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Xác nhận xóa người dùng
          </h2>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer"
            aria-label="Đóng"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="flex flex-col items-center justify-center p-4 mb-4 text-center">
          <div className="bg-rose-100 p-3 rounded-full text-rose-500 mb-4 dark:bg-rose-900/30">
            <FiAlertTriangle size={32} />
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            Bạn có chắc chắn muốn xóa người dùng{" "}
            <span className="font-semibold">{username}</span> không?
          </p>
          <p className="text-gray-500 text-sm dark:text-gray-400">
            Hành động này không thể hoàn tác.
          </p>
        </div>

        <div className="flex justify-center space-x-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isDeleting}
            size="md"
          >
            Hủy
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
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