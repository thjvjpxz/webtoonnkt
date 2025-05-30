"use client";

import DashboardLayout from "@/components/admin/DashboardLayout";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiSearch,
  FiAlertCircle,
  FiUser,
  FiCheck,
  FiX,
  FiUsers,
} from "react-icons/fi";
import Pagination from "@/components/admin/Pagination";
import { formatDate } from "@/utils/helpers";
import Button from "@/components/ui/Button";
import Image from "next/image";
import { useUser } from "@/hooks/useUser";
import UserModal from "@/components/admin/users/UserModal";
import DeleteUserModal from "@/components/admin/users/DeleteUserModal";

export default function Users() {
  const {
    users,
    roles,
    levelTypes,
    levels,
    currentPage,
    totalPages,
    isLoading,
    searchTerm,
    roleFilter,
    error,
    isModalOpen,
    isDeleteModalOpen,
    currentUser,
    isDeleting,
    isLoadingLevels,

    setCurrentPage,
    setSearchTerm,
    setRoleFilter,
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
    fetchUsers,
    fetchLevelsByType,
  } = useUser();

  // Hiển thị VIP
  const renderVipStatus = (isVip: boolean) => {
    if (isVip) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
          VIP
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
        Standard
      </span>
    );
  };

  // Hiển thị trạng thái kích hoạt
  const renderActiveStatus = (isActive: boolean) => {
    if (isActive) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
          <FiCheck className="mr-1" size={12} /> Đã kích hoạt
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400">
        <FiX className="mr-1" size={12} /> Chưa kích hoạt
      </span>
    );
  };

  // Format số dư thành tiền VND
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <DashboardLayout title="Quản lý người dùng">
      {/* Search and Add Button */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm người dùng..."
              className="pl-10 pr-4 py-2 border border-green-200 rounded-lg w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            />
            <FiSearch className="h-5 w-5 text-green-400 absolute left-3 top-2.5 dark:text-green-500" />
            <button type="submit" className="hidden">
              Tìm kiếm
            </button>
          </form>

          {/* Role Filter */}
          <div className="relative w-full sm:w-80">
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1); // Reset lại trang khi đổi bộ lọc
              }}
              className="pl-10 pr-4 py-2 border border-green-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 appearance-none cursor-pointer"
            >
              <option value="">Tất cả vai trò</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
            <FiUsers className="h-5 w-5 text-green-400 absolute left-3 top-2.5 dark:text-green-500" />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </div>
          </div>
        </div>

        <Button
          variant="success"
          onClick={handleOpenAddModal}
          icon={<FiPlus size={18} />}
          size="md"
        >
          <span>Thêm người dùng mới</span>
        </Button>
      </div>

      {/* Hiển thị danh sách */}
      {isLoading ? (
        <div className="bg-white rounded-xl shadow-sm p-8 flex justify-center border border-green-100 dark:bg-gray-800 dark:border-gray-700">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      ) : error ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-rose-500 flex flex-col items-center border border-green-100 dark:bg-gray-800 dark:border-gray-700">
          <FiAlertCircle size={40} className="mb-2" />
          <p className="mb-4">{error}</p>
          <Button variant="success" onClick={fetchUsers}>
            Thử lại
          </Button>
        </div>
      ) : users.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700">
          <div className="flex flex-col items-center justify-center py-12">
            <FiUser className="w-16 h-16 text-gray-300 mb-4 dark:text-gray-600" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-300">
              Không có người dùng nào
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Chưa có người dùng nào được thêm vào hệ thống.
            </p>
            <button
              onClick={handleOpenAddModal}
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 dark:bg-green-700 dark:hover:bg-green-600 cursor-pointer"
            >
              <FiPlus size={18} />
              <span>Thêm người dùng mới</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-green-100 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 border-b border-green-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Danh sách người dùng
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-green-50 dark:bg-green-900/30">
                <tr>
                  <th className="px-6 py-3 text-center text-xs font-medium text-green-700 uppercase tracking-wider dark:text-green-400">
                    Người dùng
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-green-700 uppercase tracking-wider dark:text-green-400">
                    Email
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-green-700 uppercase tracking-wider dark:text-green-400">
                    Vai trò
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-green-700 uppercase tracking-wider dark:text-green-400">
                    VIP
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-green-700 uppercase tracking-wider dark:text-green-400">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-green-700 uppercase tracking-wider dark:text-green-400">
                    Số dư
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-green-700 uppercase tracking-wider dark:text-green-400">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-green-700 uppercase tracking-wider dark:text-green-400">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 relative">
                          {user.imgUrl ? (
                            <Image
                              src={user.imgUrl}
                              alt={user.username}
                              fill
                              sizes="40px"
                              className="rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                              <FiUser size={16} />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            <span
                              style={{
                                color:
                                  user.level?.levelNumber === 1
                                    ? user.level?.urlGif
                                    : "transparent",
                                backgroundImage:
                                  user.level?.levelNumber !== 1
                                    ? `url(${user.level?.urlGif})`
                                    : "none",
                                backgroundSize:
                                  user.level?.levelNumber !== 1
                                    ? "auto"
                                    : "none",
                                backgroundPosition:
                                  user.level?.levelNumber !== 1
                                    ? "center"
                                    : "none",
                                WebkitBackgroundClip:
                                  user.level?.levelNumber !== 1
                                    ? "text"
                                    : "none",
                              }}
                            >
                              {user.username}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Level: {user.level?.name || "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500 dark:text-gray-400">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500 dark:text-gray-400">
                      <span className="px-2 py-1 text-xs rounded-md bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                        {user.role.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      {renderVipStatus(user.vip)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      {renderActiveStatus(user.active)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500 dark:text-gray-400">
                      {formatCurrency(user.balance)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500 dark:text-gray-400">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      <div className="flex justify-center space-x-2">
                        <Button
                          variant="edit"
                          onClick={() => handleOpenEditModal(user)}
                          aria-label="Sửa"
                          title="Sửa"
                          icon={<FiEdit size={18} />}
                          size="xs"
                        />
                        <Button
                          variant="delete"
                          onClick={() => handleOpenDeleteModal(user)}
                          aria-label="Xóa"
                          title="Xóa"
                          icon={<FiTrash2 size={18} />}
                          size="xs"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Phân trang */}
          {!isLoading && !error && users.length > 0 && (
            <div className="p-4 border-t border-green-100 dark:border-gray-700">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {isModalOpen && (
        <UserModal
          user={currentUser}
          roles={roles}
          levelTypes={levelTypes}
          levels={levels}
          isLoadingLevels={isLoadingLevels}
          fetchLevelsByType={fetchLevelsByType}
          onClose={() => setIsModalOpen(false)}
          onSave={currentUser ? handleUpdateUser : handleAddUser}
        />
      )}

      {isDeleteModalOpen && currentUser && (
        <DeleteUserModal
          username={currentUser.username}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteUser}
          isDeleting={isDeleting}
        />
      )}
    </DashboardLayout>
  );
}
