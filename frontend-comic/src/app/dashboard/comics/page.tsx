"use client";

import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiSearch,
  FiAlertCircle,
  FiFilter,
  FiEye,
} from "react-icons/fi";
import ComicModal from "@/components/dashboard/comics/ComicModal";
import DeleteComicModal from "@/components/dashboard/comics/DeleteComicModal";
import Pagination from "@/components/dashboard/Pagination";
import {
  getComics,
  createComic,
  updateComic,
  deleteComic,
} from "@/services/comicService";
import { getCategories } from "@/services/categoryService";
import {
  ComicResponse,
  ComicCreateUpdate,
  CategoryResponse,
} from "@/types/api";
import { toast } from "react-hot-toast";
import Image from "next/image";
import ViewComic from "@/components/dashboard/comics/ViewComic";

export default function Comics() {
  // State cho danh sách truyện và phân trang
  const [comics, setComics] = useState<ComicResponse[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(
    undefined
  );
  const [error, setError] = useState<string | null>(null);

  // State cho modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentComic, setCurrentComic] = useState<ComicResponse | null>(null);

  // Lấy danh sách thể loại
  const fetchCategories = useCallback(async () => {
    try {
      const response = await getCategories(1, 100); // Lấy tất cả thể loại

      if (response.status === 200 && response.data) {
        setCategories(response.data);
      } else {
        toast.error(response.message || "Không thể tải danh sách thể loại");
      }
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "error" in error
          ? (error.error as string)
          : "Đã xảy ra lỗi";
      toast.error(errorMessage || "Đã xảy ra lỗi khi tải danh sách thể loại");
    }
  }, []);

  // Lấy danh sách truyện từ API
  const fetchComics = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getComics(
        currentPage,
        5,
        searchTerm,
        statusFilter || undefined,
        categoryFilter
      );

      if (response.status === 200 && response.data) {
        setComics(response.data);
        setTotalPages(response.totalPages || 1);
      } else {
        setComics([]);
        setError(response.message || "Không thể tải danh sách truyện");
        toast.error(response.message || "Không thể tải danh sách truyện");
      }
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "error" in error
          ? (error.error as string)
          : "Đã xảy ra lỗi";
      setError(errorMessage || "Đã xảy ra lỗi khi tải danh sách truyện");
      toast.error(errorMessage || "Đã xảy ra lỗi khi tải danh sách truyện");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchTerm, statusFilter, categoryFilter]);

  // Gọi API khi thay đổi trang hoặc tìm kiếm
  useEffect(() => {
    fetchComics();
  }, [fetchComics]);

  // Lấy danh sách thể loại khi component mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Xử lý thêm truyện mới
  const handleAddComic = async (comicData: ComicCreateUpdate) => {
    try {
      const response = await createComic(comicData);

      if (response.status === 200) {
        toast.success("Thêm truyện thành công");
        fetchComics(); // Tải lại danh sách
        setIsModalOpen(false);
      } else {
        toast.error(response.message || "Không thể thêm truyện");
      }
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "error" in error
          ? (error.error as string)
          : "Đã xảy ra lỗi";
      toast.error(errorMessage || "Đã xảy ra lỗi khi thêm truyện");
    }
  };

  // Xử lý cập nhật truyện
  const handleUpdateComic = async (comicData: ComicCreateUpdate) => {
    if (!currentComic) return;

    try {
      const response = await updateComic(currentComic.id, comicData);

      if (response.status === 200) {
        toast.success("Cập nhật truyện thành công");
        fetchComics(); // Tải lại danh sách
        setIsModalOpen(false);
      } else {
        toast.error(response.message || "Không thể cập nhật truyện");
      }
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "error" in error
          ? (error.error as string)
          : "Đã xảy ra lỗi";
      toast.error(errorMessage || "Đã xảy ra lỗi khi cập nhật truyện");
    }
  };

  // Xử lý xóa truyện
  const handleDeleteComic = async () => {
    if (!currentComic) return;

    try {
      const response = await deleteComic(currentComic.id);

      if (response.status === 200) {
        toast.success("Xóa truyện thành công");
        fetchComics(); // Tải lại danh sách
        setIsDeleteModalOpen(false);
      } else {
        toast.error(response.message || "Không thể xóa truyện");
      }
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "error" in error
          ? (error.error as string)
          : "Đã xảy ra lỗi";
      toast.error(errorMessage || "Đã xảy ra lỗi khi xóa truyện");
    }
  };

  // Xử lý mở modal thêm truyện
  const handleOpenAddModal = () => {
    setCurrentComic(null);
    setIsModalOpen(true);
  };

  // Xử lý mở modal sửa truyện
  const handleOpenEditModal = (comic: ComicResponse) => {
    setCurrentComic(comic);
    setIsModalOpen(true);
  };

  // Xử lý mở modal xóa truyện
  const handleOpenDeleteModal = (comic: ComicResponse) => {
    setCurrentComic(comic);
    setIsDeleteModalOpen(true);
  };

  // Xử lý mở modal xem chi tiết truyện
  const handleOpenViewModal = (comic: ComicResponse) => {
    setCurrentComic(comic);
    setIsViewModalOpen(true);
  };

  // Xử lý tìm kiếm
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
  };

  // Xử lý thay đổi trang
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Hiển thị trạng thái
  const renderStatus = (status: string) => {
    switch (status) {
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

        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 dark:bg-green-700 dark:hover:bg-green-600 cursor-pointer"
        >
          <FiPlus size={18} />
          <span>Thêm truyện mới</span>
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
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex">
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
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-200">
                            {comic.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {comic.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900 dark:text-gray-200">
                        {comic.author}
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
                        <button
                          onClick={() => handleOpenViewModal(comic)}
                          className="text-blue-600 hover:text-blue-800 flex items-center dark:text-blue-500 dark:hover:text-blue-400 cursor-pointer"
                          aria-label="Xem chi tiết"
                        >
                          <FiEye size={18} />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(comic)}
                          className="text-green-600 hover:text-green-800 flex items-center dark:text-green-500 dark:hover:text-green-400 cursor-pointer"
                          aria-label="Sửa truyện"
                        >
                          <FiEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleOpenDeleteModal(comic)}
                          className="text-rose-600 hover:text-rose-900 dark:text-rose-400 dark:hover:text-rose-300 cursor-pointer"
                          aria-label="Xóa truyện"
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
      </div>

      {!isLoading && !error && comics.length > 0 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

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
