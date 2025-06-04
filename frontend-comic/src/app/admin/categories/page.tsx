"use client";

import DashboardLayout from "@/components/admin/DashboardLayout";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiSearch,
  FiAlertCircle,
  FiTag,
} from "react-icons/fi";
import CategoryModal from "@/components/admin/categories/CategoryModal";
import DeleteCategoryModal from "@/components/admin/categories/DeleteCategoryModal";
import Pagination from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCategory } from "@/hooks/useCategory";
import { formatDate } from "@/utils/helpers";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function Categories() {
  const {
    categories,
    currentPage,
    totalPages,
    isLoading,
    searchTerm,
    error,
    isModalOpen,
    isDeleteModalOpen,
    currentCategory,

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
  } = useCategory();

  return (
    <DashboardLayout title="Quản lý thể loại">
      {/* Search and Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <form onSubmit={handleSearch} className="relative">
          <Input
            type="text"
            placeholder="Tìm kiếm thể loại..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full sm:w-80 border-border focus:border-primary"
          />
          <FiSearch className="h-5 w-5 text-primary absolute left-3 top-2" />
          <button type="submit" className="hidden">
            Tìm kiếm
          </button>
        </form>

        <Button
          variant="default"
          onClick={handleOpenAddModal}
          aria-label="Thêm thể loại mới"
          title="Thêm thể loại mới"
        >
          <FiPlus className="mr-2" size={18} />
          Thêm thể loại mới
        </Button>
      </div>

      {/* Categories Table */}
      <Card className="shadow-medium border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="border-b border-border/50">
          <CardTitle className="text-foreground flex items-center gap-2">
            <FiTag className="text-primary" size={20} />
            Danh sách thể loại
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
          ) : categories.length === 0 ? (
            <div className="p-12 text-center">
              <FiTag className="w-16 h-16 text-muted-foreground mb-4 mx-auto" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Không có thể loại nào
              </h3>
              <p className="text-muted-foreground mb-6">
                Chưa có thể loại nào được thêm vào hệ thống.
              </p>
              <Button
                onClick={handleOpenAddModal}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <FiPlus className="mr-2" size={18} />
                Thêm thể loại mới
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-muted/30">
                    <TableHead className="font-semibold text-foreground text-center">
                      Tên thể loại
                    </TableHead>
                    <TableHead className="font-semibold text-foreground text-center">
                      Mô tả
                    </TableHead>
                    <TableHead className="font-semibold text-foreground text-center">
                      Ngày tạo
                    </TableHead>
                    <TableHead className="font-semibold text-foreground text-center">
                      Ngày sửa
                    </TableHead>
                    <TableHead className="font-semibold text-foreground text-center">
                      Thao tác
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow
                      key={category.id}
                      className="border-border/50 hover:bg-muted/20 transition-colors duration-200"
                    >
                      <TableCell className="text-center py-4">
                        <div className="font-semibold text-foreground">
                          {category.name}
                        </div>
                      </TableCell>
                      <TableCell className="text-center py-4 text-muted-foreground max-w-xs">
                        <div className="truncate" title={category.description}>
                          {category.description || "Không có mô tả"}
                        </div>
                      </TableCell>
                      <TableCell className="text-center py-4 text-muted-foreground">
                        {formatDate(category.createdAt)}
                      </TableCell>
                      <TableCell className="text-center py-4 text-muted-foreground">
                        {formatDate(category.updatedAt)}
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEditModal(category)}
                            className="h-8 px-2 text-primary hover:bg-primary/10 hover:text-primary"
                            aria-label="Sửa thể loại"
                            title="Sửa"
                          >
                            <FiEdit size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDeleteModal(category)}
                            className="h-8 px-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                            aria-label="Xoá thể loại"
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
          )}

          {/* Pagination */}
          {!isLoading && !error && categories.length > 0 && (
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

      {/* Modal thêm/sửa thể loại */}
      {isModalOpen && (
        <CategoryModal
          category={currentCategory}
          onClose={handleCloseModal}
          onSave={currentCategory ? handleUpdateCategory : handleAddCategory}
        />
      )}

      {/* Modal xác nhận xóa */}
      {isDeleteModalOpen && currentCategory && (
        <DeleteCategoryModal
          categoryName={currentCategory.name}
          onClose={handleCloseDeleteModal}
          onConfirm={handleDeleteCategory}
        />
      )}
    </DashboardLayout>
  );
}
