import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import * as publisherService from "@/services/publisherService";
import { getAllCategories } from "@/services/categoryService";
import {
  PublisherComicRequest,
  PublisherComicResponse,
  PublisherStatsResponse,
  WithdrawalRequest,
  WithdrawalRequestDto
} from "@/types/publisher";
import { CategoryResponse } from "@/types/category";

export const usePublisher = () => {
  const { user, isLoading: authLoading } = useAuth();
  const isPublisher = user?.role?.name === "PUBLISHER";

  // Stats state
  const [stats, setStats] = useState<PublisherStatsResponse | null>(null);
  const [availableBalance, setAvailableBalance] = useState<number>(0);

  // Comics state
  const [comics, setComics] = useState<PublisherComicResponse[]>([]);
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
  const [currentComic, setCurrentComic] = useState<PublisherComicResponse | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Withdrawal states
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);

  // ==================== FETCH FUNCTIONS ====================

  // Lấy thống kê publisher
  const fetchPublisherStats = useCallback(async () => {
    if (!isPublisher) return;

    try {
      const response = await publisherService.getPublisherStats();
      if (response.status === 200 && response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Lỗi khi lấy thống kê:", error);
    }
  }, [isPublisher]);

  // Lấy số dư khả dụng
  const fetchAvailableBalance = useCallback(async () => {
    if (!isPublisher) return;

    try {
      const response = await publisherService.getAvailableBalance();
      if (response.status === 200 && response.data !== undefined) {
        setAvailableBalance(response.data);
      }
    } catch (error) {
      console.error("Lỗi khi lấy số dư:", error);
    }
  }, [isPublisher]);

  // Lấy danh sách comic của publisher với filter và search
  const fetchMyComics = useCallback(async () => {
    if (!isPublisher) return;

    setIsLoading(true);
    try {
      const response = await publisherService.getMyComics(
        searchTerm.trim(),
        statusFilter,
        categoryFilter,
        currentPage - 1, // Backend sử dụng 0-based indexing
        pageSize
      );

      if (response.status === 200 && response.data) {
        setComics(response.data);
        setTotalPages(response.totalPages || 1);
      } else {
        setComics([]);
        toast.error(response.message || "Không thể tải danh sách truyện");
      }
    } catch (error) {
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
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi tải danh sách thể loại");
    }
  }, []);

  // Lấy danh sách yêu cầu rút tiền
  const fetchWithdrawalRequests = useCallback(async () => {
    if (!isPublisher) return;

    try {
      const response = await publisherService.getMyWithdrawalRequests();
      if (response.status === 200 && response.data) {
        setWithdrawalRequests(response.data);
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi tải danh sách yêu cầu rút tiền");
    }
  }, [isPublisher]);

  // ==================== COMIC MANAGEMENT ====================

  // Thêm comic mới
  const handleAddComic = async (comicData: PublisherComicRequest, file?: File) => {
    try {
      const response = await publisherService.createComicWithCover(comicData, file);

      if (response.status === 200) {
        toast.success("Thêm truyện thành công");
        fetchMyComics();
        fetchPublisherStats(); // Cập nhật stats
        setIsComicModalOpen(false);
      } else {
        toast.error(response.message || "Không thể thêm truyện");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi thêm truyện");
    }
  };

  // Cập nhật comic
  const handleUpdateComic = async (comicData: PublisherComicRequest, file?: File) => {
    if (!currentComic) return;

    try {
      const response = await publisherService.updateComicWithCover(
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
    } catch (error) {
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
        fetchPublisherStats(); // Cập nhật stats
        setIsDeleteModalOpen(false);
      } else {
        toast.error(response.message || "Không thể xóa truyện");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi xóa truyện");
    } finally {
      setIsDeleting(false);
    }
  };

  // ==================== WITHDRAWAL MANAGEMENT ====================

  // Tạo yêu cầu rút tiền
  const handleCreateWithdrawal = async (requestData: WithdrawalRequestDto) => {
    try {
      const response = await publisherService.createWithdrawalRequest(requestData);

      if (response.status === 200) {
        toast.success("Tạo yêu cầu rút tiền thành công");
        fetchWithdrawalRequests();
        fetchAvailableBalance(); // Cập nhật số dư
        setIsWithdrawalModalOpen(false);
      } else {
        toast.error(response.message || "Không thể tạo yêu cầu rút tiền");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi tạo yêu cầu rút tiền");
    }
  };

  // ==================== MODAL HANDLERS ====================

  const handleOpenAddModal = () => {
    setCurrentComic(null);
    setIsComicModalOpen(true);
  };

  const handleOpenEditModal = (comic: PublisherComicResponse) => {
    setCurrentComic(comic);
    setIsComicModalOpen(true);
  };

  const handleOpenDeleteModal = (comic: PublisherComicResponse) => {
    setCurrentComic(comic);
    setIsDeleteModalOpen(true);
  };

  const handleOpenViewModal = (comic: PublisherComicResponse) => {
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
      fetchPublisherStats();
      fetchAvailableBalance();
      fetchWithdrawalRequests();
    }
  }, [authLoading, isPublisher, fetchCategories, fetchPublisherStats, fetchAvailableBalance, fetchWithdrawalRequests]);

  useEffect(() => {
    if (!authLoading && isPublisher) {
      fetchMyComics();
    }
  }, [authLoading, isPublisher, fetchMyComics]);

  return {
    // User info
    isPublisher,

    // Stats
    stats,
    availableBalance,

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

    // Withdrawal
    withdrawalRequests,
    isWithdrawalModalOpen,

    // Actions
    setSearchTerm,
    setStatusFilter,
    setCategoryFilter,
    setCurrentPage,
    setIsComicModalOpen,
    setIsDeleteModalOpen,
    setIsViewModalOpen,
    setIsWithdrawalModalOpen,

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
    handleCreateWithdrawal,

    // Fetch functions
    fetchMyComics,
    fetchPublisherStats,
    fetchAvailableBalance,
    fetchWithdrawalRequests,
  };
}; 