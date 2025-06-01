"use client";

import ComicModal from "@/components/admin/comics/ComicModal";
import DeleteComicModal from "@/components/admin/comics/DeleteComicModal";
import ViewComic from "@/components/admin/comics/ViewComic";
import DashboardLayout from "@/components/admin/DashboardLayout";
import Pagination from "@/components/admin/Pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useComic } from "@/hooks/useComic";
import Image from "next/image";
import {
  FiAlertCircle,
  FiEdit,
  FiEye,
  FiFilter,
  FiPlus,
  FiSearch,
  FiTrash2,
  FiBook,
} from "react-icons/fi";
import { formatDate } from "@/utils/helpers";

export default function Comics() {
  const {
    categories,
    comics,
    currentPage,
    isLoading,
    searchTerm,
    error,
    statusFilter,
    categoryFilter,
    isModalOpen,
    isDeleteModalOpen,
    currentComic,
    totalPages,
    isViewModalOpen,
    isDeleting,

    setSearchTerm,
    setStatusFilter,
    setCategoryFilter,
    setCurrentPage,
    setIsModalOpen,
    setIsDeleteModalOpen,
    setIsViewModalOpen,
    handleSearch,
    handleOpenAddModal,
    handleOpenEditModal,
    handleOpenDeleteModal,
    handleOpenViewModal,
    handlePageChange,
    handleAddComic,
    handleUpdateComic,
    handleDeleteComic,
  } = useComic();

  // Hiển thị trạng thái
  const renderStatus = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return (
          <div className="status-success">
            Đã hoàn thành
          </div>
        );
      case "ONGOING":
        return (
          <div className="status-warning">
            Đang cập nhật
          </div>
        );
      default:
        return (
          <Badge variant="secondary" className="text-xs">
            Không xác định
          </Badge>
        );
    }
  };

  return (
    <DashboardLayout title="Quản lý truyện">
      {/* Search and Add Button */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <form onSubmit={handleSearch} className="relative">
          <Input
            type="text"
            placeholder="Tìm kiếm truyện..."
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
          onClick={handleOpenAddModal}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
          aria-label="Thêm truyện mới"
          title="Thêm truyện mới"
        >
          <FiPlus className="mr-2" size={18} />
          Thêm truyện mới
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10 pr-4 py-2 border border-border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground appearance-none cursor-pointer"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="ongoing">Đang cập nhật</option>
            <option value="completed">Đã hoàn thành</option>
          </select>
          <FiFilter className="h-5 w-5 text-primary absolute left-3 top-2" />
        </div>

        <div className="relative">
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10 pr-4 py-2 border border-border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground appearance-none cursor-pointer"
          >
            <option value="">Tất cả thể loại</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <FiFilter className="h-5 w-5 text-primary absolute left-3 top-2" />
        </div>
      </div>

      {/* Comics Table */}
      <Card className="shadow-medium border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="border-b border-border/50">
          <CardTitle className="text-foreground flex items-center gap-2">
            <FiBook className="text-primary" size={20} />
            Danh sách truyện
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-muted/30">
                  <TableHead className="font-semibold text-foreground text-center">
                    Truyện
                  </TableHead>
                  <TableHead className="font-semibold text-foreground text-center">
                    Tác giả
                  </TableHead>
                  <TableHead className="font-semibold text-foreground text-center">
                    Thể loại
                  </TableHead>
                  <TableHead className="font-semibold text-foreground text-center">
                    Lượt xem
                  </TableHead>
                  <TableHead className="font-semibold text-foreground text-center">
                    Trạng thái
                  </TableHead>
                  <TableHead className="font-semibold text-foreground text-center">
                    Cập nhật
                  </TableHead>
                  <TableHead className="font-semibold text-foreground text-center">
                    Thao tác
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="py-10 text-center text-muted-foreground"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                        <p>Đang tải dữ liệu...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="py-10 text-center text-destructive"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <FiAlertCircle size={24} className="mb-2" />
                        <p>{error}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : comics.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="py-12 text-center text-muted-foreground"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <FiBook className="w-16 h-16 mb-4" />
                        <h3 className="text-lg font-medium text-foreground">
                          Không có truyện nào
                        </h3>
                        <p className="mb-6">
                          Chưa có truyện nào được thêm vào hệ thống.
                        </p>
                        <Button
                          onClick={handleOpenAddModal}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          <FiPlus className="mr-2" size={18} />
                          Thêm truyện mới
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  comics.map((comic) => (
                    <TableRow
                      key={comic.id}
                      className="border-border/50 hover:bg-muted/20 transition-colors duration-200"
                    >
                      <TableCell className="py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12 relative">
                            <Image
                              src={comic.thumbUrl || "https://placehold.co/100x150/05df72/fff?text=Comic"}
                              alt={comic.name}
                              fill
                              sizes="48px"
                              className="rounded-lg object-cover shadow-soft border border-border/30"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-foreground">
                              {comic.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {comic.slug}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center text-muted-foreground font-medium">
                        {comic.author || <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">Đang cập nhật</span>}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex flex-wrap gap-1 justify-center">
                          {comic.categories.slice(0,).map((category) => (
                            <span
                              key={category.id}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            >
                              {category.name}
                            </span>
                          ))}
                          {comic.categories.length > 3 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                              +{comic.categories.length - 3}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center text-muted-foreground font-medium">
                        <span className="inline-flex items-center gap-1">
                          <FiEye size={14} className="text-primary" />
                          {comic.viewsCount.toLocaleString() || 0}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        {renderStatus(comic.status)}
                      </TableCell>
                      <TableCell className="text-center text-muted-foreground">
                        {formatDate(comic.updatedAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenViewModal(comic)}
                            className="h-8 px-2 text-info hover:bg-info/10 hover:text-info"
                            aria-label="Xem chi tiết"
                            title="Xem chi tiết"
                          >
                            <FiEye size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEditModal(comic)}
                            className="h-8 px-2 text-primary hover:bg-primary/10 hover:text-primary"
                            aria-label="Sửa"
                            title="Sửa"
                          >
                            <FiEdit size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDeleteModal(comic)}
                            className="h-8 px-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                            aria-label="Xóa"
                            title="Xóa"
                          >
                            <FiTrash2 size={14} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {!isLoading && !error && comics.length > 0 && (
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
      {isModalOpen && (
        <ComicModal
          comic={currentComic}
          categories={categories}
          onClose={() => setIsModalOpen(false)}
          onSave={currentComic ? handleUpdateComic : handleAddComic}
        />
      )}

      {isDeleteModalOpen && currentComic && (
        <DeleteComicModal
          comicTitle={currentComic.name}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteComic}
          isDeleting={isDeleting}
        />
      )}

      {isViewModalOpen && currentComic && (
        <ViewComic
          comic={currentComic}
          onClose={() => setIsViewModalOpen(false)}
        />
      )}
    </DashboardLayout>
  );
}
