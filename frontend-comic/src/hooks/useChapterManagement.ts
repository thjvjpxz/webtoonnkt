import { getComics } from "@/services/comicService";
import { createChapter, deleteChapter, getChaptersByComic, updateChapter } from "@/services/chapterService";
import { ChapterCreateUpdate, ChapterResponse, ComicResponse, DetailChapterCreateUpdate } from "@/types/api";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const useChapterManagement = (initialPage = 1, pageSize = 5) => {
  // State cho danh sách chapter và phân trang
  const [chapters, setChapters] = useState<ChapterResponse[]>([]);
  const [comics, setComics] = useState<ComicResponse[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [comicFilter, setComicFilter] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  // State cho modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentChapter, setCurrentChapter] = useState<ChapterResponse | null>(null);

  // Lấy danh sách truyện
  const fetchComics = useCallback(async () => {
    try {
      const response = await getComics(1, 100); // Lấy tất cả truyện

      if (response.status === 200 && response.data) {
        setComics(response.data);
      } else {
        toast.error(response.message || "Không thể tải danh sách truyện");
      }
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "error" in error
          ? (error.error as string)
          : "Đã xảy ra lỗi";
      toast.error(errorMessage || "Đã xảy ra lỗi khi tải danh sách truyện");
    }
  }, []);

  // Lấy danh sách chapter từ API
  const fetchChapters = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    if (!comicFilter) {
      setChapters([]);
      setIsLoading(false);
      return;
    }

    try {
      const response = await getChaptersByComic(
        comicFilter,
        currentPage,
        pageSize
      );

      if (response.status === 200 && response.data) {
        setChapters(response.data);
        setTotalPages(response.totalPages || 1);
      } else {
        setChapters([]);
        setError(response.message || "Không thể tải danh sách chapter");
        toast.error(response.message || "Không thể tải danh sách chapter");
      }
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "error" in error
          ? (error.error as string)
          : "Đã xảy ra lỗi";
      setError(errorMessage || "Đã xảy ra lỗi khi tải danh sách chapter");
      toast.error(errorMessage || "Đã xảy ra lỗi khi tải danh sách chapter");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, comicFilter, pageSize]);

  // Gọi API khi thay đổi trang hoặc bộ lọc
  useEffect(() => {
    fetchChapters();
  }, [fetchChapters]);

  // Lấy danh sách truyện khi component mount
  useEffect(() => {
    fetchComics();
  }, [fetchComics]);

  // Xử lý thêm chapter mới
  const handleAddChapter = async (chapterData: ChapterCreateUpdate, files: File[]) => {
    try {
      const response = await createChapter(chapterData, files);

      if (response.status === 200) {
        toast.success("Thêm chapter thành công");
        fetchChapters(); // Tải lại danh sách
        setIsModalOpen(false);
      } else {
        toast.error(response.message || "Không thể thêm chapter");
      }
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "error" in error
          ? (error.error as string)
          : "Đã xảy ra lỗi";
      toast.error(errorMessage || "Đã xảy ra lỗi khi thêm chapter");
    }
  };

  // Xử lý cập nhật chapter
  const handleUpdateChapter = async (
    chapterData: ChapterCreateUpdate,
    files?: File[]
  ) => {
    if (!currentChapter) return;

    try {
      const response = await updateChapter(
        currentChapter.id,
        chapterData,
        files
      );

      if (response.status === 200) {
        toast.success("Cập nhật chapter thành công");
        fetchChapters(); // Tải lại danh sách
        setIsModalOpen(false);
      } else {
        toast.error(response.message || "Không thể cập nhật chapter");
      }
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "error" in error
          ? (error.error as string)
          : "Đã xảy ra lỗi";
      toast.error(errorMessage || "Đã xảy ra lỗi khi cập nhật chapter");
    }
  };

  // Xử lý xóa chapter
  const handleDeleteChapter = async () => {
    if (!currentChapter) return;

    try {
      const response = await deleteChapter(currentChapter.id);

      if (response.status === 200) {
        toast.success("Xóa chapter thành công");
        fetchChapters(); // Tải lại danh sách
        setIsDeleteModalOpen(false);
      } else {
        toast.error(response.message || "Không thể xóa chapter");
      }
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "error" in error
          ? (error.error as string)
          : "Đã xảy ra lỗi";
      toast.error(errorMessage || "Đã xảy ra lỗi khi xóa chapter");
    }
  };

  // Xử lý mở modal thêm chapter
  const handleOpenAddModal = () => {
    setCurrentChapter(null);
    setIsModalOpen(true);
  };

  // Xử lý mở modal sửa chapter
  const handleOpenEditModal = (chapter: ChapterResponse) => {
    setCurrentChapter(chapter);
    setIsModalOpen(true);
  };

  // Xử lý mở modal xóa chapter
  const handleOpenDeleteModal = (chapter: ChapterResponse) => {
    setCurrentChapter(chapter);
    setIsDeleteModalOpen(true);
  };

  // Xử lý mở modal xem chi tiết chapter
  const handleOpenViewModal = (chapter: ChapterResponse) => {
    setCurrentChapter(chapter);
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
    chapters,
    comics,
    currentPage,
    isLoading,
    searchTerm,
    error,
    isModalOpen,
    isDeleteModalOpen,
    currentChapter,
    statusFilter,
    comicFilter,
    totalPages,
    isViewModalOpen,

    // Actions
    setCurrentPage,
    setSearchTerm,
    setStatusFilter,
    setComicFilter,
    setIsModalOpen,
    setIsDeleteModalOpen,
    setIsViewModalOpen,
    handleOpenAddModal,
    handleOpenEditModal,
    handleOpenDeleteModal,
    handleOpenViewModal,
    handleSearch,
    handlePageChange,
    handleAddChapter,
    handleUpdateChapter,
    handleDeleteChapter,
  };
}; 