"use client";

import DashboardLayout from "@/components/admin/DashboardLayout";
import {
  FiSearch,
  FiCheck,
  FiX,
  FiClock,
  FiUserCheck,
  FiAlertCircle,
  FiEye,
  FiUser,
} from "react-icons/fi";
import Pagination from "@/components/ui/pagination";
import { usePublisherRequest } from "@/hooks/usePublisherRequest";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { PublisherRequest, PublisherRequestStatus } from "@/types/publisherRequest";
import { formatDate } from "@/utils/helpers";
import PublisherRequestDetailModal from "@/components/admin/publisher-requests/PublisherRequestDetailModal";
import { useState } from "react";
import { LevelResponse } from "@/types/level";
import UserName from "@/components/ui/UserName";

export default function PublisherRequestsPage() {
  const {
    publisherRequests,
    isLoading,
    error,
    currentPage,
    totalPages,
    searchTerm,
    statusFilter,
    isUpdating,
    setSearchTerm,
    handleSearch,
    handleStatusFilter,
    handlePageChange,
    handleUpdateStatus,
  } = usePublisherRequest();

  const [selectedRequest, setSelectedRequest] = useState<PublisherRequest | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Xử lý xem chi tiết
  const handleViewDetail = (request: PublisherRequest) => {
    setSelectedRequest(request);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedRequest(null);
  };

  // Render trạng thái với màu sắc và icon
  const renderStatus = (status: PublisherRequestStatus) => {
    switch (status) {
      case PublisherRequestStatus.PENDING:
        return (
          <Badge className="text-xs bg-yellow-500 text-white border-0 shadow-md hover:shadow-lg hover:bg-yellow-600 transition-all duration-300 hover:scale-105 font-medium">
            <FiClock className="w-3 h-3 mr-1" />
            Chờ duyệt
          </Badge>
        );
      case PublisherRequestStatus.APPROVED:
        return (
          <Badge className="text-xs bg-emerald-500 text-white border-0 shadow-md hover:shadow-lg hover:bg-emerald-600 transition-all duration-300 hover:scale-105 font-medium">
            <FiCheck className="w-3 h-3 mr-1" />
            Đã duyệt
          </Badge>
        );
      case PublisherRequestStatus.REJECTED:
        return (
          <Badge className="text-xs bg-red-500 text-white border-0 shadow-md hover:shadow-lg hover:bg-red-600 transition-all duration-300 hover:scale-105 font-medium">
            <FiX className="w-3 h-3 mr-1" />
            Từ chối
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-xs">
            {status}
          </Badge>
        );
    }
  };

  // Render level với màu sắc
  const renderLevel = (level: LevelResponse) => {
    if (!level) return <span className="text-muted-foreground">-</span>;

    return (
      <Badge
        variant="outline"
        className="text-xs border-blue-300 text-blue-600 hover:bg-blue-50 transition-all duration-200"
      >
        {level.name}
      </Badge>
    );
  };

  // Render action buttons
  const renderActionButtons = (request: PublisherRequest) => {
    const isCurrentlyUpdating = isUpdating === request.id;

    return (
      <div className="flex justify-center gap-1">
        {/* View Detail Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleViewDetail(request)}
          className="h-8 px-2 text-primary hover:bg-primary/10 hover:text-primary"
          aria-label="Xem chi tiết"
          title="Chi tiết"
        >
          <FiEye size={14} />
        </Button>

        {/* Action buttons for pending requests */}
        {request.status === PublisherRequestStatus.PENDING && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleUpdateStatus(request.id, PublisherRequestStatus.APPROVED)}
              disabled={isCurrentlyUpdating}
              className="h-8 px-2 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
              aria-label="Phê duyệt"
              title="Phê duyệt"
            >
              {isCurrentlyUpdating ? (
                <LoadingSpinner size="sm" />
              ) : (
                <FiCheck size={14} />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleUpdateStatus(request.id, PublisherRequestStatus.REJECTED)}
              disabled={isCurrentlyUpdating}
              className="h-8 px-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
              aria-label="Từ chối"
              title="Từ chối"
            >
              {isCurrentlyUpdating ? (
                <LoadingSpinner size="sm" />
              ) : (
                <FiX size={14} />
              )}
            </Button>
          </>
        )}
      </div>
    );
  };

  return (
    <DashboardLayout title="Quản lý yêu cầu nhà xuất bản">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <form onSubmit={(e) => { e.preventDefault(); handleSearch(searchTerm); }} className="relative">
            <Input
              type="text"
              placeholder="Tìm kiếm theo tên người dùng..."
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
          <div className="w-full sm:w-60">
            <Select
              value={statusFilter || "all"}
              onValueChange={(value) => handleStatusFilter(value === "all" ? "" : value as PublisherRequestStatus)}
            >
              <SelectTrigger className="w-full">
                <div className="flex items-center">
                  <FiUserCheck className="h-4 w-4 mr-2 text-primary" />
                  <SelectValue placeholder="Tất cả trạng thái" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value={PublisherRequestStatus.PENDING}>Chờ duyệt</SelectItem>
                <SelectItem value={PublisherRequestStatus.APPROVED}>Đã duyệt</SelectItem>
                <SelectItem value={PublisherRequestStatus.REJECTED}>Từ chối</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Publisher Requests Table */}
      <Card className="shadow-medium border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="border-b border-border/50">
          <CardTitle className="text-foreground flex items-center gap-2">
            <FiUserCheck className="text-primary" size={20} />
            Danh sách yêu cầu nhà xuất bản
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
                onClick={() => handleSearch(searchTerm)}
                className="mt-4 bg-primary hover:bg-primary/90"
              >
                Thử lại
              </Button>
            </div>
          ) : publisherRequests.length === 0 ? (
            <div className="p-12 text-center">
              <FiUserCheck className="w-16 h-16 text-muted-foreground mb-4 mx-auto" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Không có yêu cầu nào
              </h3>
              <p className="text-muted-foreground mb-6">
                Chưa có yêu cầu trở thành nhà xuất bản nào.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-muted/30">
                    <TableHead className="font-semibold text-foreground text-center">
                      Người dùng
                    </TableHead>
                    <TableHead className="font-semibold text-foreground text-center">
                      Cấp độ
                    </TableHead>
                    <TableHead className="font-semibold text-foreground text-center">
                      Trạng thái
                    </TableHead>
                    <TableHead className="font-semibold text-foreground text-center">
                      Ngày tạo
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
                  {publisherRequests.map((request) => (
                    <TableRow
                      key={request.id}
                      className="border-border/50 hover:bg-muted/20 transition-colors duration-200"
                    >
                      <TableCell className="py-4">
                        <div className="flex items-center justify-center">
                          <div className="flex-shrink-0 h-10 w-10 relative">
                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground shadow-soft">
                              <FiUser size={16} />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-foreground">
                              <UserName
                                username={request.username}
                                level={request.level}
                                showLevel={false}
                                className="text-sm font-medium text-foreground"
                              />
                            </div>
                            <div className="text-xs text-muted-foreground">
                              ID: {request.userId}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center py-4">
                        {renderLevel(request.level)}
                      </TableCell>
                      <TableCell className="text-center py-4">
                        {renderStatus(request.status)}
                      </TableCell>
                      <TableCell className="text-center py-4 text-muted-foreground">
                        {formatDate(request.createdAt)}
                      </TableCell>
                      <TableCell className="text-center py-4 text-muted-foreground">
                        {formatDate(request.updatedAt)}
                      </TableCell>
                      <TableCell className="py-4">
                        {renderActionButtons(request)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {!isLoading && !error && publisherRequests.length > 0 && totalPages > 1 && (
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

      {/* Detail Modal */}
      <PublisherRequestDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        request={selectedRequest}
        isUpdating={isUpdating === selectedRequest?.id}
        onUpdateStatus={handleUpdateStatus}
      />
    </DashboardLayout>
  );
} 