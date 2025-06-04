import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { CommentResponse, CommentStatus, CommentFilters } from "@/types/comment";
import { ComicResponse } from "@/types/comic";
import { UserResponse } from "@/types/user";
import {
  getComments,
  deleteComment,
  blockComment,
  unblockComment,
} from "@/services/commentService";
import { getComics } from "@/services/comicService";
import { getUsers } from "@/services/userService";

export const useComment = (initialPage = 1, pageSize = 10) => {
  // State cho danh sách comment và phân trang
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State cho bộ lọc
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<CommentStatus | "">("");
  const [comicFilter, setComicFilter] = useState("");
  const [userFilter, setUserFilter] = useState("");

  // State cho modal
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentComment, setCurrentComment] = useState<CommentResponse | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // State cho dropdown options
  const [comics, setComics] = useState<ComicResponse[]>([]);
  const [users, setUsers] = useState<UserResponse[]>([]);

  // Lấy danh sách comic cho filter
  const fetchComics = useCallback(async () => {
    try {
      const response = await getComics(1, 100); // Lấy 100 comic đầu tiên
      if (response.status === 200 && response.data) {
        setComics(response.data);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách comic:", error);
    }
  }, []);

  // Lấy danh sách user cho filter
  const fetchUsers = useCallback(async () => {
    try {
      const response = await getUsers(1, 100); // Lấy 100 user đầu tiên
      if (response.status === 200 && response.data) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách user:", error);
    }
  }, []);

  // Lấy danh sách comment từ API
  const fetchComments = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const filters: CommentFilters = {};

      if (searchTerm) filters.search = searchTerm;
      if (statusFilter) filters.status = statusFilter as CommentStatus;
      if (comicFilter) filters.comicId = comicFilter;
      if (userFilter) filters.userId = userFilter;

      const response = await getComments(currentPage, pageSize, filters);

      if (response.status === 200 && response.data) {
        setComments(response.data);
        setTotalPages(response.totalPages || 1);
      } else {
        setComments([]);
        setError(response.message || "Không thể tải danh sách comment");
        toast.error(response.message || "Không thể tải danh sách comment");
      }
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "error" in error
          ? (error.error as string)
          : "Đã xảy ra lỗi";
      setError(errorMessage || "Đã xảy ra lỗi khi tải danh sách comment");
      toast.error(errorMessage || "Đã xảy ra lỗi khi tải danh sách comment");
      setComments([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchTerm, statusFilter, comicFilter, userFilter, pageSize]);

  // Gọi API khi thay đổi trang hoặc bộ lọc
  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // Lấy danh sách options khi component mount
  useEffect(() => {
    fetchComics();
    fetchUsers();
  }, [fetchComics, fetchUsers]);

  // Xử lý chặn comment
  const handleBlockComment = async (comment: CommentResponse) => {
    try {
      const response = await blockComment(comment.id);
      if (response.status === 200) {
        toast.success("Chặn comment thành công");
        fetchComments(); // Tải lại danh sách
      } else {
        toast.error(response.message || "Không thể chặn comment");
      }
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "error" in error
          ? (error.error as string)
          : "Đã xảy ra lỗi";
      toast.error(errorMessage || "Đã xảy ra lỗi khi chặn comment");
    }
  };

  // Xử lý bỏ chặn comment
  const handleUnblockComment = async (comment: CommentResponse) => {
    try {
      const response = await unblockComment(comment.id);
      if (response.status === 200) {
        toast.success("Bỏ chặn comment thành công");
        fetchComments(); // Tải lại danh sách
      } else {
        toast.error(response.message || "Không thể bỏ chặn comment");
      }
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "error" in error
          ? (error.error as string)
          : "Đã xảy ra lỗi";
      toast.error(errorMessage || "Đã xảy ra lỗi khi bỏ chặn comment");
    }
  };

  // Xử lý xóa comment
  const handleDeleteComment = async () => {
    if (!currentComment) return;

    setIsDeleting(true);
    try {
      const response = await deleteComment(currentComment.id);
      if (response.status === 200) {
        toast.success("Xóa comment thành công");
        fetchComments(); // Tải lại danh sách
        setIsDeleteModalOpen(false);
      } else {
        toast.error(response.message || "Không thể xóa comment");
      }
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "error" in error
          ? (error.error as string)
          : "Đã xảy ra lỗi";
      toast.error(errorMessage || "Đã xảy ra lỗi khi xóa comment");
    } finally {
      setIsDeleting(false);
    }
  };

  // Xử lý tìm kiếm
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset về trang đầu tiên khi tìm kiếm
  };

  // Xử lý thay đổi trang
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Xử lý mở modal xem chi tiết
  const handleOpenViewModal = async (comment: CommentResponse) => {
    setCurrentComment(comment);
    setIsViewModalOpen(true);
  };

  // Xử lý mở modal xóa
  const handleOpenDeleteModal = (comment: CommentResponse) => {
    setCurrentComment(comment);
    setIsDeleteModalOpen(true);
  };

  // Xử lý đóng modal
  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setCurrentComment(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCurrentComment(null);
  };

  // Format trạng thái comment
  const getStatusText = (status: CommentStatus) => {
    switch (status) {
      case CommentStatus.ACTIVE:
        return "Hoạt động";
      case CommentStatus.BLOCKED:
        return "Bị chặn";
      case CommentStatus.DELETED:
        return "Đã xóa";
      default:
        return status;
    }
  };

  // Format trạng thái màu
  const getStatusColor = (status: CommentStatus) => {
    switch (status) {
      case CommentStatus.ACTIVE:
        return "text-green-600 bg-green-100";
      case CommentStatus.BLOCKED:
        return "text-red-600 bg-red-100";
      case CommentStatus.DELETED:
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return {
    // Data
    comments,
    comics,
    users,
    currentComment,

    // Pagination
    currentPage,
    totalPages,

    // Loading states
    isLoading,
    isDeleting,

    // Error state
    error,

    // Filters
    searchTerm,
    statusFilter,
    comicFilter,
    userFilter,

    // Modal states
    isViewModalOpen,
    isDeleteModalOpen,

    // Setters
    setCurrentPage,
    setSearchTerm,
    setStatusFilter,
    setComicFilter,
    setUserFilter,

    // Actions
    handleSearch,
    handlePageChange,
    handleOpenViewModal,
    handleOpenDeleteModal,
    handleCloseViewModal,
    handleCloseDeleteModal,
    handleBlockComment,
    handleUnblockComment,
    handleDeleteComment,
    fetchComments,

    // Helpers
    getStatusText,
    getStatusColor,
  };
}; 