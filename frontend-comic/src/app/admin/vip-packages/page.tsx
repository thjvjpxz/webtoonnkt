"use client";

import DashboardLayout from "@/components/admin/DashboardLayout";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiSearch,
  FiAlertCircle,
  FiPackage,
  FiToggleLeft,
  FiToggleRight,
  FiTrash,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import VipPackageModal from "@/components/admin/vip-packages/VipPackageModal";
import DeleteVipPackageModal from "@/components/admin/vip-packages/DeleteVipPackageModal";
import ViewVipPackageModal from "@/components/admin/vip-packages/ViewVipPackageModal";
import Pagination from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useVipPackage } from "@/hooks/useVipPackage";
import { formatDate } from "@/utils/helpers";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { VipPackage } from "@/types/vipPackage";
import Image from "next/image";

export default function VipPackages() {
  const {
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
  } = useVipPackage();

  // Hàm format giá tiền
  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN');
  };

  // Hàm tính giá sau giảm
  const calculateDiscountedPrice = (originalPrice: number, discountPercent: number) => {
    return originalPrice * (1 - discountPercent / 100);
  };

  // Hàm kiểm tra xem có đang trong thời gian giảm giá không
  const isInDiscountPeriod = (vipPackage: VipPackage) => {
    if (!vipPackage.discountStartDate ||
      !vipPackage.discountEndDate ||
      !vipPackage.discountedPrice ||
      vipPackage.discountedPrice <= 0) {
      return false;
    }

    const now = new Date();
    const startDate = new Date(vipPackage.discountStartDate);
    const endDate = new Date(vipPackage.discountEndDate);

    return now >= startDate && now <= endDate;
  };

  // Hàm hiển thị giá
  const renderPrice = (vipPackage: VipPackage) => {
    const hasDiscount = isInDiscountPeriod(vipPackage);

    if (hasDiscount) {
      const discountedPrice = calculateDiscountedPrice(vipPackage.originalPrice, vipPackage.discountedPrice);
      return (
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1 text-sm line-through text-muted-foreground">
            <Image
              src="/images/linh-thach.webp"
              alt="Linh thạch"
              width={14}
              height={14}
              className="flex-shrink-0"
            />
            <span>{formatPrice(vipPackage.originalPrice)}</span>
          </div>
          <div className="flex items-center justify-center gap-1 font-semibold text-green-600">
            <Image
              src="/images/linh-thach.webp"
              alt="Linh thạch"
              width={16}
              height={16}
              className="flex-shrink-0"
            />
            <span>{formatPrice(discountedPrice)}</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            -{vipPackage.discountedPrice}%
          </Badge>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center gap-1 font-semibold">
        <Image
          src="/images/linh-thach.webp"
          alt="Linh thạch"
          width={16}
          height={16}
          className="flex-shrink-0"
        />
        <span>{formatPrice(vipPackage.originalPrice)}</span>
      </div>
    );
  };

  return (
    <DashboardLayout title="Quản lý gói VIP">
      {/* Search, Filter and Add Button */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          {/* Search */}
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="text"
              placeholder="Tìm kiếm gói VIP..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-80 border-border focus:border-primary"
            />
            <FiSearch className="h-5 w-5 text-primary absolute left-3 top-2" />
            <button type="submit" className="hidden">
              Tìm kiếm
            </button>
          </form>

          {/* Status Filter */}
          <Select value={statusFilter?.toString() || "all"} onValueChange={(value) =>
            handleStatusFilterChange(value === "all" ? undefined : value === "true")
          }>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Lọc theo trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="true">Còn bán</SelectItem>
              <SelectItem value="false">Ngừng bán</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="default"
          onClick={handleOpenAddModal}
          aria-label="Thêm gói VIP mới"
          title="Thêm gói VIP mới"
        >
          <FiPlus className="mr-2" size={18} />
          Thêm gói VIP mới
        </Button>
      </div>

      {/* VIP Packages Table */}
      <Card className="shadow-medium border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="border-b border-border/50">
          <CardTitle className="text-foreground flex items-center gap-2">
            <FiPackage className="text-primary" size={20} />
            Danh sách gói VIP
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
                onClick={handleSearch}
                className="mt-4 bg-primary hover:bg-primary/90"
              >
                Thử lại
              </Button>
            </div>
          ) : vipPackages.length === 0 ? (
            <div className="p-12 text-center">
              <FiPackage className="w-16 h-16 text-muted-foreground mb-4 mx-auto" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Không có gói VIP nào
              </h3>
              <p className="text-muted-foreground mb-6">
                Chưa có gói VIP nào được thêm vào hệ thống.
              </p>
              <Button
                onClick={handleOpenAddModal}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <FiPlus className="mr-2" size={18} />
                Thêm gói VIP mới
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-muted/30">
                    <TableHead className="font-semibold text-foreground text-center min-w-[150px]">
                      Tên gói VIP
                    </TableHead>
                    <TableHead className="font-semibold text-foreground text-center min-w-[200px]">
                      Mô tả
                    </TableHead>
                    <TableHead className="font-semibold text-foreground text-center min-w-[120px]">
                      Giá
                    </TableHead>
                    <TableHead className="font-semibold text-foreground text-center">
                      Thời hạn
                    </TableHead>
                    <TableHead className="font-semibold text-foreground text-center">
                      Trạng thái
                    </TableHead>
                    <TableHead className="font-semibold text-foreground text-center">
                      Ngày tạo
                    </TableHead>
                    <TableHead className="font-semibold text-foreground text-center min-w-[200px]">
                      Thao tác
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vipPackages.map((vipPackage) => (
                    <TableRow
                      key={vipPackage.id}
                      className="border-border/50 hover:bg-muted/20 transition-colors duration-200"
                    >
                      <TableCell className="text-center py-4">
                        <div className="font-semibold text-foreground">
                          {vipPackage.name}
                        </div>
                      </TableCell>
                      <TableCell className="text-center py-4 text-muted-foreground max-w-xs">
                        <div className="truncate" title={vipPackage.description}>
                          {vipPackage.description || "Không có mô tả"}
                        </div>
                      </TableCell>
                      <TableCell className="text-center py-4">
                        {renderPrice(vipPackage)}
                      </TableCell>
                      <TableCell className="text-center py-4 text-muted-foreground">
                        {vipPackage.durationDays} ngày
                      </TableCell>
                      <TableCell className="text-center py-4">
                        <div className="flex items-center justify-center gap-2">
                          <Badge
                            variant={vipPackage.isActive ? "default" : "secondary"}
                            className={vipPackage.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                          >
                            {vipPackage.isActive ? (
                              <>
                                <FiEye className="w-3 h-3 mr-1" />
                                Còn bán
                              </>
                            ) : (
                              <>
                                <FiEyeOff className="w-3 h-3 mr-1" />
                                Ngừng bán
                              </>
                            )}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-center py-4 text-muted-foreground">
                        {formatDate(vipPackage.createdAt)}
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex justify-center gap-1 flex-wrap">
                          {
                            vipPackage.isActive && (
                              <>
                                {/* Edit */}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleOpenEditModal(vipPackage)}
                                  className="h-8 px-2 text-primary hover:bg-primary/10 hover:text-primary"
                                  aria-label="Sửa gói VIP"
                                  title="Sửa"
                                >
                                  <FiEdit size={14} />
                                </Button>

                                {/* Delete */}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleOpenDeleteModal(vipPackage)}
                                  className="h-8 px-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                  aria-label="Xóa gói VIP"
                                  title="Xóa"
                                >
                                  <FiTrash2 size={14} />
                                </Button>
                              </>
                            )
                          }

                          {
                            !vipPackage.isActive && (
                              <>
                                {/* Permanent Delete */}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleOpenPermanentDeleteModal(vipPackage)}
                                  className="h-8 px-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                  aria-label="Xóa vĩnh viễn gói VIP"
                                  title="Xóa vĩnh viễn"
                                >
                                  <FiTrash2 size={14} />
                                </Button></>
                            )
                          }
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {!isLoading && !error && vipPackages.length > 0 && (
            <div className="p-4 border-t border-border/50">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <VipPackageModal
          vipPackage={currentVipPackage}
          onClose={handleCloseModal}
          onSave={currentVipPackage ? handleUpdateVipPackage : handleAddVipPackage}
        />
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <DeleteVipPackageModal
          vipPackage={currentVipPackage}
          onClose={handleCloseDeleteModal}
          onConfirm={handleDeleteVipPackage}
          isPermanent={false}
        />
      )}

      {/* Permanent Delete Modal */}
      {isPermanentDeleteModalOpen && (
        <DeleteVipPackageModal
          vipPackage={currentVipPackage}
          onClose={handleClosePermanentDeleteModal}
          onConfirm={handlePermanentDeleteVipPackage}
          isPermanent={true}
        />
      )}

    </DashboardLayout>
  );
} 