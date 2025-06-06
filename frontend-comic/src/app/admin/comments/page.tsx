"use client";

import DashboardLayout from "@/components/admin/DashboardLayout";
import ViewCommentModal from "@/components/admin/comments/ViewCommentModal";
import DeleteCommentModal from "@/components/admin/comments/DeleteCommentModal";
import Pagination from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useComment } from "@/hooks/useComment";
import { CommentStatus } from "@/types/comment";
import Image from "next/image";
import {
  FiAlertCircle,
  FiEye,
  FiFilter,
  FiSearch,
  FiTrash2,
  FiMessageCircle,
  FiShield,
  FiShieldOff,
  FiUser,
  FiBook,
} from "react-icons/fi";
import { formatDate } from "@/utils/helpers";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function Comments() {
  const {
    // Data
    comments,
    comics,
    users,
    currentComment,

    // Pagination
    currentPage,
    totalPages,

    // Loading states
    isLoading,
    isDeleting,

    // Error state
    error,

    // Filters
    searchTerm,
    statusFilter,
    comicFilter,
    userFilter,

    // Modal states
    isViewModalOpen,
    isDeleteModalOpen,

    // Setters
    setSearchTerm,
    setStatusFilter,
    setComicFilter,
    setUserFilter,

    // Actions
    handleSearch,
    handlePageChange,
    handleOpenViewModal,
    handleOpenDeleteModal,
    handleCloseViewModal,
    handleCloseDeleteModal,
    handleBlockComment,
    handleUnblockComment,
    handleDeleteComment,

    // Helpers
    getStatusText,
    getStatusColor,
  } = useComment();

  return (
    <DashboardLayout title="Quản lý bình luận">
      {/* Bộ lọc và tìm kiếm */}
      <div className="mb-6 space-y-4">
        {/* Tìm kiếm */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="text"
              placeholder="Tìm kiếm nội dung bình luận..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-80 border-border focus:border-primary"
            />
            <FiSearch className="h-5 w-5 text-primary absolute left-3 top-2" />
            <button type="submit" className="hidden">
              Tìm kiếm
            </button>
          </form>

          <div className="flex items-center gap-2">
            <FiMessageCircle className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">
              Tổng: {comments.length} bình luận
            </span>
          </div>
        </div>

        {/* Các bộ lọc */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-60">
            <Select
              value={statusFilter || "all"}
              onValueChange={(value) => {
                setStatusFilter(value === "all" ? "" : (value as CommentStatus));
                // Reset về trang 1 khi thay đổi filter
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
                <SelectItem value={CommentStatus.ACTIVE}>Hoạt động</SelectItem>
                <SelectItem value={CommentStatus.BLOCKED}>Bị chặn</SelectItem>
                <SelectItem value={CommentStatus.DELETED}>Đã xóa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:w-60">
            <Select
              value={comicFilter || "all"}
              onValueChange={(value) => {
                setComicFilter(value === "all" ? "" : value);
              }}
            >
              <SelectTrigger className="w-full">
                <div className="flex items-center">
                  <FiBook className="h-4 w-4 mr-2 text-primary" />
                  <SelectValue placeholder="Tất cả truyện" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả truyện</SelectItem>
                {comics.map((comic) => (
                  <SelectItem key={comic.id} value={comic.id}>
                    {comic.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:w-60">
            <Select
              value={userFilter || "all"}
              onValueChange={(value) => {
                setUserFilter(value === "all" ? "" : value);
              }}
            >
              <SelectTrigger className="w-full">
                <div className="flex items-center">
                  <FiUser className="h-4 w-4 mr-2 text-primary" />
                  <SelectValue placeholder="Tất cả người dùng" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả người dùng</SelectItem>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.username}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Bảng danh sách comment */}
      <Card className="shadow-medium border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="border-b border-border/50">
          <CardTitle className="text-foreground flex items-center gap-2">
            <FiMessageCircle className="text-primary" size={20} />
            Danh sách bình luận
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="p-8 text-center flex flex-col items-center">
              <FiAlertCircle size={40} className="mb-2 text-destructive" />
              <p className="text-destructive">{error}</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="p-12 text-center">
              <FiMessageCircle className="w-16 h-16 text-muted-foreground mb-4 mx-auto" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Không có bình luận nào
              </h3>
              <p className="text-muted-foreground mb-6">
                Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
              </p>
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
                      Nội dung
                    </TableHead>
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
                      Ngày tạo
                    </TableHead>
                    <TableHead className="font-semibold text-foreground text-center">
                      Thao tác
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comments.map((comment) => (
                    <TableRow
                      key={comment.id}
                      className="border-border/50 hover:bg-muted/20 transition-colors duration-200"
                    >
                      {/* Người dùng */}
                      <TableCell className="text-center py-4">
                        <div className="flex items-center justify-center gap-3">
                          <div className="relative w-8 h-8 rounded-full overflow-hidden">
                            <Image
                              src={comment.user.imgUrl || "/images/placeholder.svg"}
                              alt={comment.user.username}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex flex-col items-start">
                            <div className="flex items-center gap-1">
                              <span className="font-medium text-foreground">
                                {comment.user.username}
                              </span>
                              {comment.user.vip && (
                                <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                                  VIP
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Nội dung */}
                      <TableCell className="text-center py-4 max-w-xs">
                        <div className="text-sm text-muted-foreground truncate" title={comment.content}>
                          {comment.content}
                        </div>
                        {comment.parent && (
                          <Badge variant="outline" className="mt-1 text-xs">
                            Phản hồi
                          </Badge>
                        )}
                      </TableCell>

                      {/* Truyện */}
                      <TableCell className="text-center py-4">
                        <div className="flex items-center justify-center gap-2">
                          <div className="relative w-8 h-10 rounded overflow-hidden">
                            <Image
                              src={comment.comic.thumbUrl || "/images/placeholder.svg"}
                              alt={comment.comic.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span className="text-sm font-medium text-foreground max-w-24 truncate" title={comment.comic.name}>
                            {comment.comic.name}
                          </span>
                        </div>
                      </TableCell>

                      {/* Chapter */}
                      <TableCell className="text-center py-4 text-muted-foreground">
                        {comment.chapter ? (
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">
                              Chapter {comment.chapter.chapterNumber}
                            </span>
                            <span className="text-xs text-muted-foreground max-w-20 truncate" title={comment.chapter.title}>
                              {comment.chapter.title}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm">Chung</span>
                        )}
                      </TableCell>

                      {/* Trạng thái */}
                      <TableCell className="text-center py-4">
                        <Badge className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(comment.status)}`}>
                          {getStatusText(comment.status)}
                        </Badge>
                      </TableCell>

                      {/* Ngày tạo */}
                      <TableCell className="text-center py-4 text-muted-foreground">
                        <span className="text-sm">
                          {formatDate(comment.createdAt)}
                        </span>
                      </TableCell>

                      {/* Thao tác */}
                      <TableCell className="py-4">
                        <div className="flex justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenViewModal(comment)}
                            className="h-8 px-2 text-info hover:bg-info/10 hover:text-info"
                            aria-label="Xem chi tiết"
                            title="Xem chi tiết"
                          >
                            <FiEye size={14} />
                          </Button>

                          {comment.status === CommentStatus.ACTIVE && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleBlockComment(comment)}
                              className="h-8 px-2 text-yellow-600 hover:bg-yellow-100 hover:text-yellow-700"
                              aria-label="Chặn bình luận"
                              title="Chặn bình luận"
                            >
                              <FiShield size={14} />
                            </Button>
                          )}

                          {comment.status === CommentStatus.BLOCKED && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleUnblockComment(comment)}
                              className="h-8 px-2 text-green-600 hover:bg-green-100 hover:text-green-700"
                              aria-label="Bỏ chặn bình luận"
                              title="Bỏ chặn bình luận"
                            >
                              <FiShieldOff size={14} />
                            </Button>
                          )}

                          {comment.status !== CommentStatus.DELETED && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenDeleteModal(comment)}
                              className="h-8 px-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                              aria-label="Xóa bình luận"
                              title="Xóa bình luận"
                            >
                              <FiTrash2 size={14} />
                            </Button>
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
          {!isLoading && !error && comments.length > 0 && (
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

      {/* Modal xem chi tiết */}
      {isViewModalOpen && currentComment && (
        <ViewCommentModal
          isOpen={isViewModalOpen}
          onClose={handleCloseViewModal}
          comment={currentComment}
        />
      )}

      {/* Modal xóa comment */}
      {isDeleteModalOpen && currentComment && (
        <DeleteCommentModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onConfirm={handleDeleteComment}
          comment={currentComment}
          isDeleting={isDeleting}
        />
      )}
    </DashboardLayout>
  );
} 