'use client'

import ChapterModal from "@/components/admin/chapters/ChapterModal";
import DeleteChapterModal from "@/components/admin/chapters/DeleteChapterModal";
import ViewChapterModal from "@/components/admin/chapters/ViewChapterModal";
import DashboardLayout from "@/components/admin/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Pagination from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useChapter } from "@/hooks/useChapter";
import { constructImageUrl, formatDate } from "@/utils/helpers";
import Image from "next/image";
import { FiAlertCircle, FiBookOpen, FiEdit, FiEye, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";

export default function Chapters() {

  const {
    chapters,
    currentPage,
    totalPages,
    isLoading,
    error,
    searchTerm,
    isPublisher,
    // set
    setCurrentPage,
    setSearchTerm,
    comicFilter,
    comicSearchTerm,
    setComicSearchTerm,
    isComicDropdownOpen,
    setIsComicDropdownOpen,
    handleSelectComic,
    filteredComicOptions,


    // handle
    handleOpenViewModal,
    handleOpenDeleteModal,
    handleOpenAddModal,
    handleOpenEditModal,
    handleSearch,
    handleDeleteChapter,
    handleSubmitChapter,

    // selected
    selectedChapter,

    // comicOptions
    comicOptions,

    // modal
    isViewModalOpen,
    isDeleteModalOpen,
    isAddEditModalOpen,
    setIsViewModalOpen,
    setIsDeleteModalOpen,
    setIsAddEditModalOpen,

    isLoadingComics,
    handleComicDropdownScroll,
  } = useChapter();

  return (
    <DashboardLayout title={isPublisher ? "Chapter của tôi" : "Quản lý chapter"} isPublisher={isPublisher}>
      {/* Search and Add Button */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm chapter..."
              className="pl-10 w-full sm:w-80 border-border focus:border-primary"
            />
            <FiSearch className="h-5 w-5 text-primary absolute left-3 top-2" />
            <button type="submit" className="hidden">
              Tìm kiếm
            </button>
          </form>

          {/* Comic Filter */}
          <div className="relative w-full sm:w-80">
            <Input
              type="text"
              value={comicFilter ? comicOptions.find(c => c.id === comicFilter)?.name || "Tất cả truyện" : "Tất cả truyện"}
              placeholder="Chọn truyện..."
              className="pl-10 pr-10 w-full border-border focus:border-primary cursor-pointer"
              onClick={() => setIsComicDropdownOpen(!isComicDropdownOpen)}
              readOnly
            />
            <FiBookOpen className="h-5 w-5 text-primary absolute left-3 top-2" />
            <svg
              className={`w-5 h-5 transition-transform text-muted-foreground absolute right-3 top-2 ${isComicDropdownOpen ? "transform rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>

            {isComicDropdownOpen && (
              <div
                className="absolute z-10 mt-1 w-full bg-card shadow-strong rounded-lg max-h-80 overflow-hidden border border-border/50 flex flex-col backdrop-blur-sm"
              >
                <div className="sticky top-0 z-20 bg-card p-2 border-b border-border/50 shadow-soft">
                  <div className="relative">
                    <Input
                      type="text"
                      value={comicSearchTerm}
                      onChange={(e) => setComicSearchTerm(e.target.value)}
                      placeholder="Tìm truyện..."
                      className="pl-8 border-border focus:border-primary"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <FiSearch className="h-4 w-4 text-primary absolute left-2.5 top-3" />
                  </div>
                </div>

                <div className="overflow-y-auto custom-scrollbar" onScroll={handleComicDropdownScroll}>
                  <div
                    className="px-4 py-2 hover:bg-muted/50 cursor-pointer text-foreground transition-colors duration-200"
                    onClick={() => handleSelectComic("")}
                  >
                    Tất cả truyện
                  </div>

                  {filteredComicOptions.length > 0 ? (
                    filteredComicOptions.map((comic) => (
                      <div
                        key={comic.id}
                        className="px-4 py-2 hover:bg-muted/50 cursor-pointer flex items-center gap-3 text-foreground transition-colors duration-200"
                        onClick={() => handleSelectComic(comic.id)}
                      >
                        <div className="h-10 w-8 flex-shrink-0 overflow-hidden rounded">
                          {comic.thumbUrl ? (
                            <div className="relative h-10 w-8">
                              <Image
                                src={comic.thumbUrl}
                                alt={comic.name}
                                fill
                                sizes="32px"
                                className="object-cover shadow-soft border border-border/30"
                                loading="lazy"
                              />
                            </div>
                          ) : (
                            <div className="h-10 w-8 bg-muted rounded flex items-center justify-center">
                              <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <span className="truncate">{comic.name}</span>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-muted-foreground">
                      Không tìm thấy truyện nào
                    </div>
                  )}

                  {/* Loading indicator */}
                  {isLoadingComics && (
                    <div className="px-4 py-3 text-center">
                      <LoadingSpinner />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          {/* End Comic Filter */}
        </div>

        <Button
          onClick={handleOpenAddModal}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <FiPlus className="mr-2" size={18} />
          {isPublisher ? "Tạo chapter mới" : "Thêm chapter mới"}
        </Button>
      </div>

      {/* Chapters Table */}
      <Card className="shadow-medium border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="border-b border-border/50">
          <CardTitle className="text-foreground flex items-center gap-2">
            <FiBookOpen className="text-primary" size={20} />
            {isPublisher ? "Chapter của tôi" : "Danh sách chapter"}
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
          ) : chapters.length === 0 ? (
            <div className="p-12 text-center">
              <FiBookOpen className="w-16 h-16 text-muted-foreground mb-4 mx-auto" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Không có chapter nào
              </h3>
              <p className="text-muted-foreground mb-6">
                Chưa có chapter nào được thêm vào hệ thống.
              </p>
              <Button
                onClick={handleOpenAddModal}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <FiPlus className="mr-2" size={18} />
                Thêm chapter mới
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
                      Chapter
                    </TableHead>
                    <TableHead className="font-semibold text-foreground text-center">
                      Trạng thái
                    </TableHead>
                    <TableHead className="font-semibold text-foreground text-center">
                      Giá
                    </TableHead>
                    <TableHead className="font-semibold text-foreground text-center">
                      Ngày tạo
                    </TableHead>
                    <TableHead className="font-semibold text-foreground text-center">
                      Ngày cập nhật
                    </TableHead>
                    <TableHead className="font-semibold text-foreground text-center">
                      Thao tác
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {chapters.map((chapter) => (
                    <TableRow
                      key={chapter.id}
                      className="border-border/50 hover:bg-muted/20 transition-colors duration-200"
                    >
                      <TableCell className="py-4 flex items-center w-[100px]">
                        <div className="flex-shrink-0 h-[120px] w-[100px] relative overflow-hidden">
                          {chapter.detailChapters && chapter.detailChapters.length > 0 && chapter.detailChapters[0]?.imgUrl ? (
                            <Image
                              src={constructImageUrl(chapter, chapter.detailChapters[0].imgUrl)}
                              alt={`Ảnh bìa ${chapter.comicName}`}
                              fill
                              sizes="100px"
                              loading="lazy"
                              className="object-cover rounded-md shadow-soft border border-border/30"
                            />
                          ) : (
                            <div className="h-[120px] w-[100px] bg-muted rounded-md flex items-center justify-center shadow-soft border border-border/30">
                              <div className="text-center">
                                <svg className="w-8 h-8 text-muted-foreground mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-xs text-muted-foreground">No Img</span>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="ml-4">
                          <div className="font-medium text-foreground max-w-[150px] truncate">
                            {chapter.comicName}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center text-foreground font-medium">
                        {chapter.chapterNumber}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${chapter.status === 'FREE'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                          }`}>
                          {chapter.status === 'FREE' ? 'Miễn phí' : 'Trả phí'}
                        </span>
                      </TableCell>
                      <TableCell className="text-center text-foreground">
                        {chapter.status === 'FEE' && chapter.price
                          ? `${chapter.price.toLocaleString('vi-VN')} VNĐ`
                          : '-'
                        }
                      </TableCell>
                      <TableCell className="text-center text-muted-foreground">
                        {formatDate(chapter.createdAt)}
                      </TableCell>
                      <TableCell className="text-center text-muted-foreground">
                        {formatDate(chapter.updatedAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenViewModal(chapter)}
                            className="h-8 px-2 text-info hover:bg-info/10 hover:text-info"
                            aria-label="Xem chi tiết"
                            title="Xem chi tiết"
                          >
                            <FiEye size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEditModal(chapter)}
                            className="h-8 px-2 text-primary hover:bg-primary/10 hover:text-primary"
                            aria-label="Sửa"
                            title="Sửa"
                          >
                            <FiEdit size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDeleteModal(chapter)}
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
          {!isLoading && !error && chapters.length > 0 && (
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

      {/* Modals */}
      <ViewChapterModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        chapter={selectedChapter}
      />

      {selectedChapter && (
        <DeleteChapterModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteChapter}
          chapterTitle={selectedChapter.title}
          chapterNumber={selectedChapter.chapterNumber}
          comicName={selectedChapter.comicName || ''}
        />
      )}

      <ChapterModal
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        onSubmit={handleSubmitChapter}
        chapter={selectedChapter}
        comicOptions={comicOptions}
      />
    </DashboardLayout>
  )
}
