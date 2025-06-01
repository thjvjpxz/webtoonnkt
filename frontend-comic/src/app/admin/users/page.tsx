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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
        <div className="status-warning">
          VIP
        </div>
      );
    }
    return (
      <Badge variant="secondary" className="text-xs">
        Standard
      </Badge>
    );
  };

  // Hiển thị trạng thái kích hoạt
  const renderActiveStatus = (isActive: boolean) => {
    if (isActive) {
      return (
        <div className="status-success">
          <FiCheck className="mr-1" size={12} /> Đã kích hoạt
        </div>
      );
    }
    return (
      <div className="status-error">
        <FiX className="mr-1" size={12} /> Chưa kích hoạt
      </div>
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
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm người dùng..."
              className="pl-10 w-full sm:w-80 border-border focus:border-primary"
            />
            <FiSearch className="h-5 w-5 text-primary absolute left-3 top-2" />
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
                setCurrentPage(1);
              }}
              className="pl-10 pr-4 py-2 border border-border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground appearance-none cursor-pointer"
            >
              <option value="">Tất cả vai trò</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
            <FiUsers className="h-5 w-5 text-primary absolute left-3 top-2" />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground">
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
          onClick={handleOpenAddModal}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <FiPlus className="mr-2" size={18} />
          Thêm người dùng mới
        </Button>
      </div>

      {/* Hiển thị danh sách */}
      {isLoading ? (
        <Card className="shadow-medium border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </CardContent>
        </Card>
      ) : error ? (
        <Card className="shadow-medium border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-8 text-center flex flex-col items-center">
            <FiAlertCircle size={40} className="mb-2 text-destructive" />
            <p className="mb-4 text-destructive">{error}</p>
            <Button onClick={fetchUsers} className="bg-primary hover:bg-primary/90">
              Thử lại
            </Button>
          </CardContent>
        </Card>
      ) : users.length === 0 ? (
        <Card className="shadow-medium border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FiUser className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground">
              Không có người dùng nào
            </h3>
            <p className="text-muted-foreground mb-6">
              Chưa có người dùng nào được thêm vào hệ thống.
            </p>
            <Button
              onClick={handleOpenAddModal}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <FiPlus className="mr-2" size={18} />
              Thêm người dùng mới
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-medium border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="border-b border-border/50">
            <CardTitle className="text-foreground flex items-center gap-2">
              <FiUsers className="text-primary" size={20} />
              Danh sách người dùng
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-muted/30">
                    <TableHead className="font-semibold text-foreground text-center">
                      Người dùng
                    </TableHead>
                    <TableHead className="font-semibold text-foreground text-center">
                      Email
                    </TableHead>
                    <TableHead className="font-semibold text-foreground text-center">
                      Vai trò
                    </TableHead>
                    <TableHead className="font-semibold text-foreground text-center">
                      VIP
                    </TableHead>
                    <TableHead className="font-semibold text-foreground text-center">
                      Trạng thái
                    </TableHead>
                    <TableHead className="font-semibold text-foreground text-center">
                      Số dư
                    </TableHead>
                    <TableHead className="font-semibold text-foreground text-center">
                      Ngày tạo
                    </TableHead>
                    <TableHead className="font-semibold text-foreground text-center">
                      Thao tác
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow
                      key={user.id}
                      className="border-border/50 hover:bg-muted/20 transition-colors duration-200"
                    >
                      <TableCell className="py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 relative">
                            {user.imgUrl ? (
                              <Image
                                src={user.imgUrl}
                                alt={user.username}
                                fill
                                sizes="40px"
                                className="rounded-full object-cover shadow-soft border border-border/30"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground shadow-soft">
                                <FiUser size={16} />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-foreground">
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
                            <div className="text-xs text-muted-foreground">
                              Level: {user.level?.name || "N/A"}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center text-muted-foreground">
                        {user.email}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="status-info">
                          {user.role.name}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {renderVipStatus(user.vip)}
                      </TableCell>
                      <TableCell className="text-center">
                        {renderActiveStatus(user.active)}
                      </TableCell>
                      <TableCell className="text-center text-muted-foreground font-medium">
                        {formatCurrency(user.balance)}
                      </TableCell>
                      <TableCell className="text-center text-muted-foreground">
                        {formatDate(user.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEditModal(user)}
                            className="h-8 px-2 text-primary hover:bg-primary/10 hover:text-primary"
                            aria-label="Sửa"
                            title="Sửa"
                          >
                            <FiEdit size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDeleteModal(user)}
                            className="h-8 px-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                            aria-label="Xóa"
                            title="Xóa"
                          >
                            <FiTrash2 size={14} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Phân trang */}
            {!isLoading && !error && users.length > 0 && (
              <div className="p-4 border-t border-border/50">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </CardContent>
        </Card>
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
