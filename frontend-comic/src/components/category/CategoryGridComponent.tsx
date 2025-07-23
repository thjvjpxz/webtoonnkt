"use client";

import { CategoryResponse } from "@/types/category";
import Link from "next/link";
import { FiTag, FiArrowRight } from "react-icons/fi";

interface CategoryGridComponentProps {
  categories: CategoryResponse[];
  title?: string;
}

export default function CategoryGridComponent({
  categories,
  title = "Tất cả thể loại"
}: CategoryGridComponentProps) {

  if (categories.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{title}</h2>
        </div>
        <div className="p-8 text-center">
          <div className="text-gray-500 dark:text-gray-400">
            <FiTag className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Không có thể loại nào được tìm thấy</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{title}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Tìm thấy {categories.length} thể loại
        </p>
      </div>

      {/* Grid thể loại */}
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group"
            >
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 p-4 hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-300 h-full">
                {/* Icon và tên */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors duration-300">
                    <FiTag className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors duration-300 truncate">
                      {category.name}
                    </h3>
                  </div>
                </div>

                {/* Mô tả */}
                {category.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3 min-h-[2.5rem]">
                    {category.description}
                  </p>
                )}

                {/* Action */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Xem truyện
                  </span>
                  <FiArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 