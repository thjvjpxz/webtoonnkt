"use client";

import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { PaginationProps } from "@/types/dashboard";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  // Tạo mảng các trang để hiển thị
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Hiển thị tất cả các trang nếu tổng số trang ít hơn hoặc bằng maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Luôn hiển thị trang đầu, trang cuối và các trang xung quanh trang hiện tại
      if (currentPage <= 3) {
        // Nếu đang ở gần trang đầu
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Nếu đang ở gần trang cuối
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Ở giữa
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex justify-center items-center">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-md mr-2 disabled:opacity-50 disabled:cursor-not-allowed text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20 cursor-pointer"
        aria-label="Trang trước"
      >
        <FiChevronLeft size={20} />
      </button>

      <div className="flex space-x-1">
        {getPageNumbers().map((page, index) =>
          page === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="px-3 py-1 text-gray-500 dark:text-gray-400"
            >
              ...
            </span>
          ) : (
            <button
              key={`page-${page}`}
              onClick={() => typeof page === "number" && onPageChange(page)}
              className={`px-3 py-1 rounded-md cursor-pointer ${currentPage === page
                ? "bg-green-600 text-white dark:bg-green-700"
                : "text-gray-700 hover:bg-green-50 dark:text-gray-300 dark:hover:bg-green-900/20"
                }`}
            >
              {page}
            </button>
          )
        )}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-md ml-2 disabled:opacity-50 disabled:cursor-not-allowed text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20 cursor-pointer"
        aria-label="Trang sau"
      >
        <FiChevronRight size={20} />
      </button>
    </div>
  );
}
