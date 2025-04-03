"use client";

import { FiAlertTriangle } from "react-icons/fi";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  itemType: "level" | "level-type";
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  itemType,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  const typeText = itemType === "level" ? "level" : "loại level";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 dark:bg-gray-800 dark:border dark:border-gray-700">
        <div className="flex flex-col items-center text-center mb-4">
          <FiAlertTriangle className="h-12 w-12 text-rose-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Xác nhận xóa {typeText}
          </h2>
          <p className="text-gray-600 mt-2 dark:text-gray-400">
            Bạn có chắc chắn muốn xóa {typeText} <strong>{itemName}</strong>? Hành
            động này không thể hoàn tác.
          </p>
        </div>

        <div className="flex justify-center space-x-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-rose-600 border border-transparent rounded-md hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
} 