import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import {
  getAllLevels,
  createLevel,
  updateLevel,
  deleteLevel,
} from "@/services/levelService";
import {
  getAllLevelTypes,
  createLevelType,
  updateLevelType,
  deleteLevelType,
} from "@/services/levelTypeService";
import {
  LevelResponse,
  LevelRequest,
  LevelTypeResponse,
  LevelTypeRequest,
} from "@/types/level";

export const useLevel = (initialPage = 1, pageSize = 5) => {
  // Trạng thái chung
  const [activeTab, setActiveTab] = useState<"level" | "levelType">("level");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Trạng thái cho Level
  const [levels, setLevels] = useState<LevelResponse[]>([]);
  const [levelCurrentPage, setLevelCurrentPage] = useState(initialPage);
  const [levelTotalPages, setLevelTotalPages] = useState(1);
  const [levelSearchTerm, setLevelSearchTerm] = useState("");
  const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);
  const [currentLevel, setCurrentLevel] = useState<LevelResponse | null>(null);

  // Trạng thái cho Level Type (không có phân trang)
  const [levelTypes, setLevelTypes] = useState<LevelTypeResponse[]>([]);
  const [levelTypeSearchTerm, setLevelTypeSearchTerm] = useState("");
  const [isLevelTypeModalOpen, setIsLevelTypeModalOpen] = useState(false);
  const [currentLevelType, setCurrentLevelType] = useState<LevelTypeResponse | null>(null);
  const [filteredLevelTypes, setFilteredLevelTypes] = useState<LevelTypeResponse[]>([]);

  // Trạng thái modal xóa
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteItemType, setDeleteItemType] = useState<"level" | "level-type">("level");
  const [deleteItemName, setDeleteItemName] = useState("");
  const [deleteItemId, setDeleteItemId] = useState("");

  // Lấy danh sách Level từ API
  const fetchLevels = useCallback(async () => {
    if (activeTab !== "level") return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await getAllLevels(levelCurrentPage, pageSize, levelSearchTerm);

      if (response.status === 200 && response.data) {
        setLevels(response.data);
        setLevelTotalPages(response.totalPages || 1);
      } else {
        setLevels([]);
        setError(response.message || "Không thể tải danh sách level");
        toast.error(response.message || "Không thể tải danh sách level");
      }
    } catch (error: unknown) {
      const errorMessage = error && typeof error === "object" && "message" in error ? (error.message as string) : "Đã xảy ra lỗi khi tải danh sách level";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, levelCurrentPage, levelSearchTerm, pageSize]);

  // Lấy danh sách Level Type từ API (không phân trang)
  const fetchLevelTypes = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getAllLevelTypes();

      if (response.status === 200 && response.data) {
        setLevelTypes(response.data);
        // Lọc level type theo từ khóa tìm kiếm nếu đang ở tab levelType
        if (activeTab === "levelType") {
          filterLevelTypes(response.data, levelTypeSearchTerm);
        }
      } else {
        setLevelTypes([]);
        if (activeTab === "levelType") {
          setError(response.message || "Không thể tải danh sách loại level");
          toast.error(response.message || "Không thể tải danh sách loại level");
        }
      }
    } catch (error: unknown) {
      if (activeTab === "levelType") {
        const errorMessage = error && typeof error === "object" && "message" in error ? (error.message as string) : "Đã xảy ra lỗi khi tải danh sách loại level";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, levelTypeSearchTerm]);

  // Hàm lọc level type theo từ khóa tìm kiếm
  const filterLevelTypes = (types: LevelTypeResponse[], searchTerm: string) => {
    if (!searchTerm.trim()) {
      setFilteredLevelTypes(types);
      return;
    }

    const filtered = types.filter((type) =>
      type.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLevelTypes(filtered);
  };

  // Cập nhật lọc khi thay đổi từ khóa tìm kiếm
  useEffect(() => {
    if (activeTab === "levelType") {
      filterLevelTypes(levelTypes, levelTypeSearchTerm);
    }
  }, [levelTypeSearchTerm, activeTab, levelTypes]);

  // Gọi API khi thay đổi tab, trang hoặc tìm kiếm Level
  useEffect(() => {
    if (activeTab === "level") {
      fetchLevels();
    } else {
      fetchLevelTypes();
    }
  }, [activeTab, levelCurrentPage, fetchLevels, fetchLevelTypes]);

  // Xử lý thêm Level Type mới
  const handleAddLevelType = async (data: LevelTypeRequest) => {
    try {
      const response = await createLevelType(data);

      if (response.status === 200) {
        toast.success("Thêm loại level thành công");
        fetchLevelTypes(); // Tải lại danh sách
        setIsLevelTypeModalOpen(false);
      } else {
        toast.error(response.message || "Không thể thêm loại level");
      }
    } catch (error: unknown) {
      toast.error(error && typeof error === "object" && "error" in error ? (error.error as string) : "Đã xảy ra lỗi khi thêm loại level");
      setIsLevelTypeModalOpen(false);
    }
  };

  // Xử lý cập nhật Level Type
  const handleUpdateLevelType = async (data: LevelTypeRequest) => {
    if (!currentLevelType) return;

    try {
      const response = await updateLevelType(currentLevelType.id, data);

      if (response.status === 200) {
        toast.success("Cập nhật loại level thành công");
        fetchLevelTypes(); // Tải lại danh sách
        setIsLevelTypeModalOpen(false);
      } else {
        toast.error(response.message || "Không thể cập nhật loại level");
      }
    } catch (error: unknown) {
      toast.error(error && typeof error === "object" && "error" in error ? (error.error as string) : "Đã xảy ra lỗi khi cập nhật loại level");
      setIsLevelTypeModalOpen(false);
    }
  };

  // Xử lý thêm Level mới
  const handleAddLevel = async (data: LevelRequest, file?: File) => {
    try {
      const response = await createLevel(data, file);

      if (response.status === 200) {
        toast.success("Thêm level thành công");
        fetchLevels(); // Tải lại danh sách
        setIsLevelModalOpen(false);
      } else {
        toast.error(response.message || "Không thể thêm level");
      }
    } catch (error: unknown) {
      toast.error(error && typeof error === "object" && "error" in error ? (error.error as string) : "Đã xảy ra lỗi khi thêm level");
      setIsLevelModalOpen(false);
    }
  };

  // Xử lý cập nhật Level
  const handleUpdateLevel = async (data: LevelRequest, file?: File) => {
    if (!currentLevel) return;

    try {
      const response = await updateLevel(currentLevel.id, data, file);

      if (response.status === 200) {
        toast.success("Cập nhật level thành công");
        fetchLevels(); // Tải lại danh sách
      } else {
        toast.error(response.message || "Không thể cập nhật level");
      }
      setIsLevelModalOpen(false);
    } catch (error: unknown) {
      toast.error(error && typeof error === "object" && "error" in error ? (error.error as string) : "Đã xảy ra lỗi khi cập nhật level");
      setIsLevelModalOpen(false);
    }
  };

  // Xử lý xóa item (Level hoặc Level Type)
  const handleDelete = async () => {
    try {
      let response;

      if (deleteItemType === "level") {
        response = await deleteLevel(deleteItemId);
      } else {
        response = await deleteLevelType(deleteItemId);
      }

      if (response.status === 200) {
        toast.success(`Xóa ${deleteItemType === "level" ? "level" : "loại level"} thành công`);
        if (deleteItemType === "level") {
          fetchLevels();
        } else {
          fetchLevelTypes();
        }
      } else {
        toast.error(response.message || `Không thể xóa ${deleteItemType === "level" ? "level" : "loại level"}`);
      }
      setIsDeleteModalOpen(false);
    } catch (error: unknown) {
      toast.error(error && typeof error === "object" && "error" in error ? (error.error as string) : `Đã xảy ra lỗi khi xóa ${deleteItemType === "level" ? "level" : "loại level"}`);
      setIsDeleteModalOpen(false);
    }
  };

  // Xử lý mở modal thêm Level mới
  const handleOpenAddLevelModal = () => {
    setCurrentLevel(null);
    setIsLevelModalOpen(true);
  };

  // Xử lý mở modal thêm Level Type mới
  const handleOpenAddLevelTypeModal = () => {
    setCurrentLevelType(null);
    setIsLevelTypeModalOpen(true);
  };

  // Xử lý mở modal sửa Level
  const handleOpenEditLevelModal = (level: LevelResponse) => {
    setCurrentLevel(level);
    setIsLevelModalOpen(true);
  };

  // Xử lý mở modal sửa Level Type
  const handleOpenEditLevelTypeModal = (levelType: LevelTypeResponse) => {
    setCurrentLevelType(levelType);
    setIsLevelTypeModalOpen(true);
  };

  // Xử lý mở modal xác nhận xóa Level
  const handleOpenDeleteLevelModal = (level: LevelResponse) => {
    setDeleteItemType("level");
    setDeleteItemName(level.name);
    setDeleteItemId(level.id);
    setIsDeleteModalOpen(true);
  };

  // Xử lý mở modal xác nhận xóa Level Type
  const handleOpenDeleteLevelTypeModal = (levelType: LevelTypeResponse) => {
    setDeleteItemType("level-type");
    setDeleteItemName(levelType.name);
    setDeleteItemId(levelType.id);
    setIsDeleteModalOpen(true);
  };

  // Xử lý tìm kiếm Level
  const handleLevelSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLevelCurrentPage(1); // Reset về trang 1 khi tìm kiếm
  };

  // Xử lý tìm kiếm Level Type (lọc client-side)
  const handleLevelTypeSearch = (e: React.FormEvent) => {
    e.preventDefault();
    filterLevelTypes(levelTypes, levelTypeSearchTerm);
  };

  // Xử lý submit form cho Level hay Level Type
  const handleSubmitLevelType = (data: LevelTypeRequest) => {
    if (currentLevelType) {
      handleUpdateLevelType(data);
    } else {
      handleAddLevelType(data);
    }
  };

  const handleSubmitLevel = (data: LevelRequest, file?: File) => {
    if (currentLevel) {
      handleUpdateLevel(data, file);
    } else {
      handleAddLevel(data, file);
    }
  };

  return {
    // Trạng thái chung
    activeTab,
    setActiveTab,
    isLoading,
    error,

    // Trạng thái level
    levels,
    levelCurrentPage,
    setLevelCurrentPage,
    levelTotalPages,
    levelSearchTerm,
    setLevelSearchTerm,
    setIsLevelModalOpen,

    // Trạng thái level type
    levelTypes,
    filteredLevelTypes,
    levelTypeSearchTerm,
    setLevelTypeSearchTerm,
    setIsLevelTypeModalOpen,

    // Modal states
    isLevelModalOpen,
    isLevelTypeModalOpen,
    isDeleteModalOpen,
    currentLevel,
    currentLevelType,
    deleteItemType,
    deleteItemName,
    setIsDeleteModalOpen,

    // Xử lý API
    fetchLevels,
    fetchLevelTypes,

    // Xử lý hành động
    handleLevelSearch,
    handleLevelTypeSearch,
    handleOpenAddLevelModal,
    handleOpenEditLevelModal,
    handleOpenDeleteLevelModal,
    handleOpenAddLevelTypeModal,
    handleOpenEditLevelTypeModal,
    handleOpenDeleteLevelTypeModal,
    handleSubmitLevel,
    handleSubmitLevelType,
    handleDelete,
  };
} 