"use client";

import { CommentResponse } from "@/types/comment";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import {
  FiMessageCircle,
  FiUser,
  FiBook,
  FiCalendar,
  FiClock,
  FiHash,
  FiCornerDownRight,
  FiX,
} from "react-icons/fi";
import { formatDate } from "@/utils/helpers";

interface ViewCommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  comment: CommentResponse;
}

export default function ViewCommentModal({
  isOpen,
  onClose,
  comment,
}: ViewCommentModalProps) {
  // Hàm format trạng thái
  const getStatusText = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "Hoạt động";
      case "BLOCKED":
        return "Bị chặn";
      case "DELETED":
        return "Đã xóa";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "text-green-600 bg-green-100";
      case "BLOCKED":
        return "text-red-600 bg-red-100";
      case "DELETED":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
              <FiMessageCircle className="h-5 w-5 text-primary" />
              Chi tiết bình luận
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <FiX size={16} />
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] px-6 pb-6">
          <div className="space-y-6">
            {/* Thông tin cơ bản */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FiHash className="h-4 w-4 text-primary" />
                  Thông tin cơ bản
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* ID và trạng thái */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-muted-foreground">ID:</span>
                    <p className="font-mono text-sm">{comment.id}</p>
                  </div>
                  <Badge className={`px-3 py-1 ${getStatusColor(comment.status)}`}>
                    {getStatusText(comment.status)}
                  </Badge>
                </div>

                {/* Nội dung bình luận */}
                <div>
                  <span className="text-sm text-muted-foreground">Nội dung:</span>
                  <div className="mt-2 p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>
                </div>

                {/* Thời gian */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <FiCalendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="text-sm text-muted-foreground">Ngày tạo:</span>
                      <p className="text-sm font-medium">{formatDate(comment.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiClock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="text-sm text-muted-foreground">Cập nhật:</span>
                      <p className="text-sm font-medium">{formatDate(comment.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Thông tin người dùng */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FiUser className="h-4 w-4 text-primary" />
                  Thông tin người dùng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={comment.user.imgUrl || "/images/placeholder.svg"}
                      alt={comment.user.username}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-foreground">
                        {comment.user.username}
                      </h4>
                      {comment.user.vip && (
                        <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                          VIP
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">ID: {comment.user.id}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Thông tin truyện */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FiBook className="h-4 w-4 text-primary" />
                  Thông tin truyện
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <div className="relative w-16 h-20 rounded overflow-hidden">
                    <Image
                      src={comment.comic.thumbUrl || "/images/placeholder.svg"}
                      alt={comment.comic.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h4 className="font-semibold text-foreground">
                      {comment.comic.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Slug: {comment.comic.slug}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ID: {comment.comic.id}
                    </p>
                    {comment.chapter && (
                      <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm font-medium">
                          Chương {comment.chapter.chapterNumber}: {comment.chapter.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          ID: {comment.chapter.id}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Thông tin parent comment nếu có */}
            {comment.parent && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FiCornerDownRight className="h-4 w-4 text-primary" />
                    Bình luận gốc
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden">
                      <Image
                        src={comment.parent.user.imgUrl || "/images/placeholder.svg"}
                        alt={comment.parent.user.username}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{comment.parent.user.username}</p>
                      <p className="text-xs text-muted-foreground">ID: {comment.parent.id}</p>
                    </div>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {comment.parent.content}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Thông tin replies */}
            {comment.replies && comment.replies.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FiCornerDownRight className="h-4 w-4 text-primary" />
                    Các phản hồi ({comment.replies.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="border border-border/50 rounded-lg p-3">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="relative w-6 h-6 rounded-full overflow-hidden">
                          <Image
                            src={reply.user.imgUrl || "/images/placeholder.svg"}
                            alt={reply.user.username}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-sm">{reply.user.username}</p>
                            <Badge className={`px-2 py-0.5 text-xs ${getStatusColor(reply.status)}`}>
                              {getStatusText(reply.status)}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(reply.createdAt)}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {reply.content}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
} 