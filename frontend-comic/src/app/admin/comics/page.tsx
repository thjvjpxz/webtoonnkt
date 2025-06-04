"use client";

import ComicModal from "@/components/admin/comics/ComicModal";
import DeleteComicModal from "@/components/admin/comics/DeleteComicModal";
import ViewComic from "@/components/admin/comics/ViewComic";
import DashboardLayout from "@/components/admin/DashboardLayout";
import Pagination from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { LoadingSpinner } from "@/components/ui/loading-spinner";

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

  // Hiển thị trạng thái với hiệu ứng đẹp
  const renderStatus = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500 text-white shadow-md hover:shadow-lg hover:bg-emerald-600 transition-all duration-300 hover:scale-105">
            Đã hoàn thành
          </span>
        );
      case "ONGOING":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500 text-white shadow-md hover:shadow-lg hover:bg-yellow-600 transition-all duration-300 hover:scale-105">
            Đang cập nhật
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-500 text-white shadow-md hover:shadow-lg hover:bg-gray-600 transition-all duration-300 hover:scale-105">
            Không xác định
          </span>
        );
    }
  };

  // Hiển thị thể loại với hiệu ứng đẹp
  const renderCategory = (category: any) => {
    return (
      <span
        key={category.id}
        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-500 text-white shadow-md hover:shadow-lg hover:bg-blue-600 transition-all duration-300 hover:scale-105"
      >
        {category.name}
      </span>
    );
  };

  // Hiển thị badge cho tác giả đang cập nhật
  const renderAuthor = (author: string | null) => {
    if (!author) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-500 text-white shadow-md hover:shadow-lg hover:bg-orange-600 transition-all duration-300 hover:scale-105">
          Đang cập nhật
        </span>
      );
    }
    return (
      <span className="text-muted-foreground font-medium">
        {author}
      </span>
    );
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
            Danh sách truyện
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
                      <TableCell className="text-center text-muted-foreground font-medium">
                        {renderAuthor(comic.author)}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex flex-wrap gap-1 justify-center">
                          {comic.categories.slice(0, 2).map(renderCategory)}
                          {comic.categories.length > 2 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-500 text-white shadow-md hover:shadow-lg hover:bg-gray-600 transition-all duration-300 hover:scale-105">
                              +{comic.categories.length - 2}
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
