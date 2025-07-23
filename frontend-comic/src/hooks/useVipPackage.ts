import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import {
  getAllVipPackages,
  createVipPackage,
  updateVipPackage,
  deleteVipPackage,
  permanentDeleteVipPackage,
} from "@/services/vipPackageService";
import { VipPackage, VipPackageCreateUpdate } from "@/types/vipPackage";

export const useVipPackage = (initialPage = 1, pageSize = 5) => {
  // State cho danh sách gói VIP và phân trang
  const [vipPackages, setVipPackages] = useState<VipPackage[]>([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<boolean | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  // State cho modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPermanentDeleteModalOpen, setIsPermanentDeleteModalOpen] = useState(false);
  const [currentVipPackage, setCurrentVipPackage] = useState<VipPackage | null>(null);

  // Lấy danh sách gói VIP từ API
  const fetchVipPackages = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getAllVipPackages(currentPage, pageSize, searchTerm, statusFilter);

      if (response.status === 200 && response.data) {
        setVipPackages(response.data);
        setTotalPages(response.totalPages || 1);
      } else {
        setVipPackages([]);
        setError(response.message || "Không thể tải danh sách gói VIP");
        toast.error(response.message || "Không thể tải danh sách gói VIP");
      }
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "error" in error
          ? (error.error as string)
          : "Đã xảy ra lỗi";
      setError(errorMessage || "Đã xảy ra lỗi khi tải danh sách gói VIP");
      toast.error(errorMessage || "Đã xảy ra lỗi khi tải danh sách gói VIP");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, searchTerm, statusFilter]);

  // Xử lý thêm gói VIP mới
  const handleAddVipPackage = async (vipPackageData: VipPackageCreateUpdate) => {
    try {
      const response = await createVipPackage(vipPackageData);

      if (response.status === 200) {
        toast.success("Thêm gói VIP thành công");
        fetchVipPackages(); // Tải lại danh sách
        setIsModalOpen(false);
      } else {
        toast.error(response.message || "Không thể thêm gói VIP");
        setIsModalOpen(false);
      }
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "error" in error
          ? (error.error as string)
          : "Đã xảy ra lỗi";
      toast.error(errorMessage || "Đã xảy ra lỗi khi thêm gói VIP");
      setIsModalOpen(false);
    }
  };

  // Xử lý cập nhật gói VIP
  const handleUpdateVipPackage = async (vipPackageData: VipPackageCreateUpdate) => {
    if (!currentVipPackage) return false;

    try {
      const response = await updateVipPackage(currentVipPackage.id, vipPackageData);

      if (response.status === 200) {
        toast.success("Cập nhật gói VIP thành công");
        fetchVipPackages(); // Tải lại danh sách
        setIsModalOpen(false);
      } else {
        toast.error(response.message || "Không thể cập nhật gói VIP");
        setIsModalOpen(false);
      }
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "error" in error
          ? (error.error as string)
          : "Đã xảy ra lỗi";
      toast.error(errorMessage || "Đã xảy ra lỗi khi cập nhật gói VIP");
      setIsModalOpen(false);
    }
  };

  // Xử lý xóa tạm thời gói VIP (soft delete)
  const handleDeleteVipPackage = async () => {
    if (!currentVipPackage) return false;

    try {
      const response = await deleteVipPackage(currentVipPackage.id);

      if (response.status === 200) {
        toast.success("Xóa gói VIP thành công");
        fetchVipPackages(); // Tải lại danh sách
        setIsDeleteModalOpen(false);
      } else {
        toast.error(response.message || "Không thể xóa gói VIP");
        setIsDeleteModalOpen(false);
      }
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "error" in error
          ? (error.error as string)
          : "Đã xảy ra lỗi";
      toast.error(errorMessage || "Đã xảy ra lỗi khi xóa gói VIP");
      setIsDeleteModalOpen(false);
    }
  };

  // Xử lý xóa vĩnh viễn gói VIP (permanent delete)
  const handlePermanentDeleteVipPackage = async () => {
    if (!currentVipPackage) return false;

    try {
      const response = await permanentDeleteVipPackage(currentVipPackage.id);

      if (response.status === 200) {
        toast.success("Xóa vĩnh viễn gói VIP thành công");
        fetchVipPackages(); // Tải lại danh sách
        setIsPermanentDeleteModalOpen(false);
      } else {
        toast.error(response.message || "Không thể xóa vĩnh viễn gói VIP");
      }
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "error" in error
          ? (error.error as string)
          : "Đã xảy ra lỗi";
      toast.error(errorMessage || "Đã xảy ra lỗi khi xóa vĩnh viễn gói VIP");
      setIsPermanentDeleteModalOpen(false);
    }
  };

  // Modal actions
  const handleOpenAddModal = () => {
    setCurrentVipPackage(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (vipPackage: VipPackage) => {
    setCurrentVipPackage(vipPackage);
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (vipPackage: VipPackage) => {
    setCurrentVipPackage(vipPackage);
    setIsDeleteModalOpen(true);
  };

  const handleOpenPermanentDeleteModal = (vipPackage: VipPackage) => {
    setCurrentVipPackage(vipPackage);
    setIsPermanentDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleClosePermanentDeleteModal = () => {
    setIsPermanentDeleteModalOpen(false);
  };

  // Xử lý tìm kiếm
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset về trang đầu khi tìm kiếm
    fetchVipPackages();
  };

  // Xử lý thay đổi filter trạng thái
  const handleStatusFilterChange = (status: boolean | undefined) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset về trang đầu khi filter
  };

  // Gọi API khi thay đổi trang hoặc tìm kiếm
  useEffect(() => {
    fetchVipPackages();
  }, [fetchVipPackages]);

  return {
    // State
    vipPackages,
    currentPage,
    totalPages,
    isLoading,
    searchTerm,
    statusFilter,
    error,
    isModalOpen,
    isDeleteModalOpen,
    isPermanentDeleteModalOpen,
    currentVipPackage,

    // Actions
    setCurrentPage,
    setSearchTerm,
    handleOpenAddModal,
    handleOpenEditModal,
    handleOpenDeleteModal,
    handleOpenPermanentDeleteModal,
    handleCloseModal,
    handleCloseDeleteModal,
    handleClosePermanentDeleteModal,
    handleAddVipPackage,
    handleUpdateVipPackage,
    handleDeleteVipPackage,
    handlePermanentDeleteVipPackage,
    handleSearch,
    handleStatusFilterChange,
    fetchVipPackages,
  };
}; 