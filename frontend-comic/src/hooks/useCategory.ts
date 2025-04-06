import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} from "@/services/categoryService";
import { CategoryResponse, CategoryCreateUpdate } from "@/types/category";

export const useCategory = (initialPage = 1, pageSize = 5) => {
    // State cho danh sách thể loại và phân trang
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState<string | null>(null);

    // State cho modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState<CategoryResponse | null>(null);

    // Lấy danh sách thể loại từ API
    const fetchCategories = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await getCategories(currentPage, pageSize, searchTerm);

            if (response.status == 200 && response.data) {
                setCategories(response.data);
                setTotalPages(response.totalPages || 1);
            } else {
                setCategories([]);
                setError(response.message || "Không thể tải danh sách thể loại");
                toast.error(response.message || "Không thể tải danh sách thể loại");
            }
        } catch (error: unknown) {
            const errorMessage =
                error && typeof error === "object" && "error" in error
                    ? (error.error as string)
                    : "Đã xảy ra lỗi";
            setError(errorMessage || "Đã xảy ra lỗi khi tải danh sách thể loại");
            toast.error(errorMessage || "Đã xảy ra lỗi khi tải danh sách thể loại");
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, pageSize, searchTerm]);

    // Xử lý thêm thể loại mới
    const handleAddCategory = async (categoryData: CategoryCreateUpdate) => {
        try {
            const response = await createCategory(categoryData);

            if (response.status == 200) {
                toast.success("Thêm thể loại thành công");
                fetchCategories(); // Tải lại danh sách
                setIsModalOpen(false);
            } else {
                toast.error(response.message || "Không thể thêm thể loại");
            }
        } catch (error: any) {
            toast.error(error?.error || "Đã xảy ra lỗi khi thêm thể loại");
            setIsModalOpen(false);
        }
    };

    // Xử lý cập nhật thể loại
    const handleUpdateCategory = async (categoryData: CategoryCreateUpdate) => {
        if (!currentCategory) return false;

        try {
            const response = await updateCategory(currentCategory.id, categoryData);

            if (response.status == 200) {
                toast.success("Cập nhật thể loại thành công");
                fetchCategories(); // Tải lại danh sách
                setIsModalOpen(false);
            } else {
                toast.error(response.message || "Không thể cập nhật thể loại");
            }
        } catch (error: any) {
            toast.error(error?.error || "Đã xảy ra lỗi khi cập nhật thể loại");
            setIsModalOpen(false);
        }
    };

    // Xử lý xóa thể loại
    const handleDeleteCategory = async () => {
        if (!currentCategory) return false;

        try {
            const response = await deleteCategory(currentCategory.id);

            if (response.status == 200) {
                toast.success("Xóa thể loại thành công");
                fetchCategories(); // Tải lại danh sách
                setIsDeleteModalOpen(false);
            } else {
                toast.error(response.message || "Không thể xóa thể loại");
            }
        } catch (error: any) {
            toast.error(error?.error || "Đã xảy ra lỗi khi xóa thể loại");
            setIsDeleteModalOpen(false);
        }
    };

    // Modal actions
    const handleOpenAddModal = () => {
        setCurrentCategory(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (category: CategoryResponse) => {
        setCurrentCategory(category);
        setIsModalOpen(true);
    };

    const handleOpenDeleteModal = (category: CategoryResponse) => {
        setCurrentCategory(category);
        setIsDeleteModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };

    // Xử lý tìm kiếm
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1); // Reset về trang đầu khi tìm kiếm
        fetchCategories();
    };

    // Gọi API khi thay đổi trang hoặc tìm kiếm
    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    return {
        // State
        categories,
        currentPage,
        totalPages,
        isLoading,
        searchTerm,
        error,
        isModalOpen,
        isDeleteModalOpen,
        currentCategory,

        // Actions
        setCurrentPage,
        setSearchTerm,
        handleOpenAddModal,
        handleOpenEditModal,
        handleOpenDeleteModal,
        handleCloseModal,
        handleCloseDeleteModal,
        handleAddCategory,
        handleUpdateCategory,
        handleDeleteCategory,
        handleSearch,
        fetchCategories,
    };
}; 