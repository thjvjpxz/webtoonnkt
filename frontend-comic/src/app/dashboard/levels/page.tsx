"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiSearch,
  FiAlertCircle,
} from "react-icons/fi";
import "@/styles/scrollbar.css";
import Pagination from "@/components/dashboard/Pagination";
import LevelModal from "@/components/dashboard/levels/LevelModal";
import LevelTypeModal from "@/components/dashboard/levels/LevelTypeModal";
import { formatDate } from "@/utils/helpers";
import { useLevel } from "@/hooks/useLevel";
import DeleteLevelModal from "@/components/dashboard/levels/DeleteLevelModal";
import Button from "@/components/ui/Button";
import Image from "next/image";

export default function Levels() {
  const {
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
  } = useLevel();

  return (
    <DashboardLayout title="Quản lý Level và Loại Level">
      <div className="mb-6">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            className={`py-2 px-4 font-medium text-sm ${activeTab === "level"
              ? "border-b-2 border-green-500 text-green-600 dark:text-green-400"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              } cursor-pointer`}
            onClick={() => setActiveTab("level")}
          >
            Quản lý Level
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm ${activeTab === "levelType"
              ? "border-b-2 border-green-500 text-green-600 dark:text-green-400"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              } cursor-pointer`}
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

            <Button
              variant="success"
              onClick={handleOpenAddLevelModal}
              aria-label="Thêm level mới"
              title="Thêm level mới"
              icon={<FiPlus size={18} />}
              size="md"
            >
              <span>Thêm level mới</span>
            </Button>
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
                <Button
                  onClick={fetchLevels}
                  variant="success"
                  className="mt-4"
                >
                  Thử lại
                </Button>
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
                          <div className="font-medium text-gray-800 dark:text-gray-200"
                            style={{
                              color: level.levelNumber === 1 ? level.urlGif : "transparent",
                              backgroundImage: level.levelNumber !== 1 ? `url(${level.urlGif})` : "none",
                              backgroundSize: level.levelNumber !== 1 ? "auto" : "none",
                              backgroundPosition: level.levelNumber !== 1 ? "center" : "none",
                              WebkitBackgroundClip: level.levelNumber !== 1 ? "text" : "none",
                            }}
                          >
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
                              style={{ background: level.color }}
                            ></div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex justify-center">
                            {level.urlGif && level.levelNumber !== 1 ? (
                              <Image
                                src={level.urlGif}
                                alt={level.name}
                                width={40}
                                height={40}
                                loading="lazy"
                                className="object-cover rounded !h-10"
                              />
                            ) : level.levelNumber === 1 ? (
                              <div
                                className="w-10 h-10 rounded"
                                style={{
                                  backgroundColor: level.urlGif,
                                }}
                              ></div>
                            ) : (
                              <span className="text-gray-400">Không có</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex justify-center space-x-2">
                            <Button
                              variant="edit"
                              size="xs"
                              icon={<FiEdit size={18} />}
                              onClick={() => handleOpenEditLevelModal(level)}
                              title="Sửa"
                            />
                            <Button
                              variant="delete"
                              size="xs"
                              icon={<FiTrash2 size={18} />}
                              onClick={() => handleOpenDeleteLevelModal(level)}
                              title="Xóa"
                            />
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

            <Button
              variant="success"
              onClick={handleOpenAddLevelTypeModal}
              aria-label="Thêm loại level mới"
              title="Thêm loại level mới"
              icon={<FiPlus size={18} />}
              size="md"
            >
              <span>Thêm loại level mới</span>
            </Button>
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
                <Button
                  variant="success"
                  onClick={fetchLevelTypes}
                  className="mt-4"
                >
                  Thử lại
                </Button>
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
                          <div className="text-gray-800 dark:text-gray-200">
                            {formatDate(levelType.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="text-gray-800 dark:text-gray-200">
                            {formatDate(levelType.updatedAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex justify-center space-x-2">
                            <Button
                              variant="edit"
                              size="xs"
                              icon={<FiEdit size={18} />}
                              onClick={() => handleOpenEditLevelTypeModal(levelType)}
                              title="Sửa"
                            />
                            <Button
                              variant="delete"
                              size="xs"
                              icon={<FiTrash2 size={18} />}
                              onClick={() => handleOpenDeleteLevelTypeModal(levelType)}
                              title="Xóa"
                            />
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
          levelTypes={levelTypes}
          level={currentLevel}
        />
      )}

      {/* Modal thêm/sửa Loại Level */}
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
        <DeleteLevelModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
          itemType={deleteItemType}
          itemName={deleteItemName}
        />
      )}
    </DashboardLayout>
  );
}