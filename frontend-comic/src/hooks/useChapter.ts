import { Chapter, ChapterCreateUpdate } from "@/types/chapter";
import { createChapter, deleteChapter, getChapters, updateChapter } from "@/services/chapterService";
import { useCallback, useEffect, useState } from "react";
import { getComics } from "@/services/comicService";
import { ComicResponse } from "@/types/comic";
import toast from "react-hot-toast";

export const useChapter = (initialPage = 1, pageSize = 5) => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [comicOptions, setComicOptions] = useState<ComicResponse[]>([]);

  const [comicSearchTerm, setComicSearchTerm] = useState("");
  const [isComicDropdownOpen, setIsComicDropdownOpen] = useState(false);
  const [comicFilter, setComicFilter] = useState<string | null>(null);
  // Thêm state quản lý tìm kiếm combobox
  const [comicPage, setComicPage] = useState(1);
  const [comicsTotalPages, setComicsTotalPages] = useState(1);
  const [isLoadingComics, setIsLoadingComics] = useState(false);

  // Fetch chapters
  const fetchChapters = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getChapters(currentPage, pageSize, searchTerm, comicFilter || undefined);

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
  }, [currentPage, searchTerm, comicFilter, pageSize]);

  // Fetch comic options
  const fetchComicOptions = useCallback(async (
    page = 1,
    limit = 5,
    searchTerm = comicSearchTerm
  ) => {
    setIsLoadingComics(true);
    try {
      const response = await getComics(page, limit, searchTerm);
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
  }, [comicSearchTerm]);

  useEffect(() => {
    setComicPage(1);
    fetchComicOptions(1);
  }, [comicSearchTerm, fetchComicOptions]);

  useEffect(() => {
    fetchChapters();
  }, [fetchChapters]);

  // Xử lý xóa chương
  const handleDeleteChapter = async () => {
    try {

      const response = await deleteChapter(selectedChapter?.id || "");
      if (response.status === 200) {
        toast.success("Xóa chương thành công chương " + response.data?.chapterNumber + " của truyện " + response.data?.comicName);
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

  // Xử lý thêm hoặc cập nhật chương
  const handleSubmitChapter = async (
    chapterRequest: ChapterCreateUpdate,
    files: File[]
  ) => {
    try {
      let response;

      if (chapterRequest.id) {
        // Đang cập nhật chapter
        response = await updateChapter(chapterRequest.id, chapterRequest, files);
        if (response.status === 200) {
          toast.success("Cập nhật chương thành công");
          fetchChapters();
          setIsAddEditModalOpen(false);
        } else {
          toast.error("Cập nhật chương thất bại! " + response.message);
        }
      } else {
        // Đang thêm mới chapter
        response = await createChapter(chapterRequest, files);
        if (response.status === 200) {
          toast.success("Thêm chương thành công");
          fetchChapters();
          setIsAddEditModalOpen(false);
        } else {
          toast.error("Thêm chương thất bại! " + response.message);
        }
      }
    } catch (error: unknown) {
      const errorMessage = error && typeof error === "object" && "error" in error ? (error.error as string) : "Đã xảy ra lỗi";
      toast.error(chapterRequest.id ? "Cập nhật chương thất bại! " : "Thêm chương thất bại! " + errorMessage);
    }
  };

  // Xử lý trượt cuối dropdown để load more
  const handleComicDropdownScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const bottom = Math.floor(e.currentTarget.scrollHeight - e.currentTarget.scrollTop) === e.currentTarget.clientHeight;
    if (bottom && !isLoadingComics && comicPage < comicsTotalPages) {
      const nextPage = comicPage + 1;
      setComicPage(nextPage);
      fetchComicOptions(nextPage);
    }
  };

  // Xử lý tìm kiếm combobox
  const filteredComicOptions = comicOptions.filter(comic =>
    comic.name.toLowerCase().includes(comicSearchTerm.toLowerCase())
  );



  // Xử lý tìm kiếm
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  // Xử lý chọn truyện
  const handleSelectComic = (comicId: string) => {
    setComicFilter(comicId);
    setIsComicDropdownOpen(false);
    setCurrentPage(1);
  };

  // Xử lý mở modal xem chi tiết
  const handleOpenViewModal = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setIsViewModalOpen(true);
  };

  // Xử lý mở modal xóa
  const handleOpenDeleteModal = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setIsDeleteModalOpen(true);
  };

  // Xử lý mở modal thêm mới
  const handleOpenAddModal = () => {
    setSelectedChapter(null);
    setIsAddEditModalOpen(true);
  };

  // Xử lý mở modal chỉnh sửa
  const handleOpenEditModal = (chapter: Chapter) => {
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