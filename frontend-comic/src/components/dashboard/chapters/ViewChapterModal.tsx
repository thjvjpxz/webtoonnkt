import { Chapter, DetailChapter } from "@/types/chapter";
import Image from "next/image";
import { IoMdClose } from "react-icons/io";

type ViewChapterModalProps = {
  isOpen: boolean;
  onClose: () => void;
  chapter: Chapter | null;
};

export default function ViewChapterModal({
  isOpen,
  onClose,
  chapter,
}: ViewChapterModalProps) {
  if (!isOpen || !chapter) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50 p-4">
      <div className="relative max-w-4xl w-full bg-white rounded-lg shadow-xl dark:bg-gray-800 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            {chapter.title} - Chương {chapter.chapterNumber}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer"
          >
            <IoMdClose size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              Thông tin chương
            </p>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Tên truyện</p>
                <p className="font-medium text-gray-900 dark:text-white">{chapter.comicName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Chương số</p>
                <p className="font-medium text-gray-900 dark:text-white">{chapter.chapterNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Ngày tạo</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {new Date(chapter.createdAt).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Ngày cập nhật</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {new Date(chapter.updatedAt).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Nội dung chương
            </p>

            <div className="mt-4 space-y-4">
              {chapter.detailChapters && chapter.detailChapters.length > 0 ? (
                chapter.detailChapters
                  .sort((a, b) => a.orderNumber - b.orderNumber)
                  .map((detail: DetailChapter) => (
                    <div key={detail.id} className="mb-4">
                      <Image
                        src={detail.imgUrl}
                        alt={`Trang ${detail.orderNumber}`}
                        width={800}
                        height={1200}
                        className="w-full h-auto rounded-md shadow-sm"
                      />
                    </div>
                  ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 italic">
                  Không có hình ảnh nào cho chương này
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
} 