import React from "react";
import { Search, Filter, X } from "lucide-react";
import { CategoryResponse } from "@/types/category";

interface ComicFiltersProps {
  // Search và filter states
  searchTerm: string;
  statusFilter: string;
  categoryFilter: string;
  categories: CategoryResponse[];
  isLoading: boolean;

  // Handlers
  setSearchTerm: (term: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  handleStatusFilterChange: (status: string) => void;
  handleCategoryFilterChange: (categoryId: string) => void;
  handleResetFilters: () => void;
}

// Các trạng thái comic có thể có
const COMIC_STATUSES = [
  { value: "DRAFT", label: "Nháp" },
  { value: "PUBLISHED", label: "Đã xuất bản" },
  { value: "SUSPENDED", label: "Tạm dừng" },
  { value: "COMPLETED", label: "Hoàn thành" }
];

const ComicFilters: React.FC<ComicFiltersProps> = ({
  searchTerm,
  statusFilter,
  categoryFilter,
  categories,
  isLoading,
  setSearchTerm,
  handleSearch,
  handleStatusFilterChange,
  handleCategoryFilterChange,
  handleResetFilters
}) => {
  // Kiểm tra có filter nào đang active không
  const hasActiveFilters = searchTerm || statusFilter || categoryFilter;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <div className="flex items-center gap-4 mb-4">
        <Filter className="w-5 h-5 text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-800">Lọc và tìm kiếm</h3>

        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            className="ml-auto flex items-center gap-2 px-3 py-1 text-sm text-red-600 hover:text-red-800 border border-red-200 rounded-md hover:bg-red-50 transition-colors"
          >
            <X className="w-4 h-4" />
            Xóa bộ lọc
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="md:col-span-2">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên truyện..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => handleStatusFilterChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            disabled={isLoading}
          >
            <option value="">Tất cả trạng thái</option>
            {COMIC_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <select
            value={categoryFilter}
            onChange={(e) => handleCategoryFilterChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            disabled={isLoading || categories.length === 0}
          >
            <option value="">Tất cả thể loại</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
          <span className="text-sm text-gray-600">Bộ lọc đang áp dụng:</span>

          {searchTerm && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
              Tìm kiếm: "{searchTerm}"
              <button
                onClick={() => setSearchTerm("")}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {statusFilter && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
              Trạng thái: {COMIC_STATUSES.find(s => s.value === statusFilter)?.label}
              <button
                onClick={() => handleStatusFilterChange("")}
                className="ml-1 text-green-600 hover:text-green-800"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {categoryFilter && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
              Thể loại: {categories.find(c => c.id === categoryFilter)?.name}
              <button
                onClick={() => handleCategoryFilterChange("")}
                className="ml-1 text-purple-600 hover:text-purple-800"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ComicFilters; 