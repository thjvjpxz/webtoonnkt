"use client";

import ChapterModal from "@/components/dashboard/chapters/ChapterModal";
import DeleteChapterModal from "@/components/dashboard/chapters/DeleteChapterModal";
import ViewChapter from "@/components/dashboard/chapters/ViewChapter";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Pagination from "@/components/dashboard/Pagination";
import { useChapterManagement } from "@/hooks/useChapterManagement";
import { useEffect } from "react";
import {
  FiAlertCircle,
  FiEdit,
  FiEye,
  FiFilter,
  FiPlus,
  FiSearch,
  FiTrash2,
} from "react-icons/fi";

export default function Chapters() {
  const {
    chapters,
    comics,
    currentPage,
    isLoading,
    searchTerm,
    error,
    statusFilter,
    comicFilter,
    isModalOpen,
    isDeleteModalOpen,
    currentChapter,
    totalPages,
    isViewModalOpen,

    setSearchTerm,
    setStatusFilter,
    setComicFilter,
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
    handleAddChapter,
    handleUpdateChapter,
    handleDeleteChapter,
  } = useChapterManagement();

  // Log chapters để debug
  useEffect(() => {
    if (chapters.length > 0) {
      console.log("Chapters loaded:", chapters.length);
      chapters.forEach(chapter => {
        console.log(`Chapter ${chapter.id} status:`, chapter.status);
      });
    }
  }, [chapters]);

  // Hiển thị trạng thái
  const renderStatus = (status: string) => {
    console.log("Status value:", status, typeof status);
    if (!status) {
      console.log("Status is empty");
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">
          Không có
        </span>
      );
    }

    const statusLower = status.toLowerCase();
    console.log("Status lowercase:", statusLower);

    switch (statusLower) {
      case "free":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
            Miễn phí
          </span>
        );
      case "fee":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            Trả phí
          </span>
        );
      case "vip":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
            VIP
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            Đã hoàn thành
          </span>
        );
      case "ongoing":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            Đang cập nhật
          </span>
        );
      default:
        console.log("Status didn't match any case:", status);
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">
            {status}
          </span>
        );
    }
  };

  return (
    <DashboardLayout title="Quản lý chapter">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm chapter..."
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
          className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 dark:bg-green-700 dark:hover:bg-green-600 cursor-pointer"
        >
          <FiPlus size={18} />
          <span>Thêm chapter mới</span>
        </button>
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
            <option value="FREE">Miễn phí</option>
            <option value="FEE">Trả phí</option>
            <option value="VIP">VIP</option>
          </select>
          <FiFilter className="h-5 w-5 text-green-400 absolute left-3 top-2.5 dark:text-green-500" />
        </div>

        <div className="relative">
          <select
            value={comicFilter || ""}
            onChange={(e) => {
              setComicFilter(e.target.value || undefined);
              setCurrentPage(1);
            }}
            className="pl-10 pr-4 py-2 border border-green-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          >
            <option value="">Chọn truyện</option>
            {comics.map((comic) => (
              <option key={comic.id} value={comic.id}>
                {comic.name}
              </option>
            ))}
          </select>
          <FiFilter className="h-5 w-5 text-green-400 absolute left-3 top-2.5 dark:text-green-500" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-green-100 dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 border-b border-green-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Danh sách chapter
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-green-50 dark:bg-green-900/30">
              <tr>
                <th className="px-6 py-3 text-center text-xs font-medium text-green-700 uppercase tracking-wider dark:text-green-400">
                  Tiêu đề
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-green-700 uppercase tracking-wider dark:text-green-400">
                  Số chapter
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-green-700 uppercase tracking-wider dark:text-green-400">
                  Truyện
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-green-700 uppercase tracking-wider dark:text-green-400">
                  Tổng ảnh
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
              ) : !comicFilter ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-10 text-center text-gray-500 dark:text-gray-400"
                  >
                    Vui lòng chọn truyện để xem danh sách chapter
                  </td>
                </tr>
              ) : chapters.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-10 text-center text-gray-500 dark:text-gray-400"
                  >
                    Không tìm thấy chapter nào
                  </td>
                </tr>
              ) : (
                chapters.map((chapter) => (
                  <tr
                    key={chapter.id}
                    className="hover:bg-green-50/50 dark:hover:bg-gray-700/30"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-200">
                        {chapter.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900 dark:text-gray-200">
                        {chapter.chapterNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900 dark:text-gray-200">
                        {chapter.comic?.name || chapter.comicName || "Không có thông tin"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900 dark:text-gray-200">
                        {chapter.detailChapters?.length || 0} ảnh
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {renderStatus(chapter.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(chapter.updatedAt).toLocaleDateString(
                          "vi-VN",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleOpenViewModal(chapter)}
                          className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Xem chi tiết"
                        >
                          <FiEye size={18} />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(chapter)}
                          className="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                          title="Sửa"
                        >
                          <FiEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleOpenDeleteModal(chapter)}
                          className="p-1 text-rose-600 hover:text-rose-800 dark:text-rose-400 dark:hover:text-rose-300"
                          title="Xóa"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-green-100 dark:border-gray-700">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      <ChapterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={currentChapter ? handleUpdateChapter : handleAddChapter}
        chapter={currentChapter}
        comics={comics}
      />

      {currentChapter && (
        <>
          <DeleteChapterModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteChapter}
            chapterTitle={currentChapter.title}
          />

          <ViewChapter
            isOpen={isViewModalOpen}
            onClose={() => setIsViewModalOpen(false)}
            chapter={currentChapter}
          />
        </>
      )}
    </DashboardLayout>
  );
} 