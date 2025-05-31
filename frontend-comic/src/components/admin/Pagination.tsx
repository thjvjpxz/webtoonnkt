"use client";

import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { PaginationProps } from "@/types/dashboard";
import { Button } from "@/components/ui/button";

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
    <div className="flex justify-center items-center gap-2">
      {/* Nút trang trước */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-9 w-9 p-0 border-border/50 hover:bg-primary/10 hover:text-primary hover:border-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Trang trước"
      >
        <FiChevronLeft size={16} />
      </Button>

      {/* Các số trang */}
      <div className="flex gap-1">
        {getPageNumbers().map((page, index) =>
          page === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="flex items-center justify-center h-9 px-3 text-muted-foreground"
            >
              ...
            </span>
          ) : (
            <Button
              key={`page-${page}`}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => typeof page === "number" && onPageChange(page)}
              className={`h-9 min-w-[36px] px-3 ${currentPage === page
                  ? "bg-primary text-primary-foreground shadow-soft border-primary"
                  : "border-border/50 hover:bg-primary/10 hover:text-primary hover:border-primary/50"
                }`}
            >
              {page}
            </Button>
          )
        )}
      </div>

      {/* Nút trang sau */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-9 w-9 p-0 border-border/50 hover:bg-primary/10 hover:text-primary hover:border-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Trang sau"
      >
        <FiChevronRight size={16} />
      </Button>
    </div>
  );
}
