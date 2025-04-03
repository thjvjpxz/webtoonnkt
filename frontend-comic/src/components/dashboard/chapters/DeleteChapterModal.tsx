"use client";

import { FC } from "react";
import { FiAlertTriangle, FiX } from "react-icons/fi";

type DeleteChapterModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  chapterTitle: string;
};

const DeleteChapterModal: FC<DeleteChapterModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  chapterTitle,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6 border-b border-green-100 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Xác nhận xóa chapter
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="mr-4 flex-shrink-0 bg-rose-100 rounded-full p-3 dark:bg-rose-900/30">
              <FiAlertTriangle className="h-6 w-6 text-rose-600 dark:text-rose-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Bạn có chắc chắn muốn xóa chapter{" "}
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {chapterTitle}
                </span>
                ? Hành động này không thể hoàn tác.
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-600"
            >
              Xóa chapter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteChapterModal; 