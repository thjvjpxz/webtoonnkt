import { ViewComicModalProps } from "@/types/comic";
import Image from "next/image";
import { FiX } from "react-icons/fi";

export default function VewComicModal({ comic, onClose }: ViewComicModalProps) {
  const renderStatus = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            Đã hoàn thành
          </span>
        );
      case "ongoing":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            Đang tiến hành
          </span>
        );
      default:
        return null;
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto custom-scrollbar">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl dark:bg-gray-800">
        <div className="flex justify-between items-center p-6 border-b border-green-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Chi tiết truyện
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="p-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Ảnh bìa truyện */}
            <div className="w-full md:w-1/3 flex justify-center">
              <div className="relative w-48 h-72">
                <Image
                  src={comic.thumbUrl || "https://placehold.co/100x150/4ade80/fff?text=NA"}
                  alt={comic.name}
                  fill
                  className="object-cover rounded-lg shadow-md"
                />
              </div>
            </div>

            {/* Thông tin truyện */}
            <div className="w-full md:w-2/3">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {comic.name}
              </h2>

              {comic.originName && (
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  <span className="font-medium">Tên gốc:</span> {comic.originName}
                </p>
              )}

              <div className="mb-3">
                <span className="font-medium text-gray-700 dark:text-gray-300">Tác giả:</span>{" "}
                <span className="text-gray-600 dark:text-gray-400">{comic.author}</span>
              </div>

              <div className="mb-3">
                <span className="font-medium text-gray-700 dark:text-gray-300">Trạng thái:</span>{" "}
                {renderStatus(comic.status)}
              </div>

              <div className="mb-3">
                <span className="font-medium text-gray-700 dark:text-gray-300">Lượt xem:</span>{" "}
                <span className="text-gray-600 dark:text-gray-400">{comic.viewsCount.toLocaleString()}</span>
              </div>

              <div className="mb-3">
                <span className="font-medium text-gray-700 dark:text-gray-300">Lượt theo dõi:</span>{" "}
                <span className="text-gray-600 dark:text-gray-400">{comic.followersCount.toLocaleString()}</span>
              </div>

              <div className="mb-3">
                <span className="font-medium text-gray-700 dark:text-gray-300">Đánh giá:</span>{" "}
                <span className="text-gray-600 dark:text-gray-400">{comic.rating.toFixed(1)}/5</span>
              </div>

              <div className="mb-4">
                <div className="flex flex-wrap gap-1 mt-1">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Thể loại:</span>{" "}
                  {comic.categories.map((category) => (
                    <span
                      key={category.id}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    >
                      {category.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <span className="font-medium text-gray-700 dark:text-gray-300">Ngày tạo:</span>{" "}
                <span className="text-gray-600 dark:text-gray-400">
                  {new Date(comic.createdAt).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <div className="mb-3">
                <span className="font-medium text-gray-700 dark:text-gray-300">Cập nhật:</span>{" "}
                <span className="text-gray-600 dark:text-gray-400">
                  {new Date(comic.updatedAt).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Mô tả truyện */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Mô tả
            </h3>
            <div
              className="prose prose-green max-w-none dark:prose-invert dark:text-gray-300 text-justify"
              dangerouslySetInnerHTML={{ __html: comic.description }}
            />
          </div>
        </div>

        <div className="flex justify-end p-6 border-t border-green-100 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}