import { getCategories } from "@/services/categoryService";
import { createComicWithCover, deleteComic, getComics, updateComicWithCover } from "@/services/comicService";
import { CategoryResponse, ComicCreateUpdate, ComicResponse } from "@/types/api";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const useComicManagement = (initialPage = 1, pageSize = 5) => {

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
  const handleAddComic = async (comicData: ComicCreateUpdate, file?: File) => {
    try {
      const response = await createComicWithCover(comicData, file);

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
  const handleUpdateComic = async (
    comicData: ComicCreateUpdate,
    file?: File
  ) => {
    if (!currentComic) return;

    try {
      const response = await updateComicWithCover(
        currentComic.id,
        comicData,
        file
      );

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

  return {
    categories,
    comics,
    currentPage,
    isLoading,
    searchTerm,
    error,
    isModalOpen,
    isDeleteModalOpen,
    currentComic,
    statusFilter,
    categoryFilter,
    totalPages,
    isViewModalOpen,

    // Actions
    setCurrentPage,
    setSearchTerm,
    setStatusFilter,
    setCategoryFilter,
    setIsModalOpen,
    setIsDeleteModalOpen,
    setIsViewModalOpen,
    handleOpenAddModal,
    handleOpenEditModal,
    handleOpenDeleteModal,
    handleOpenViewModal,
    handleSearch,
    handlePageChange,
    handleAddComic,
    handleUpdateComic,
    handleDeleteComic,
  }
}
