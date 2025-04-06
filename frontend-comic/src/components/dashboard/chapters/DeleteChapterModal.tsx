import { FiAlertTriangle } from "react-icons/fi";
import { DeleteChapterModalProps } from "@/types/chapter";
import { useState } from "react";

export default function DeleteChapterModal({
  isOpen,
  onClose,
  onConfirm,
  comicName,
  chapterTitle,
  chapterNumber,
}: DeleteChapterModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

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
    <div className="fixed dark:border inset-0 z-50 flex items-center justify-center overflow-auto bg-black/50 p-4">
      <div className="relative max-w-md w-full bg-white rounded-lg shadow-xl dark:bg-gray-800 dark:border dark:border-gray-700">
        <div className="p-6">
          <div className="flex items-center justify-center mb-4 text-red-500">
            <FiAlertTriangle size={60} />
          </div>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white text-center mb-4">
            Xác nhận xóa
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-center">
            Bạn có chắc chắn muốn xóa chương "{chapterTitle}" - Chương {chapterNumber} của truyện "{comicName}"?
          </p>
          <p className="text-gray-600 dark:text-gray-300 text-center mt-2">
            Hành động này không thể hoàn tác.
          </p>
        </div>

        <div className="flex justify-center p-4 gap-4">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors duration-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Hủy
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
          >
            {isDeleting ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Đang xóa...</span>
              </>
            ) : (
              <span>Xóa</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 