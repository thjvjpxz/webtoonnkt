import { DetailChapter, ChapterDetailResponse, ChapterImage } from "@/types/chapter";
import Image from "next/image";
import { IoMdClose } from "react-icons/io";
import { formatDate, constructImageUrl } from "@/utils/helpers";
import Button from "@/components/ui/Button";

interface ViewChapterModalProps {
  isOpen: boolean;
  chapter: ChapterDetailResponse;
  onClose: () => void;
}

export default function ViewChapterModal({
  isOpen,
  onClose,
  chapter,
}: ViewChapterModalProps) {
  if (!isOpen || !chapter) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black/50 bg-opacity-50 p-4">
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
                <p className="font-medium text-gray-900 dark:text-white">{chapter.comic.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Chương số</p>
                <p className="font-medium text-gray-900 dark:text-white">{chapter.chapterNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Ngày tạo</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatDate(chapter.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Ngày cập nhật</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {formatDate(chapter.updatedAt)}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Nội dung chương
            </p>

            <div className="mt-4 space-y-8">
              {chapter.images && chapter.images.length > 0 ? (
                chapter.images
                  .sort((a, b) => a.page - b.page)
                  .map((image: ChapterImage) => (
                    <div key={image.id} className="mb-0">
                      <div className="relative w-full">
                        <Image
                          src={constructImageUrl(chapter, image.url)}
                          alt={`Trang ${image.page}`}
                          width={1500}
                          height={2400}
                          className="shadow-lg w-full h-auto object-contain mx-auto"
                        />
                        <div className="absolute bottom-3 right-3 bg-black/70 text-white text-sm px-3 py-1.5 rounded-md">
                          {image.page}
                        </div>
                      </div>
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
          <Button
            variant="secondary"
            onClick={onClose}
            size="md"
          >
            Đóng
          </Button>
        </div>
      </div>
    </div>
  );
} 