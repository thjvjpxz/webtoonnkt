"use client";

import DashboardLayout from "@/components/admin/DashboardLayout";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiSearch,
  FiAlertCircle,
} from "react-icons/fi";
import CategoryModal from "@/components/admin/categories/CategoryModal";
import DeleteConfirmModal from "@/components/admin/categories/DeleteConfirmModal";
import Pagination from "@/components/admin/Pagination"
import { useCategory } from "@/hooks/useCategory";
import { formatDate } from "@/utils/helpers";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function Categories() {
  const {
    categories,
    currentPage,
    totalPages,
    isLoading,
    searchTerm,
    error,
    isModalOpen,
    isDeleteModalOpen,
    currentCategory,

    setCurrentPage,
    setSearchTerm,
    handleOpenAddModal,
    handleOpenEditModal,
    handleOpenDeleteModal,
    handleCloseModal,
    handleCloseDeleteModal,
    handleAddCategory,
    handleUpdateCategory,
    handleDeleteCategory,
    handleSearch,
  } = useCategory();

  return (
    <DashboardLayout title="Quản lý thể loại">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <form onSubmit={handleSearch} className="relative">
          <Input
            placeholder="Tìm kiếm thể loại..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="sm:w-80"
            leftIcon={<FiSearch className="h-5 w-5 text-[var(--primary)]" />}
          />
          <button type="submit" className="hidden">
            Tìm kiếm
          </button>
        </form>

        <Button
          variant="success"
          onClick={handleOpenAddModal}
          aria-label="Thêm thể loại mới"
          title="Thêm thể loại mới"
          icon={<FiPlus size={18} />}
          size="md"
        >
          <span>Thêm thể loại mới</span>
        </Button>
      </div>

      <div className="bg-[var(--background)] rounded-xl shadow-sm overflow-hidden border border-[var(--border)] dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 border-b border-[var(--border)] dark:border-gray-700">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
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
            <Button
              variant="success"
              onClick={handleSearch}
              className="mt-4"
            >
              Thử lại
            </Button>
          </div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            Không tìm thấy thể loại nào
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
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
                      {formatDate(category.createdAt)}
                    </td>
                    <td className="text-center px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(category.updatedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex justify-center space-x-2">
                        <Button
                          variant="edit"
                          onClick={() => handleOpenEditModal(category)}
                          aria-label="Sửa thể loại"
                          title="Sửa"
                          icon={<FiEdit size={18} />}
                          size="xs"
                        />
                        <Button
                          variant="delete"
                          onClick={() => handleOpenDeleteModal(category)}
                          aria-label="Xoá thể loại"
                          title="Xóa"
                          icon={<FiTrash2 size={18} />}
                          size="xs"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!isLoading && !error && categories.length > 0 && (
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
          onClose={handleCloseModal}
          onSave={currentCategory ? handleUpdateCategory : handleAddCategory}
        />
      )}

      {/* Modal xác nhận xóa */}
      {isDeleteModalOpen && currentCategory && (
        <DeleteConfirmModal
          categoryName={currentCategory.name}
          onClose={handleCloseDeleteModal}
          onConfirm={handleDeleteCategory}
        />
      )}
    </DashboardLayout>
  );
}
