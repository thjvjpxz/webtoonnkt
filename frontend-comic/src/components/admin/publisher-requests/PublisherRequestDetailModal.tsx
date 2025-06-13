"use client";

import { PublisherRequest, PublisherRequestStatus } from "@/types/publisherRequest";
import { formatDate } from "@/utils/helpers";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { FiUser, FiCalendar, FiAward, FiCheck, FiX, FiClock } from "react-icons/fi";

interface PublisherRequestDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: PublisherRequest | null;
  isUpdating: boolean;
  onUpdateStatus: (id: string, status: PublisherRequestStatus) => void;
}

export default function PublisherRequestDetailModal({
  isOpen,
  onClose,
  request,
  isUpdating,
  onUpdateStatus,
}: PublisherRequestDetailModalProps) {
  if (!request) return null;

  // Render trạng thái với màu sắc và icon
  const renderStatus = (status: PublisherRequestStatus) => {
    switch (status) {
      case PublisherRequestStatus.PENDING:
        return (
          <Badge className="text-sm bg-yellow-500 text-white border-0 shadow-md font-medium">
            <FiClock className="w-4 h-4 mr-2" />
            Chờ duyệt
          </Badge>
        );
      case PublisherRequestStatus.APPROVED:
        return (
          <Badge className="text-sm bg-emerald-500 text-white border-0 shadow-md font-medium">
            <FiCheck className="w-4 h-4 mr-2" />
            Đã duyệt
          </Badge>
        );
      case PublisherRequestStatus.REJECTED:
        return (
          <Badge className="text-sm bg-red-500 text-white border-0 shadow-md font-medium">
            <FiX className="w-4 h-4 mr-2" />
            Từ chối
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-sm">
            {status}
          </Badge>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card border-border">
        <DialogHeader className="border-b border-border pb-4">
          <DialogTitle className="text-xl font-semibold flex items-center text-foreground">
            <FiUser className="w-5 h-5 mr-2 text-primary" />
            Chi tiết yêu cầu nhà xuất bản
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Thông tin người dùng */}
          <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
            <h3 className="font-semibold text-foreground mb-3 flex items-center">
              <FiUser className="w-4 h-4 mr-2 text-primary" />
              Thông tin người dùng
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Tên người dùng</label>
                <p className="text-foreground font-medium">{request.username}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">ID người dùng</label>
                <p className="text-foreground font-mono text-sm">{request.userId}</p>
              </div>
            </div>
          </div>

          {/* Thông tin cấp độ */}
          <div className="bg-blue-50/50 dark:bg-blue-950/20 rounded-lg p-4 border border-blue-200/50 dark:border-blue-800/50">
            <h3 className="font-semibold text-foreground mb-3 flex items-center">
              <FiAward className="w-4 h-4 mr-2 text-blue-600" />
              Thông tin cấp độ
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Tên cấp độ</label>
                <p className="text-foreground font-medium">
                  {request.level?.name || "Không có thông tin"}
                </p>
              </div>
            </div>
          </div>

          {/* Trạng thái và thời gian */}
          <div className="bg-emerald-50/50 dark:bg-emerald-950/20 rounded-lg p-4 border border-emerald-200/50 dark:border-emerald-800/50">
            <h3 className="font-semibold text-foreground mb-3 flex items-center">
              <FiCalendar className="w-4 h-4 mr-2 text-emerald-600" />
              Trạng thái và thời gian
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Trạng thái hiện tại</label>
                <div className="mt-1">
                  {renderStatus(request.status)}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Ngày tạo</label>
                  <p className="text-foreground">{formatDate(request.createdAt)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Cập nhật lần cuối</label>
                  <p className="text-foreground">{formatDate(request.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between border-t border-border pt-4">
          <Button variant="outline" onClick={onClose} className="border-border">
            Đóng
          </Button>

          {request.status === PublisherRequestStatus.PENDING && (
            <div className="flex gap-2">
              <Button
                variant="destructive"
                onClick={() => onUpdateStatus(request.id, PublisherRequestStatus.REJECTED)}
                disabled={isUpdating}
                className="bg-destructive hover:bg-destructive/90"
              >
                {isUpdating ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <FiX className="w-4 h-4 mr-2" />
                    Từ chối
                  </>
                )}
              </Button>
              <Button
                onClick={() => onUpdateStatus(request.id, PublisherRequestStatus.APPROVED)}
                disabled={isUpdating}
                className="bg-primary hover:bg-primary/90"
              >
                {isUpdating ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <FiCheck className="w-4 h-4 mr-2" />
                    Phê duyệt
                  </>
                )}
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 