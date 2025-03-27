"use client";

import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiSearch,
  FiAlertCircle,
} from "react-icons/fi";
import CategoryModal from "@/components/dashboard/categories/CategoryModal";
import DeleteConfirmModal from "@/components/dashboard/categories/DeleteConfirmModal";
import Pagination from "@/components/dashboard/Pagination";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/services/categoryService";
import { CategoryResponse, CategoryCreateUpdate } from "@/types/api";
import { toast } from "react-hot-toast";

export default function Categories() {
  // State cho danh sách thể loại và phân trang
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  // State cho modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] =
    useState<CategoryResponse | null>(null);

  // Lấy danh sách thể loại từ API
  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getCategories(currentPage, 5, searchTerm);
      console.log(response);

      if (response.status == 200 && response.data) {
        setCategories(response.data);
        setTotalPages(response.totalPages || 1);
      } else {
        setCategories([]);
        setError(response.message || "Không thể tải danh sách thể loại");
        toast.error(response.message || "Không thể tải danh sách thể loại");
      }
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "error" in error
          ? (error.error as string)
          : "Đã xảy ra lỗi";
      setError(errorMessage || "Đã xảy ra lỗi khi tải danh sách thể loại");
      toast.error(errorMessage || "Đã xảy ra lỗi khi tải danh sách thể loại");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchTerm]);

  // Gọi API khi thay đổi trang hoặc tìm kiếm
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Xử lý thêm thể loại mới
  const handleAddCategory = async (categoryData: CategoryCreateUpdate) => {
    try {
      const response = await createCategory(categoryData);

      if (response.status == 200) {
        toast.success("Thêm thể loại thành công");
        fetchCategories(); // Tải lại danh sách
        setIsModalOpen(false);
      } else {
        toast.error(response.message || "Không thể thêm thể loại");
      }
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "error" in error
          ? (error.error as string)
          : "Đã xảy ra lỗi";
      toast.error(errorMessage || "Đã xảy ra lỗi khi thêm thể loại");
    }
  };

  // Xử lý cập nhật thể loại
  const handleUpdateCategory = async (categoryData: CategoryCreateUpdate) => {
    if (!currentCategory) return;

    try {
      const response = await updateCategory(currentCategory.id, categoryData);

      if (response.status == 200) {
        toast.success("Cập nhật thể loại thành công");
        fetchCategories(); // Tải lại danh sách
        setIsModalOpen(false);
      } else {
        toast.error(response.message || "Không thể cập nhật thể loại");
      }
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "error" in error
          ? (error.error as string)
          : "Đã xảy ra lỗi";
      toast.error(errorMessage || "Đã xảy ra lỗi khi cập nhật thể loại");
    }
  };

  // Xử lý xóa thể loại
  const handleDeleteCategory = async () => {
    if (!currentCategory) return;

    try {
      const response = await deleteCategory(currentCategory.id);

      if (response.status == 200) {
        toast.success("Xóa thể loại thành công");
        fetchCategories(); // Tải lại danh sách
        setIsDeleteModalOpen(false);
        setCurrentCategory(null);
      } else {
        toast.error(response.message || "Không thể xóa thể loại");
      }
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "error" in error
          ? (error.error as string)
          : "Đã xảy ra lỗi";
      toast.error(errorMessage || "Đã xảy ra lỗi khi xóa thể loại");
    }
  };

  // Mở modal thêm thể loại mới
  const handleOpenAddModal = () => {
    setCurrentCategory(null);
    setIsModalOpen(true);
  };

  // Mở modal sửa thể loại
  const handleOpenEditModal = (category: CategoryResponse) => {
    setCurrentCategory(category);
    setIsModalOpen(true);
  };

  // Mở modal xác nhận xóa
  const handleOpenDeleteModal = (category: CategoryResponse) => {
    setCurrentCategory(category);
    setIsDeleteModalOpen(true);
  };

  // Xử lý tìm kiếm
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
  };

  return (
    <DashboardLayout title="Quản lý thể loại">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm thể loại..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-green-200 rounded-lg w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />
          <FiSearch className="h-5 w-5 text-green-400 absolute left-3 top-2.5 dark:text-green-500" />
          <button type="submit" className="hidden">
            Tìm kiếm
          </button>
        </form>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 dark:bg-green-700 dark:hover:bg-green-600"
        >
          <FiPlus size={18} />
          <span>Thêm thể loại mới</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-green-100 dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 border-b border-green-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Danh sách thể loại
          </h2>
        </div>

        {isLoading ? (
          <div className="p-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-rose-500 flex flex-col items-center">
            <FiAlertCircle size={40} className="mb-2" />
            <p>{error}</p>
            <button
              onClick={fetchCategories}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Thử lại
            </button>
          </div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            Không tìm thấy thể loại nào
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-green-50 dark:bg-green-900/30">
                <tr>
                  <th className="px-6 py-3 text-center text-xs font-medium text-green-700 uppercase tracking-wider dark:text-green-400 ">
                    Tên thể loại
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-green-700 uppercase tracking-wider dark:text-green-400 ">
                    Mô tả
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-green-700 uppercase tracking-wider dark:text-green-400 ">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-green-700 uppercase tracking-wider dark:text-green-400 ">
                    Ngày sửa
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-green-700 uppercase tracking-wider dark:text-green-400 ">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-green-100 dark:divide-gray-700">
                {categories.map((category) => (
                  <tr
                    key={category.id}
                    className="hover:bg-green-50/50 dark:hover:bg-green-900/10"
                  >
                    <td className="text-center px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-800 dark:text-gray-200">
                        {category.name}
                      </div>
                    </td>
                    <td className="text-center px-6 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                      {category.description}
                    </td>
                    <td className="text-center px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {new Date(category.createdAt).toLocaleDateString(
                        "vi-VN",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </td>
                    <td className="text-center px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {new Date(category.updatedAt).toLocaleDateString(
                        "vi-VN",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex justify-center space-x-3">
                        <button
                          onClick={() => handleOpenEditModal(category)}
                          className="text-green-600 hover:text-green-800 flex items-center dark:text-green-500 dark:hover:text-green-400"
                          aria-label="Sửa thể loại"
                        >
                          <FiEdit className="mr-1" size={16} />
                        </button>
                        <button
                          onClick={() => handleOpenDeleteModal(category)}
                          className="text-rose-500 hover:text-rose-700 flex items-center dark:text-rose-400 dark:hover:text-rose-300"
                          aria-label="Xoá thể loại"
                        >
                          <FiTrash2 className="mr-1" size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="p-4 border-t border-green-100 dark:border-gray-700">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* Modal thêm/sửa thể loại */}
      {isModalOpen && (
        <CategoryModal
          category={currentCategory}
          onClose={() => setIsModalOpen(false)}
          onSave={currentCategory ? handleUpdateCategory : handleAddCategory}
        />
      )}

      {/* Modal xác nhận xóa */}
      {isDeleteModalOpen && currentCategory && (
        <DeleteConfirmModal
          categoryName={currentCategory.name}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteCategory}
        />
      )}
    </DashboardLayout>
  );
}
