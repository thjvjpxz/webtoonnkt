import { ChapterCreateUpdate, ChapterWithComicDetail } from "@/types/chapter";
import * as chapterService from "@/services/chapterService";
import * as publisherService from "@/services/publisherService";
import { useCallback, useEffect, useState } from "react";
import { ComicResponse } from "@/types/comic";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import { getComics } from "@/services/comicService";

export const useChapter = () => {
  const { user, isLoading: authLoading } = useAuth();
  const isPublisher = user?.role?.name === "PUBLISHER";

  const initialPage = 1;
  const pageSize = 5;

  const [chapters, setChapters] = useState<ChapterWithComicDetail[]>([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<ChapterWithComicDetail | null>(null);
  const [comicOptions, setComicOptions] = useState<ComicResponse[]>([]);

  const [comicSearchTerm, setComicSearchTerm] = useState("");
  const [isComicDropdownOpen, setIsComicDropdownOpen] = useState(false);
  const [comicFilter, setComicFilter] = useState<string | null>(null);
  // Thêm state quản lý tìm kiếm combobox
  const [comicPage, setComicPage] = useState(1);
  const [comicsTotalPages, setComicsTotalPages] = useState(1);
  const [isLoadingComics, setIsLoadingComics] = useState(false);

  const fetchChapters = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = isPublisher
        ? await publisherService.getChapters(currentPage, pageSize, searchTerm, comicFilter || undefined)
        : await chapterService.getChapters(currentPage, pageSize, searchTerm, comicFilter || undefined);

      if (response.status === 200 && response.data) {
        setTotalPages(response.totalPages || 1);
        setChapters(response.data);
      } else {
        setChapters([]);
        setError(response.message || "Không thể tải danh sách chương");
      }
    } catch (error: unknown) {
      const errorMessage = error && typeof error === "object" && "error" in error ? (error.error as string) : "Đã xảy ra lỗi";
      setError(errorMessage || "Đã xảy ra lỗi khi tải danh sách chương");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchTerm, comicFilter, pageSize, isPublisher]);

  /**
   * Hàm lấy danh sách truyện phân trang
   */
  const fetchComicOptions = useCallback(async (
    page = 1,
    limit = 5,
    searchTerm = comicSearchTerm
  ) => {
    setIsLoadingComics(true);
    try {
      const response = isPublisher
        ? await publisherService.getMyComics(page, limit, searchTerm)
        : await getComics(page, limit, searchTerm);
      if (response.status === 200 && response.data) {
        if (page === 1) {
          setComicOptions(response.data);
        } else {
          setComicOptions(prev => [...prev, ...response.data as ComicResponse[]]);
        }
        setComicsTotalPages(response.totalPages || 1);
      } else {
        if (page === 1) {
          setComicOptions([]);
        }
        toast.error(response.message || "Không thể tải danh sách truyện");
      }
    } catch (error: unknown) {
      const errorMessage = error && typeof error === "object" && "error" in error ? (error.error as string) : "Đã xảy ra lỗi";
      toast.error(errorMessage || "Đã xảy ra lỗi khi tải danh sách truyện");
      if (page === 1) {
        setComicOptions([]);
      }
    } finally {
      setIsLoadingComics(false);
    }
  }, [comicSearchTerm, isPublisher]);

  useEffect(() => {
    // Chỉ gọi API khi auth đã load xong
    if (!authLoading) {
      setComicPage(1);
      fetchComicOptions(1);
    }
  }, [comicSearchTerm, fetchComicOptions, authLoading]);

  useEffect(() => {
    if (!authLoading) {
      fetchChapters();
    }
  }, [fetchChapters, authLoading]);

  /**
   * Xử lý xóa chapter
   */
  const handleDeleteChapter = async () => {
    try {

      const response = isPublisher
        ? await publisherService.deleteChapter(selectedChapter!.id)
        : await chapterService.deleteChapter(selectedChapter!.id);
      if (response.status === 200 && response.data) {
        toast.success("Xóa chương thành công chương " + response.data.chapterNumber + " của truyện " + response.data.comicName);
        fetchChapters();
        setIsDeleteModalOpen(false);
      } else {
        toast.error("Xóa chương thất bại! " + response.message);
      }
    } catch (error: unknown) {
      const errorMessage = error && typeof error === "object" && "error" in error ? (error.error as string) : "Đã xảy ra lỗi";
      toast.error("Xóa chương thất bại! " + errorMessage);
    }
  };

  /**
   * Xử lý thêm hoặc cập nhật chapter
   * @param chapterRequest - ChapterCreateUpdate
   * @param files - File[]
   */
  const handleSubmitChapter = async (
    chapterRequest: ChapterCreateUpdate,
    files: File[]
  ) => {
    try {
      const isUpdate = !!chapterRequest.id;

      const response = isUpdate
        ? isPublisher
          ? await publisherService.updateChapter(chapterRequest.id!, chapterRequest, files)
          : await chapterService.updateChapter(chapterRequest.id!, chapterRequest, files)
        : isPublisher
          ? await publisherService.createChapter(chapterRequest, files)
          : await chapterService.createChapter(chapterRequest, files);

      if (response.status === 200) {
        const successMessage = isUpdate
          ? "Cập nhật chương thành công"
          : "Thêm chương thành công";

        toast.success(successMessage);
        fetchChapters();
        setIsAddEditModalOpen(false);
      } else {
        const errorMessage = isUpdate
          ? "Cập nhật chương thất bại! " + response.message
          : "Thêm chương thất bại! " + response.message;

        toast.error(errorMessage);
      }
    } catch {
      const actionText = chapterRequest.id ? "Cập nhật" : "Thêm";
      toast.error(`${actionText} chương thất bại!`);
    }
  };

  /**
   * Xử lý trượt cuối dropdown để load more
   * @param e - Sự kiện trượt
   */
  const handleComicDropdownScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const bottom = Math.floor(e.currentTarget.scrollHeight - e.currentTarget.scrollTop) === e.currentTarget.clientHeight;
    if (bottom && !isLoadingComics && comicPage < comicsTotalPages) {
      const nextPage = comicPage + 1;
      setComicPage(nextPage);
      fetchComicOptions(nextPage);
    }
  };

  /**
   * Xử lý tìm kiếm combobox
   */
  const filteredComicOptions = comicOptions.filter(comic =>
    comic.name.toLowerCase().includes(comicSearchTerm.toLowerCase())
  );



  /**
   * Xử lý tìm kiếm
   */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  /**
   * Xử lý chọn truyện
   */
  const handleSelectComic = (comicId: string) => {
    setComicFilter(comicId);
    setIsComicDropdownOpen(false);
    setCurrentPage(1);
  };

  /**
   * Xử lý mở modal xem chi tiết
   */
  const handleOpenViewModal = (chapter: ChapterWithComicDetail) => {
    setSelectedChapter(chapter);
    setIsViewModalOpen(true);
  };

  /**
   * Xử lý mở modal xóa
   */
  const handleOpenDeleteModal = (chapter: ChapterWithComicDetail) => {
    setSelectedChapter(chapter);
    setIsDeleteModalOpen(true);
  };

  /**
   * Xử lý mở modal thêm mới
   */
  const handleOpenAddModal = () => {
    setSelectedChapter(null);
    setIsAddEditModalOpen(true);
  };

  /**
   * Xử lý mở modal chỉnh sửa
   */
  const handleOpenEditModal = (chapter: ChapterWithComicDetail) => {
    setSelectedChapter(chapter);
    setIsAddEditModalOpen(true);
  };

  return {
    chapters,
    currentPage,
    totalPages,
    error,
    searchTerm,
    isLoading,
    isPublisher,

    // set
    setCurrentPage,
    setSearchTerm,
    setComicFilter,
    setComicSearchTerm,
    setIsComicDropdownOpen,

    // handle
    handleOpenViewModal,
    handleOpenDeleteModal,
    handleOpenAddModal,
    handleOpenEditModal,
    handleSearch,
    handleDeleteChapter,
    handleSubmitChapter,

    // modal
    isViewModalOpen,
    isDeleteModalOpen,
    isAddEditModalOpen,
    setIsViewModalOpen,
    setIsDeleteModalOpen,
    setIsAddEditModalOpen,

    // selected
    selectedChapter,

    // comicOptions
    comicOptions,
    comicSearchTerm,
    isComicDropdownOpen,
    comicFilter,
    handleSelectComic,
    filteredComicOptions,
    isLoadingComics,
    handleComicDropdownScroll,
    fetchComicOptions,
  }
}