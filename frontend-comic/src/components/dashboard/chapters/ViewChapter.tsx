"use client";

import { ChapterResponse } from "@/types/api";
import { FC } from "react";
import { FiX } from "react-icons/fi";
import Image from "next/image";

type ViewChapterProps = {
  isOpen: boolean;
  onClose: () => void;
  chapter: ChapterResponse | null;
};

const ViewChapter: FC<ViewChapterProps> = ({ isOpen, onClose, chapter }) => {
  if (!isOpen || !chapter) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-green-100 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Chi tiết chapter: {chapter.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Truyện:
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {chapter.comicName || "Không có thông tin"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Số chapter:
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {chapter.chapterNumber}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Trạng thái:
              </p>
              <div className="mt-1">
                {chapter.status === "completed" ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    Đã hoàn thành
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                    Đang cập nhật
                  </span>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Ngày tạo:
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {new Date(chapter.createdAt).toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Danh sách ảnh ({chapter.detailChapters.length})
            </h3>

            <div className="space-y-6">
              {chapter.detailChapters
                .sort((a, b) => a.orderNumber - b.orderNumber)
                .map((detail) => (
                  <div
                    key={detail.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                  >
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Thứ tự: {detail.orderNumber + 1}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        ID: {detail.id}
                      </p>
                    </div>
                    <div className="relative aspect-auto w-full">
                      <Image
                        src={detail.imgUrl}
                        alt={`Ảnh ${detail.orderNumber + 1}`}
                        width={800}
                        height={1200}
                        className="w-full object-contain"
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewChapter; 