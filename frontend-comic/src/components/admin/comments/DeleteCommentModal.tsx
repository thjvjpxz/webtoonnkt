"use client";

import { CommentResponse } from "@/types/comment";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Image from "next/image";
import {
  FiAlertTriangle,
  FiTrash2,
  FiX,
  FiMessageCircle,
} from "react-icons/fi";

interface DeleteCommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  comment: CommentResponse;
  isDeleting: boolean;
}

export default function DeleteCommentModal({
  isOpen,
  onClose,
  onConfirm,
  comment,
  isDeleting,
}: DeleteCommentModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
              <FiAlertTriangle className="h-5 w-5 text-destructive" />
              Xác nhận xóa bình luận
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {/* Cảnh báo */}
          <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <FiAlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-destructive">
                Cảnh báo: Hành động này không thể hoàn tác!
              </p>
              <p className="text-sm text-muted-foreground">
                Bình luận sẽ bị xóa vĩnh viễn khỏi hệ thống.
              </p>
            </div>
          </div>

          {/* Thông tin bình luận sẽ bị xóa */}
          <div className="border border-border rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FiMessageCircle className="h-4 w-4" />
              <span>Bình luận sẽ bị xóa:</span>
            </div>

            {/* Thông tin người dùng */}
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 rounded-full overflow-hidden">
                <Image
                  src={comment.user.imgUrl || "/images/placeholder.svg"}
                  alt={comment.user.username}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm">{comment.user.username}</p>
                  {comment.user.vip && (
                    <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                      VIP
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Nội dung bình luận */}
            <div className="mt-3 p-3 bg-muted/50 rounded">
              <p className="text-sm leading-relaxed text-foreground line-clamp-3">
                {comment.content}
              </p>
            </div>

            {/* Thông tin truyện */}
            <div className="text-xs text-muted-foreground">
              <span>Truyện: </span>
              <span className="font-medium">{comment.comic.name}</span>
              {comment.chapter && (
                <>
                  <span> - Chapter {comment.chapter.chapterNumber}: </span>
                  <span className="font-medium">{comment.chapter.title}</span>
                </>
              )}
            </div>

            {/* Thông tin replies nếu có */}
            {comment.repliesCount && comment.repliesCount > 0 && (
              <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                <FiAlertTriangle className="h-3 w-3" />
                <span>
                  Bình luận này có {comment.repliesCount} phản hồi sẽ bị ảnh hưởng
                </span>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1"
          >
            Hủy bỏ
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1"
          >
            {isDeleting ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Đang xóa...
              </>
            ) : (
              <>
                <FiTrash2 className="mr-2 h-4 w-4" />
                Xóa bình luận
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 