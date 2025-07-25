"use client";

import DashboardLayout from "@/components/admin/DashboardLayout";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiSearch,
  FiAlertCircle,
  FiUser,
  FiUsers,
  FiShield,
  FiShieldOff,
  FiTrash,
} from "react-icons/fi";
import Pagination from "@/components/ui/pagination";
import { formatDate } from "@/utils/helpers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import { useUser } from "@/hooks/useUser";
import UserModal from "@/components/admin/users/UserModal";
import DeleteUserModal from "@/components/admin/users/DeleteUserModal";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { formatRole } from "@/utils/string";
import UserName from "@/components/ui/UserName";
import { chooseImageUrl } from "@/utils/string";

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
  } = useUser();

  // Hiển thị VIP với hiệu ứng đẹp
  const renderVipStatus = (isVip: boolean) => {
    if (isVip) {
      return (
        <Badge
          className="text-xs bg-yellow-500 text-white border-0 shadow-md hover:shadow-lg hover:bg-yellow-600 transition-all duration-300 hover:scale-105 font-medium"
        >
          VIP
        </Badge>
      );
    }
    return (
      <Badge
        className="text-xs bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200 transition-all duration-200 hover:scale-105"
      >
        Không
      </Badge>
    );
  };

  // Hiển thị trạng thái kích hoạt với hiệu ứng
  const renderActiveStatus = (isActive: boolean) => {
    if (isActive) {
      return (
        <Badge
          variant="default"
          className="text-xs bg-emerald-500 text-white border-0 shadow-md hover:shadow-lg hover:bg-emerald-600 transition-all duration-300 hover:scale-105 font-medium"
        >
          Đã kích hoạt
        </Badge>
      );
    }
    return (
      <Badge
        className="text-xs bg-yellow-500 text-white border-0 shadow-md hover:shadow-lg hover:bg-yellow-600 transition-all duration-300 hover:scale-105 font-medium"
      >
        Chưa kích hoạt
      </Badge>
    );
  };

  const renderBlockStatus = (isBlocked: boolean) => {
    if (isBlocked) {
      return (
        <Badge
          className="text-xs bg-red-500 text-white border-0 shadow-md hover:shadow-lg hover:bg-red-600 transition-all duration-300 hover:scale-105 font-medium"
        >
          Đã khóa
        </Badge>
      );
    }
    return (
      <Badge
        className="text-xs bg-emerald-500 text-white border-0 shadow-md hover:shadow-lg hover:bg-emerald-600 transition-all duration-300 hover:scale-105 font-medium"
      >
        Bình thường
      </Badge>
    );
  };

  // Hiển thị trạng thái đã xóa
  const renderDeletedStatus = (isDeleted: boolean) => {
    if (isDeleted) {
      return (
        <Badge
          className="text-xs bg-gray-500 text-white border-0 shadow-md hover:shadow-lg hover:bg-gray-600 transition-all duration-300 hover:scale-105 font-medium"
        >
          Đã xóa
        </Badge>
      );
    }
    return (
      <Badge
        className="text-xs bg-emerald-500 text-white border-0 shadow-md hover:shadow-lg hover:bg-emerald-600 transition-all duration-300 hover:scale-105 font-medium"
      >
        Bình thường
      </Badge>
    );
  };

  // Hiển thị vai trò với màu sắc và icon đẹp
  const renderRole = (role: string) => {
    if (role === "ADMIN") {
      return (
        <Badge
          variant="default"
          className="text-xs bg-purple-600 text-white border-0 shadow-md hover:shadow-lg hover:bg-purple-700 transition-all duration-300 hover:scale-105 font-medium"
        >
          Quản trị viên
        </Badge>
      )
    } else if (role === "READER") {
      return (
        <Badge
          variant="secondary"
          className="text-xs bg-blue-500 text-white border-0 shadow-md hover:shadow-lg hover:bg-blue-600 transition-all duration-300 hover:scale-105 font-medium"
        >
          Độc giả
        </Badge>
      )
    } else if (role === "PUBLISHER") {
      return (
        <Badge
          variant="destructive"
          className="text-xs bg-orange-500 text-white border-0 shadow-md hover:shadow-lg hover:bg-orange-600 transition-all duration-300 hover:scale-105 font-medium"
        >
          Nhà xuất bản
        </Badge>
      )
    }
    return (
      <Badge
        variant="outline"
        className="text-xs border-gray-300 text-gray-600 hover:bg-gray-50 transition-all duration-200"
      >
        {role}
      </Badge>
    );
  }

  // Hàm format số dư với icon linh thạch
  const formatBalance = (balance: number) => {
    return balance.toLocaleString('vi-VN');
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
          <div className="w-full sm:w-60">
            <Select
              value={roleFilter || "all"}
              onValueChange={(value) => {
                setRoleFilter(value === "all" ? "" : value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full">
                <div className="flex items-center">
                  <FiUsers className="h-4 w-4 mr-2 text-primary" />
                  <SelectValue placeholder="Tất cả vai trò" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả vai trò</SelectItem>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {formatRole(role.name)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
      <Card className="shadow-medium border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="border-b border-border/50">
          <CardTitle className="flex items-center gap-2 justify-between w-full">
            <div className="flex items-center gap-2">
              <FiUsers className="text-primary" size={20} />
              {showDeleted ? "Danh sách người dùng đã xóa" : "Danh sách người dùng"}
            </div>
            {/* Toggle hiển thị người dùng đã xóa */}
            <div className="flex items-center text-sm py-2 justify-cente gap-4">
              <div className="flex items-center gap-3 flex-1">
                <FiTrash className={`h-4 w-4 flex-shrink-0 text-muted-foreground`} />
                <Label
                  htmlFor="show-deleted-toggle"
                  className={`text-sm cursor-pointer text-foreground`}
                >
                  {showDeleted ? "Danh sách người dùng" : "Danh sách người dùng đã xóa"}
                </Label>
              </div>
              <Switch
                id="show-deleted-toggle"
                checked={showDeleted}
                onCheckedChange={(checked: boolean) => {
                  setShowDeleted(checked);
                  setCurrentPage(1);
                }}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="p-8 text-center flex flex-col items-center">
              <FiAlertCircle size={40} className="mb-2 text-destructive" />
              <p className="text-destructive">{error}</p>
              <Button
                onClick={fetchUsers}
                className="mt-4 bg-primary hover:bg-primary/90"
              >
                Thử lại
              </Button>
            </div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center">
              <FiUser className="w-16 h-16 text-muted-foreground mb-4 mx-auto" />
              <h3 className="text-lg font-medium text-foreground mb-2">
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
            </div>
          ) : (
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
                      {showDeleted ? "Ngày xóa" : "Ngày sửa"}
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
                      {/* Avatar */}
                      <TableCell className="py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 relative">
                            {user.imgUrl ? (
                              <Image
                                src={chooseImageUrl(user.imgUrl)}
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
                              <UserName
                                username={user.username}
                                level={user.level}
                                showLevel={false}
                                className="text-sm font-medium text-foreground"
                              />
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Level: {user.level?.name || "N/A"}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Email */}
                      <TableCell className="text-center text-muted-foreground">
                        {user.email}
                      </TableCell>

                      {/* Vai trò */}
                      <TableCell className="text-center">
                        {renderRole(user.role.name)}
                      </TableCell>

                      {/* VIP */}
                      <TableCell className="text-center">
                        {renderVipStatus(user.vip)}
                      </TableCell>

                      {/* Trạng thái */}
                      <TableCell className="text-center">
                        {showDeleted
                          ? renderDeletedStatus(user.deleted)
                          : user.blocked
                            ? renderBlockStatus(user.blocked)
                            : renderActiveStatus(user.active)
                        }
                      </TableCell>

                      {/* Số dư */}
                      <TableCell className="text-center py-4">
                        <div className="flex items-center justify-center gap-1 font-medium">
                          <Image
                            src="/images/linh-thach.webp"
                            alt="Linh thạch"
                            width={16}
                            height={16}
                            className="flex-shrink-0"
                          />
                          <span>{formatBalance(user.balance)}</span>
                        </div>
                      </TableCell>

                      {/* Ngày tạo */}
                      <TableCell className="text-center text-muted-foreground">
                        {formatDate(user.createdAt)}
                      </TableCell>

                      {/* Ngày cập nhật */}
                      <TableCell className="text-center text-muted-foreground">
                        {formatDate(user.updatedAt)}
                      </TableCell>

                      {/* Thao tác */}
                      <TableCell>
                        <div className="flex justify-center gap-1">
                          {/* Chỉ hiển thị actions cho người dùng chưa bị xóa */}
                          {!showDeleted && !user.deleted && (
                            <>
                              {/* Nút Block/Unblock */}
                              {user.blocked ? (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleUnblockUser(user)}
                                  className="h-8 px-2 text-green-600 hover:bg-green-100 hover:text-green-700"
                                  aria-label="Bỏ chặn"
                                  title="Bỏ chặn người dùng"
                                >
                                  <FiShieldOff size={14} />
                                </Button>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleBlockUser(user)}
                                  className="h-8 px-2 text-yellow-600 hover:bg-yellow-100 hover:text-yellow-700"
                                  aria-label="Chặn"
                                  title="Chặn người dùng"
                                >
                                  <FiShield size={14} />
                                </Button>
                              )}
                              {/* Nút Sửa */}
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

                              {/* Nút Xóa */}
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
                            </>
                          )}

                          {/* Hiển thị thông báo cho người dùng đã xóa */}
                          {(showDeleted && user.deleted) && (
                            <div className="text-xs text-muted-foreground italic">
                              Không thể thao tác
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

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

      {/* Modals */}
      <UserModal
        user={currentUser}
        roles={roles}
        levelTypes={levelTypes}
        levels={levels}
        isLoadingLevels={isLoadingLevels}
        isOpen={isModalOpen}
        fetchLevelsByType={fetchLevelsByType}
        onClose={() => setIsModalOpen(false)}
        onSave={currentUser ? handleUpdateUser : handleAddUser}
      />

      {
        isDeleteModalOpen && currentUser && (
          <DeleteUserModal
            username={currentUser.username}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteUser}
            isDeleting={isDeleting}
          />
        )
      }
    </DashboardLayout >
  );
}
