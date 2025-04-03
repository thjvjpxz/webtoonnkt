"use client";

import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiSearch,
  FiAlertCircle,
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import "@/styles/scrollbar.css";
import Pagination from "@/components/dashboard/Pagination";
import DeleteConfirmModal from "@/components/dashboard/levels/DeleteConfirmModal";
import LevelModal from "@/components/dashboard/levels/LevelModal";
import LevelTypeModal from "@/components/dashboard/levels/LevelTypeModal";
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

export default function Levels() {
  // Trạng thái chung
  const [activeTab, setActiveTab] = useState<"level" | "levelType">("level");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Trạng thái cho Level
  const [levels, setLevels] = useState<LevelResponse[]>([]);
  const [levelCurrentPage, setLevelCurrentPage] = useState(1);
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
      const response = await getAllLevels(levelCurrentPage, 10, levelSearchTerm);

      if (response.status === 200 && response.data) {
        setLevels(response.data);
        setLevelTotalPages(response.totalPages || 1);
      } else {
        setLevels([]);
        setError(response.message || "Không thể tải danh sách level");
        toast.error(response.message || "Không thể tải danh sách level");
      }
    } catch (error: any) {
      const errorMessage = error?.message || "Đã xảy ra lỗi khi tải danh sách level";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, levelCurrentPage, levelSearchTerm]);

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
    } catch (error: any) {
      if (activeTab === "levelType") {
        const errorMessage = error?.message || "Đã xảy ra lỗi khi tải danh sách loại level";
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
  }, [levelTypeSearchTerm, activeTab]);

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
    } catch (error: any) {
      toast.error(error?.message || "Đã xảy ra lỗi khi thêm loại level");
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
    } catch (error: any) {
      toast.error(error?.message || "Đã xảy ra lỗi khi cập nhật loại level");
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
    } catch (error: any) {
      toast.error(error?.message || "Đã xảy ra lỗi khi thêm level");
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
        setIsLevelModalOpen(false);
      } else {
        toast.error(response.message || "Không thể cập nhật level");
      }
    } catch (error: any) {
      toast.error(error?.message || "Đã xảy ra lỗi khi cập nhật level");
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
        setIsDeleteModalOpen(false);
      } else {
        toast.error(response.message || `Không thể xóa ${deleteItemType === "level" ? "level" : "loại level"}`);
      }
    } catch (error: any) {
      toast.error(error?.message || `Đã xảy ra lỗi khi xóa ${deleteItemType === "level" ? "level" : "loại level"}`);
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

  return (
    <DashboardLayout title="Quản lý Level và Loại Level">
      <div className="mb-6">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            className={`py-2 px-4 font-medium text-sm ${activeTab === "level"
              ? "border-b-2 border-green-500 text-green-600 dark:text-green-400"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            onClick={() => setActiveTab("level")}
          >
            Quản lý Level
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm ${activeTab === "levelType"
              ? "border-b-2 border-green-500 text-green-600 dark:text-green-400"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            onClick={() => setActiveTab("levelType")}
          >
            Quản lý Loại Level
          </button>
        </div>
      </div>

      {/* Tab Level */}
      {activeTab === "level" && (
        <>
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <form onSubmit={handleLevelSearch} className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm level..."
                value={levelSearchTerm}
                onChange={(e) => setLevelSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-green-200 rounded-lg w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              />
              <FiSearch className="h-5 w-5 text-green-400 absolute left-3 top-2.5 dark:text-green-500" />
              <button type="submit" className="hidden">
                Tìm kiếm
              </button>
            </form>

            <button
              onClick={handleOpenAddLevelModal}
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 dark:bg-green-700 dark:hover:bg-green-600 cursor-pointer"
            >
              <FiPlus size={18} />
              <span>Thêm level mới</span>
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-green-100 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 border-b border-green-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Danh sách level
              </h2>
            </div>

            {isLoading ? (
              <div className="p-8 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              </div>
            ) : error ? (
              <div className="p-8 text-center text-rose-500 flex flex-col items-center">
                <FiAlertCircle size={40} className="mb-2" />
                <p>{error}</p>
                <button
                  onClick={fetchLevels}
                  className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer"
                >
                  Thử lại
                </button>
              </div>
            ) : levels.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                Không tìm thấy level nào
              </div>
            ) : (
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full">
                  <thead className="bg-green-50 dark:bg-green-900/30">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider dark:text-green-400">
                        Tên level
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-green-700 uppercase tracking-wider dark:text-green-400">
                        Loại
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-green-700 uppercase tracking-wider dark:text-green-400">
                        Số level
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-green-700 uppercase tracking-wider dark:text-green-400">
                        Điểm KN
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-green-700 uppercase tracking-wider dark:text-green-400">
                        Màu sắc
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-green-700 uppercase tracking-wider dark:text-green-400">
                        Hình ảnh
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-green-700 uppercase tracking-wider dark:text-green-400">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-green-100 dark:divide-gray-700">
                    {levels.map((level) => (
                      <tr
                        key={level.id}
                        className="hover:bg-green-50/50 dark:hover:bg-green-900/10"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-800 dark:text-gray-200">
                            {level.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="text-gray-800 dark:text-gray-200">
                            {level.levelType.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="text-gray-800 dark:text-gray-200">
                            {level.levelNumber}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="text-gray-800 dark:text-gray-200">
                            {level.expRequired.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex justify-center">
                            <div
                              className="w-6 h-6 rounded-full"
                              style={{ backgroundColor: level.color }}
                              title={level.color}
                            ></div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex justify-center">
                            {level.urlGif ? (
                              <img
                                src={level.urlGif}
                                alt={level.name}
                                className="w-10 h-10 object-cover rounded"
                              />
                            ) : (
                              <span className="text-gray-400">Không có</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => handleOpenEditLevelModal(level)}
                              className="p-1.5 bg-amber-50 text-amber-600 rounded-md hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-500 dark:hover:bg-amber-900/50 cursor-pointer"
                              title="Sửa"
                            >
                              <FiEdit size={16} />
                            </button>
                            <button
                              onClick={() => handleOpenDeleteLevelModal(level)}
                              className="p-1.5 bg-rose-50 text-rose-600 rounded-md hover:bg-rose-100 dark:bg-rose-900/30 dark:text-rose-500 dark:hover:bg-rose-900/50 cursor-pointer"
                              title="Xóa"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Phân trang cho Level */}
            {!isLoading && !error && levels.length > 0 && (
              <div className="p-4 border-t border-green-100 dark:border-gray-700">
                <Pagination
                  currentPage={levelCurrentPage}
                  totalPages={levelTotalPages}
                  onPageChange={setLevelCurrentPage}
                />
              </div>
            )}
          </div>
        </>
      )}

      {/* Tab Level Type */}
      {activeTab === "levelType" && (
        <>
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <form onSubmit={handleLevelTypeSearch} className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm loại level..."
                value={levelTypeSearchTerm}
                onChange={(e) => setLevelTypeSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-green-200 rounded-lg w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              />
              <FiSearch className="h-5 w-5 text-green-400 absolute left-3 top-2.5 dark:text-green-500" />
              <button type="submit" className="hidden">
                Tìm kiếm
              </button>
            </form>

            <button
              onClick={handleOpenAddLevelTypeModal}
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 dark:bg-green-700 dark:hover:bg-green-600 cursor-pointer"
            >
              <FiPlus size={18} />
              <span>Thêm loại level mới</span>
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-green-100 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 border-b border-green-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Danh sách loại level
              </h2>
            </div>

            {isLoading ? (
              <div className="p-8 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              </div>
            ) : error ? (
              <div className="p-8 text-center text-rose-500 flex flex-col items-center">
                <FiAlertCircle size={40} className="mb-2" />
                <p>{error}</p>
                <button
                  onClick={fetchLevelTypes}
                  className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer"
                >
                  Thử lại
                </button>
              </div>
            ) : filteredLevelTypes.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                Không tìm thấy loại level nào
              </div>
            ) : (
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full">
                  <thead className="bg-green-50 dark:bg-green-900/30">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider dark:text-green-400">
                        Tên loại level
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-green-700 uppercase tracking-wider dark:text-green-400">
                        Ngày tạo
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-green-700 uppercase tracking-wider dark:text-green-400">
                        Ngày cập nhật
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-green-700 uppercase tracking-wider dark:text-green-400">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-green-100 dark:divide-gray-700">
                    {filteredLevelTypes.map((levelType) => (
                      <tr
                        key={levelType.id}
                        className="hover:bg-green-50/50 dark:hover:bg-green-900/10"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-800 dark:text-gray-200">
                            {levelType.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="text-gray-600 dark:text-gray-400">
                            {new Date(levelType.createdAt).toLocaleDateString('vi-VN', {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="text-gray-600 dark:text-gray-400">
                            {new Date(levelType.updatedAt).toLocaleDateString('vi-VN', {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => handleOpenEditLevelTypeModal(levelType)}
                              className="p-1.5 bg-amber-50 text-amber-600 rounded-md hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-500 dark:hover:bg-amber-900/50 cursor-pointer"
                              title="Sửa"
                            >
                              <FiEdit size={16} />
                            </button>
                            <button
                              onClick={() => handleOpenDeleteLevelTypeModal(levelType)}
                              className="p-1.5 bg-rose-50 text-rose-600 rounded-md hover:bg-rose-100 dark:bg-rose-900/30 dark:text-rose-500 dark:hover:bg-rose-900/50 cursor-pointer"
                              title="Xóa"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* Modal thêm/sửa Level */}
      {isLevelModalOpen && (
        <LevelModal
          isOpen={isLevelModalOpen}
          onClose={() => setIsLevelModalOpen(false)}
          onSubmit={handleSubmitLevel}
          level={currentLevel}
          levelTypes={levelTypes}
        />
      )}

      {/* Modal thêm/sửa Level Type */}
      {isLevelTypeModalOpen && (
        <LevelTypeModal
          isOpen={isLevelTypeModalOpen}
          onClose={() => setIsLevelTypeModalOpen(false)}
          onSubmit={handleSubmitLevelType}
          levelType={currentLevelType}
        />
      )}

      {/* Modal xác nhận xóa */}
      {isDeleteModalOpen && (
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
          itemName={deleteItemName}
          itemType={deleteItemType}
        />
      )}
    </DashboardLayout>
  );
}