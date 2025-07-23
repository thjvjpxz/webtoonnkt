import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import * as publisherService from "@/services/publisherService";
import { getAllCategories } from "@/services/categoryService";
import { CategoryResponse } from "@/types/category";
import { ComicCreateUpdate, ComicResponse } from "@/types/comic";

export const usePublisher = () => {
  const { user, isLoading: authLoading } = useAuth();
  const isPublisher = user?.role?.name === "PUBLISHER";

  // Comics state
  const [comics, setComics] = useState<ComicResponse[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter và search states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  // Modal states
  const [isComicModalOpen, setIsComicModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentComic, setCurrentComic] = useState<ComicResponse | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ==================== FETCH FUNCTIONS ====================


  // Lấy danh sách comic của publisher với filter và search
  const fetchMyComics = useCallback(async () => {
    if (!isPublisher) return;

    setIsLoading(true);
    try {
      const response = await publisherService.getMyComics(
        currentPage - 1, // Backend sử dụng 0-based indexing
        pageSize,
        searchTerm.trim(),
        statusFilter,
        categoryFilter
      );

      if (response.status === 200 && response.data) {
        setComics(response.data);
        setTotalPages(response.totalPages || 1);
      } else {
        setComics([]);
        toast.error(response.message || "Không thể tải danh sách truyện");
      }
    } catch {
      setComics([]);
      toast.error("Đã xảy ra lỗi khi tải danh sách truyện");
    } finally {
      setIsLoading(false);
    }
  }, [isPublisher, searchTerm, statusFilter, categoryFilter, currentPage, pageSize]);

  // Lấy danh sách thể loại
  const fetchCategories = useCallback(async () => {
    try {
      const response = await getAllCategories();
      if (response.status === 200 && response.data) {
        setCategories(response.data);
      }
    } catch {
      toast.error("Đã xảy ra lỗi khi tải danh sách thể loại");
    }
  }, []);

  // ==================== COMIC MANAGEMENT ====================

  // Thêm comic mới
  const handleAddComic = async (comicData: ComicCreateUpdate, file?: File) => {
    try {
      const response = await publisherService.createComic(comicData, file);

      if (response.status === 200) {
        toast.success("Thêm truyện thành công");
        fetchMyComics();
        setIsComicModalOpen(false);
      } else {
        toast.error(response.message || "Không thể thêm truyện");
      }
    } catch {
      toast.error("Đã xảy ra lỗi khi thêm truyện");
    }
  };

  // Cập nhật comic
  const handleUpdateComic = async (comicData: ComicCreateUpdate, file?: File) => {
    if (!currentComic) return;

    try {
      const response = await publisherService.updateComic(
        currentComic.id,
        comicData,
        file
      );

      if (response.status === 200) {
        toast.success("Cập nhật truyện thành công");
        fetchMyComics();
        setIsComicModalOpen(false);
      } else {
        toast.error(response.message || "Không thể cập nhật truyện");
      }
    } catch {
      toast.error("Đã xảy ra lỗi khi cập nhật truyện");
    }
  };

  // Xóa comic
  const handleDeleteComic = async () => {
    if (!currentComic) return;

    setIsDeleting(true);
    try {
      const response = await publisherService.deleteComic(currentComic.id);

      if (response.status === 200) {
        toast.success("Xóa truyện thành công");
        fetchMyComics();
        setIsDeleteModalOpen(false);
      } else {
        toast.error(response.message || "Không thể xóa truyện");
      }
    } catch {
      toast.error("Đã xảy ra lỗi khi xóa truyện");
    } finally {
      setIsDeleting(false);
    }
  };

  // ==================== MODAL HANDLERS ====================

  const handleOpenAddModal = () => {
    setCurrentComic(null);
    setIsComicModalOpen(true);
  };

  const handleOpenEditModal = (comic: ComicResponse) => {
    setCurrentComic(comic);
    setIsComicModalOpen(true);
  };

  const handleOpenDeleteModal = (comic: ComicResponse) => {
    setCurrentComic(comic);
    setIsDeleteModalOpen(true);
  };

  const handleOpenViewModal = (comic: ComicResponse) => {
    setCurrentComic(comic);
    setIsViewModalOpen(true);
  };

  // ==================== SEARCH & FILTER HANDLERS ====================

  // Xử lý search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset về trang đầu khi search
  };

  // Xử lý thay đổi filter trạng thái
  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset về trang đầu khi filter
  };

  // Xử lý thay đổi filter thể loại
  const handleCategoryFilterChange = (categoryId: string) => {
    setCategoryFilter(categoryId);
    setCurrentPage(1); // Reset về trang đầu khi filter
  };

  // Reset tất cả filter
  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setCategoryFilter("");
    setCurrentPage(1);
  };

  // Xử lý thay đổi trang
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // ==================== EFFECTS ====================

  useEffect(() => {
    if (!authLoading && isPublisher) {
      fetchCategories();
    }
  }, [authLoading, isPublisher, fetchCategories]);

  useEffect(() => {
    if (!authLoading && isPublisher) {
      fetchMyComics();
    }
  }, [authLoading, isPublisher, fetchMyComics]);

  return {
    // User info
    isPublisher,

    // Comics
    comics,
    categories,
    isLoading,

    // Filter và search states
    searchTerm,
    statusFilter,
    categoryFilter,
    currentPage,
    totalPages,
    pageSize,

    // Modal states
    isComicModalOpen,
    isDeleteModalOpen,
    isViewModalOpen,
    currentComic,
    isDeleting,

    // Actions
    setSearchTerm,
    setStatusFilter,
    setCategoryFilter,
    setCurrentPage,
    setIsComicModalOpen,
    setIsDeleteModalOpen,
    setIsViewModalOpen,

    // Handlers
    handleOpenAddModal,
    handleOpenEditModal,
    handleOpenDeleteModal,
    handleOpenViewModal,
    handleSearch,
    handleStatusFilterChange,
    handleCategoryFilterChange,
    handleResetFilters,
    handlePageChange,
    handleAddComic,
    handleUpdateComic,
    handleDeleteComic,

    // Fetch functions
    fetchMyComics,
  };
}; 