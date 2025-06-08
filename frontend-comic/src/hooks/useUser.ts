import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { UserResponse, UserCreateUpdate, Role } from "@/types/user";
import { LevelTypeResponse, LevelResponse } from "@/types/level";
import {
  getUsers,
  getRoles,
  createUserWithAvatar,
  updateUserWithAvatar,
  deleteUser,
  blockUser,
  unblockUser,
  getAllLevelTypes,
  getLevelsByTypeId,
} from "@/services/userService";

export const useUser = (initialPage = 1, pageSize = 5) => {
  // State cho danh sách người dùng và phân trang
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [levelTypes, setLevelTypes] = useState<LevelTypeResponse[]>([]);
  const [levels, setLevels] = useState<LevelResponse[]>([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [showDeleted, setShowDeleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State cho modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserResponse | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoadingLevels, setIsLoadingLevels] = useState(false);

  // Lấy danh sách vai trò
  const fetchRoles = useCallback(async () => {
    try {
      const response = await getRoles();

      if (response.status === 200 && response.data) {
        setRoles(response.data);
      } else {
        toast.error(response.message || "Không thể tải danh sách vai trò");
      }
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "error" in error
          ? (error.error as string)
          : "Đã xảy ra lỗi";
      toast.error(errorMessage || "Đã xảy ra lỗi khi tải danh sách vai trò");
    }
  }, []);

  // Lấy danh sách loại level
  const fetchLevelTypes = useCallback(async () => {
    try {
      const response = await getAllLevelTypes();
      if (response.status === 200 && response.data) {
        setLevelTypes(response.data);
      } else {
        toast.error(response.message || "Không thể tải danh sách loại level");
      }
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "error" in error
          ? (error.error as string)
          : "Đã xảy ra lỗi";
      toast.error(errorMessage || "Đã xảy ra lỗi khi tải danh sách loại level");
    }
  }, []);

  // Lấy danh sách level theo type ID
  const fetchLevelsByType = useCallback(async (levelTypeId: string) => {
    if (!levelTypeId) {
      setLevels([]);
      return;
    }
    setIsLoadingLevels(true);
    try {
      const response = await getLevelsByTypeId(levelTypeId);
      if (response.status === 200 && response.data) {
        setLevels(response.data);
      } else {
        setLevels([]);
        toast.error(response.message || "Không thể tải danh sách level");
      }
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "error" in error
          ? (error.error as string)
          : "Đã xảy ra lỗi";
      toast.error(errorMessage || "Đã xảy ra lỗi khi tải danh sách level");
    } finally {
      setIsLoadingLevels(false);
    }
  }, []);

  // Lấy danh sách người dùng từ API
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getUsers(
        currentPage,
        pageSize,
        searchTerm,
        roleFilter,
        showDeleted
      );

      if (response.status === 200 && response.data) {
        setUsers(response.data);
        setTotalPages(response.totalPages || 1);
      } else {
        setUsers([]);
        setError(response.message || "Không thể tải danh sách người dùng");
        toast.error(response.message || "Không thể tải danh sách người dùng");
      }
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "error" in error
          ? (error.error as string)
          : "Đã xảy ra lỗi";
      setError(errorMessage || "Đã xảy ra lỗi khi tải danh sách người dùng");
      toast.error(errorMessage || "Đã xảy ra lỗi khi tải danh sách người dùng");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchTerm, roleFilter, showDeleted, pageSize]);

  // Gọi API khi thay đổi trang hoặc tìm kiếm
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Lấy danh sách vai trò và loại level khi component mount
  useEffect(() => {
    fetchRoles();
    fetchLevelTypes();
  }, [fetchRoles, fetchLevelTypes]);

  // Xử lý thêm người dùng mới
  const handleAddUser = async (userData: UserCreateUpdate, file?: File) => {
    try {
      const response = await createUserWithAvatar(userData, file);

      if (response.status === 200) {
        toast.success("Thêm người dùng thành công");
        fetchUsers(); // Tải lại danh sách
        setIsModalOpen(false);
      } else {
        toast.error(response.message || "Không thể thêm người dùng");
      }
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "error" in error
          ? (error.error as string)
          : "Đã xảy ra lỗi";
      toast.error(errorMessage || "Đã xảy ra lỗi khi thêm người dùng");
    }
  };

  // Xử lý cập nhật người dùng
  const handleUpdateUser = async (
    userData: UserCreateUpdate,
    file?: File
  ) => {
    if (!currentUser) return;

    try {
      const response = await updateUserWithAvatar(
        currentUser.id,
        userData,
        file
      );

      if (response.status === 200) {
        toast.success("Cập nhật người dùng thành công");
        fetchUsers(); // Tải lại danh sách
        setIsModalOpen(false);
      } else {
        toast.error(response.message || "Không thể cập nhật người dùng");
      }
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "error" in error
          ? (error.error as string)
          : "Đã xảy ra lỗi";
      toast.error(errorMessage || "Đã xảy ra lỗi khi cập nhật người dùng");
    }
  };

  // Xử lý xóa người dùng
  const handleDeleteUser = async () => {
    if (!currentUser) return;

    setIsDeleting(true);
    try {
      const response = await deleteUser(currentUser.id);

      if (response.status === 200) {
        toast.success("Xóa người dùng thành công");
        fetchUsers(); // Tải lại danh sách
        setIsDeleteModalOpen(false);
      } else {
        toast.error(response.message || "Không thể xóa người dùng");
      }
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "error" in error
          ? (error.error as string)
          : "Đã xảy ra lỗi";
      toast.error(errorMessage || "Đã xảy ra lỗi khi xóa người dùng");
    } finally {
      setIsDeleting(false);
    }
  };

  // Xử lý chặn người dùng
  const handleBlockUser = async (user: UserResponse) => {
    try {
      const response = await blockUser(user.id);

      if (response.status === 200) {
        toast.success("Chặn người dùng thành công");
        fetchUsers(); // Tải lại danh sách
      } else {
        toast.error(response.message || "Không thể chặn người dùng");
      }
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "error" in error
          ? (error.error as string)
          : "Đã xảy ra lỗi";
      toast.error(errorMessage || "Đã xảy ra lỗi khi chặn người dùng");
    }
  };

  // Xử lý bỏ chặn người dùng
  const handleUnblockUser = async (user: UserResponse) => {
    try {
      const response = await unblockUser(user.id);

      if (response.status === 200) {
        toast.success("Bỏ chặn người dùng thành công");
        fetchUsers(); // Tải lại danh sách
      } else {
        toast.error(response.message || "Không thể bỏ chặn người dùng");
      }
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === "object" && "error" in error
          ? (error.error as string)
          : "Đã xảy ra lỗi";
      toast.error(errorMessage || "Đã xảy ra lỗi khi bỏ chặn người dùng");
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

  // Xử lý mở modal thêm mới
  const handleOpenAddModal = () => {
    setCurrentUser(null);
    setLevels([]);
    setIsModalOpen(true);
  };

  // Xử lý mở modal edit
  const handleOpenEditModal = (user: UserResponse) => {
    setCurrentUser(user);
    if (user.level?.levelType?.id) {
      fetchLevelsByType(user.level.levelType.id);
    }
    setIsModalOpen(true);
  };

  // Xử lý mở modal xóa
  const handleOpenDeleteModal = (user: UserResponse) => {
    setCurrentUser(user);
    setIsDeleteModalOpen(true);
  };

  return {
    users,
    roles,
    levelTypes,
    levels,
    currentPage,
    totalPages,
    isLoading,
    searchTerm,
    roleFilter,
    showDeleted,
    error,
    isModalOpen,
    isDeleteModalOpen,
    currentUser,
    isDeleting,
    isLoadingLevels,

    setCurrentPage,
    setSearchTerm,
    setRoleFilter,
    setShowDeleted,
    setIsModalOpen,
    setIsDeleteModalOpen,

    handleSearch,
    handlePageChange,
    handleOpenAddModal,
    handleOpenEditModal,
    handleOpenDeleteModal,
    handleAddUser,
    handleUpdateUser,
    handleDeleteUser,
    handleBlockUser,
    handleUnblockUser,
    fetchUsers,
    fetchLevelsByType,
  };
}; 