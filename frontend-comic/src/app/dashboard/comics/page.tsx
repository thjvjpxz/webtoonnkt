"use client";

import ComicModal from "@/components/dashboard/comics/ComicModal";
import DeleteComicModal from "@/components/dashboard/comics/DeleteComicModal";
import ViewComic from "@/components/dashboard/comics/ViewComic";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Pagination from "@/components/dashboard/Pagination";
import Button from "@/components/ui/Button";
import { useComic } from "@/hooks/useComic";
import Image from "next/image";
import {
  FiAlertCircle,
  FiEdit,
  FiEye,
  FiFilter,
  FiPlus,
  FiSearch,
  FiTrash2,
} from "react-icons/fi";

export default function Comics() {
  const {
    categories,
    comics,
    currentPage,
    isLoading,
    searchTerm,
    error,
    statusFilter,
    categoryFilter,
    isModalOpen,
    isDeleteModalOpen,
    currentComic,
    totalPages,
    isViewModalOpen,
    isDeleting,

    setSearchTerm,
    setStatusFilter,
    setCategoryFilter,
    setCurrentPage,
    setIsModalOpen,
    setIsDeleteModalOpen,
    setIsViewModalOpen,
    handleSearch,
    handleOpenAddModal,
    handleOpenEditModal,
    handleOpenDeleteModal,
    handleOpenViewModal,
    handlePageChange,
    handleAddComic,
    handleUpdateComic,
    handleDeleteComic,


  } = useComic();

  // Hiển thị trạng thái
  const renderStatus = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            Đã hoàn thành
          </span>
        );
      case "ONGOING":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            Đang cập nhật
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <DashboardLayout title="Quản lý truyện">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm truyện..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-green-200 rounded-lg w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />
          <FiSearch className="h-5 w-5 text-green-400 absolute left-3 top-2.5 dark:text-green-500" />
          <button type="submit" className="hidden">
            Tìm kiếm
          </button>
        </form>

        <Button
          variant="success"
          onClick={handleOpenAddModal}
          aria-label="Thêm truyện mới"
          title="Thêm truyện mới"
          icon={<FiPlus size={18} />}
          size="md"
        >
          <span>Thêm truyện mới</span>
        </Button>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10 pr-4 py-2 border border-green-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="ongoing">Đang cập nhật</option>
            <option value="completed">Đã hoàn thành</option>
          </select>
          <FiFilter className="h-5 w-5 text-green-400 absolute left-3 top-2.5 dark:text-green-500" />
        </div>

        <div className="relative">
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10 pr-4 py-2 border border-green-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          >
            <option value="">Tất cả thể loại</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <FiFilter className="h-5 w-5 text-green-400 absolute left-3 top-2.5 dark:text-green-500" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-green-100 dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 border-b border-green-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Danh sách truyện
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-green-50 dark:bg-green-900/30">
              <tr>
                <th className="px-6 py-3 text-center text-xs font-medium text-green-700 uppercase tracking-wider dark:text-green-400">
                  Truyện
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-green-700 uppercase tracking-wider dark:text-green-400">
                  Tác giả
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-green-700 uppercase tracking-wider dark:text-green-400">
                  Thể loại
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-green-700 uppercase tracking-wider dark:text-green-400">
                  Lượt xem
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-green-700 uppercase tracking-wider dark:text-green-400">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-green-700 uppercase tracking-wider dark:text-green-400">
                  Cập nhật
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-green-700 uppercase tracking-wider dark:text-green-400">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-green-100 dark:divide-gray-700">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-10 text-center text-gray-500 dark:text-gray-400"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mb-2"></div>
                      <p>Đang tải dữ liệu...</p>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-10 text-center text-rose-500"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <FiAlertCircle size={24} className="mb-2" />
                      <p>{error}</p>
                    </div>
                  </td>
                </tr>
              ) : comics.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-10 text-center text-gray-500 dark:text-gray-400"
                  >
                    Không tìm thấy truyện nào
                  </td>
                </tr>
              ) : (
                comics.map((comic, index) => (
                  <tr
                    key={comic.id}
                    className="hover:bg-green-50/50 dark:hover:bg-gray-700/30"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-24 w-16 flex-shrink-0 mr-3 relative">
                          <Image
                            src={
                              comic.thumbUrl ||
                              "https://placehold.co/100x150/4ade80/fff?text=NA"
                            }
                            alt={comic.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover rounded shadow-sm"
                            priority={index < 3}
                          />
                        </div>
                        <div className="ml-1">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-200 max-w-[150px] truncate">
                            {comic.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 max-w-[150px] truncate">
                            {comic.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900 dark:text-gray-200">
                        {comic.author || <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">Đang cập nhật</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {comic.categories.slice(0, 3).map((category) => (
                          <span
                            key={category.id}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          >
                            {category.name}
                          </span>
                        ))}
                        {comic.categories.length > 3 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                            +{comic.categories.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 dark:text-gray-400">
                      {comic.viewsCount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {renderStatus(comic.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 dark:text-gray-400">
                      {new Date(comic.updatedAt).toLocaleDateString("vi-VN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex space-x-3 justify-center">
                        <Button
                          variant="info"
                          onClick={() => handleOpenViewModal(comic)}
                          aria-label="Xem chi tiết"
                          title="Xem chi tiết"
                          icon={<FiEye size={18} />}
                          size="xs"
                        />

                        <Button
                          variant="edit"
                          onClick={() => handleOpenEditModal(comic)}
                          aria-label="Sửa truyện"
                          title="Sửa"
                          icon={<FiEdit size={18} />}
                          size="xs"
                        />
                        <Button
                          variant="delete"
                          onClick={() => handleOpenDeleteModal(comic)}
                          aria-label="Xóa truyện"
                          title="Xóa"
                          icon={<FiTrash2 size={18} />}
                          size="xs"
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!isLoading && !error && comics.length > 0 && (
          <div className="p-4 border-t border-green-100 dark:border-gray-700">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>



      {isModalOpen && (
        <ComicModal
          comic={currentComic}
          categories={categories}
          onClose={() => setIsModalOpen(false)}
          onSave={currentComic ? handleUpdateComic : handleAddComic}
        />
      )}

      {isDeleteModalOpen && currentComic && (
        <DeleteComicModal
          comicTitle={currentComic.name}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteComic}
          isDeleting={isDeleting}
        />
      )}

      {isViewModalOpen && currentComic && (
        <ViewComic
          comic={currentComic}
          onClose={() => setIsViewModalOpen(false)}
        />
      )}
    </DashboardLayout>
  );
}
