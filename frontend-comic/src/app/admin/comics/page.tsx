"use client";

import ComicModal from "@/components/admin/comics/ComicModal";
import DeleteComicModal from "@/components/admin/comics/DeleteComicModal";
import ViewComic from "@/components/admin/comics/ViewComic";
import DashboardLayout from "@/components/admin/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Pagination from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useComic } from "@/hooks/useComic";
import { formatDate } from "@/utils/helpers";
import { chooseImageUrl } from "@/utils/string";
import { renderComicStatus, renderComicCategory, renderComicAuthor, renderBadge } from "@/components/ui/comic-render";
import Image from "next/image";
import {
  FiAlertCircle,
  FiBook,
  FiEdit,
  FiEye,
  FiFilter,
  FiPlus,
  FiSearch,
  FiTrash2,
} from "react-icons/fi";
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
    isPublisher,

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

  // Các hàm render đã được tách ra utils/comic-render.tsx

  return (
    <DashboardLayout title={isPublisher ? "Truyện của tôi" : "Quản lý truyện"} isPublisher={isPublisher}>
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
          aria-label={isPublisher ? "Tạo truyện mới" : "Thêm truyện mới"}
          title={isPublisher ? "Tạo truyện mới" : "Thêm truyện mới"}
        >
          <FiPlus className="mr-2" size={18} />
          {isPublisher ? "Tạo truyện mới" : "Thêm truyện mới"}
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-80">
          <Select
            value={statusFilter || "all"}
            onValueChange={(value) => {
              setStatusFilter(value === "all" ? "" : value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-full">
              <div className="flex items-center">
                <FiFilter className="h-4 w-4 mr-2 text-primary" />
                <SelectValue placeholder="Tất cả trạng thái" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="ongoing">Đang cập nhật</SelectItem>
              <SelectItem value="completed">Đã hoàn thành</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full sm:w-80">
          <Select
            value={categoryFilter || "all"}
            onValueChange={(value) => {
              setCategoryFilter(value === "all" ? "" : value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-full">
              <div className="flex items-center">
                <FiBook className="h-4 w-4 mr-2 text-primary" />
                <SelectValue placeholder="Tất cả thể loại" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả thể loại</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Comics Table */}
      <Card className="shadow-medium border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="border-b border-border/50">
          <CardTitle className="text-foreground flex items-center gap-2">
            <FiBook className="text-primary" size={20} />
            {isPublisher ? "Truyện của tôi" : "Danh sách truyện"}
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
          ) : comics.length === 0 ? (
            <div className="p-12 text-center">
              <FiBook className="w-16 h-16 text-muted-foreground mb-4 mx-auto" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Không có truyện nào
              </h3>
              <p className="text-muted-foreground mb-6">
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
          ) : (
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
                      Nhà xuất bản
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
                  {comics.map((comic) => (
                    <TableRow
                      key={comic.id}
                      className="border-border/50 hover:bg-muted/20 transition-colors duration-200"
                    >
                      {/* Thumbnail */}
                      <TableCell className="py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12 relative">
                            <Image
                              src={chooseImageUrl(comic.thumbUrl)}
                              alt={comic.name}
                              fill
                              sizes="48px"
                              className="rounded-lg object-cover shadow-soft border border-border/30"
                            />
                          </div>
                          <div className="ml-4 max-w-[175px]">
                            <div className="text-sm font-semibold text-foreground truncate">
                              {comic.name}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {comic.slug}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Tác giả */}
                      <TableCell className="text-center text-muted-foreground font-medium">
                        {renderComicAuthor(comic.author)}
                      </TableCell>

                      {/* Nhà xuất bản */}
                      <TableCell className="text-center text-muted-foreground font-medium">
                        {renderBadge(comic.publisherUserName)}
                      </TableCell>

                      {/* Thể loại */}
                      <TableCell className="text-center">
                        <div className="flex flex-wrap gap-1 justify-center">
                          {comic.categories.slice(0, 2).map(renderComicCategory)}
                          {comic.categories.length > 2 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-500 text-white shadow-md hover:shadow-lg hover:bg-gray-600 transition-all duration-300 hover:scale-105">
                              +{comic.categories.length - 2}
                            </span>
                          )}
                        </div>
                      </TableCell>

                      {/* Lượt xem */}
                      <TableCell className="text-center text-muted-foreground font-medium">
                        <span className="inline-flex items-center gap-1">
                          <FiEye size={14} className="text-primary" />
                          {comic.viewsCount.toLocaleString() || 0}
                        </span>
                      </TableCell>

                      {/* Trạng thái */}
                      <TableCell className="text-center">
                        {renderComicStatus(comic.status)}
                      </TableCell>

                      {/* Cập nhật */}
                      <TableCell className="text-center text-muted-foreground">
                        {formatDate(comic.updatedAt)}
                      </TableCell>

                      {/* Thao tác */}
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
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

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
          isOpen={isModalOpen}
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
          isOpen={isViewModalOpen}
          comic={currentComic}
          onClose={() => setIsViewModalOpen(false)}
        />
      )}
    </DashboardLayout>
  );
}
