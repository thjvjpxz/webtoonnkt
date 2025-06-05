import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CommentResponse } from "@/types/comment";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/helpers";
import { FiMessageCircle, FiTrash2, FiChevronDown, FiChevronRight, FiBookOpen, FiUser } from "react-icons/fi";
import { getFirstColorFromGradient } from "@/utils/string";
import { useAuth } from "@/contexts/AuthContext";

interface CommentItemProps {
  comment: CommentResponse;
  currentUserId?: string;
  isReplyingTo: boolean;
  showReplies: boolean;
  replyContent: string;
  isSubmitting: boolean;
  mode?: "comic" | "chapter";
  onStartReply: () => void;
  onCancelReply: () => void;
  onSubmitReply: () => void;
  onDeleteComment: () => void;
  onToggleReplies: () => void;
  onReplyContentChange: (content: string) => void;
}

export default function CommentItem({
  comment,
  currentUserId,
  isReplyingTo,
  showReplies,
  replyContent,
  isSubmitting,
  mode = "comic",
  onStartReply,
  onCancelReply,
  onSubmitReply,
  onDeleteComment,
  onToggleReplies,
  onReplyContentChange,
}: CommentItemProps) {
  const canDelete = currentUserId === comment.user.id;
  const hasReplies = (comment.repliesCount || 0) > 0 || (comment.replies && comment.replies.length > 0);
  const isParentComment = !comment.parent;
  const shouldShowChapter = mode === "comic" && isParentComment && comment.chapter;

  return (
    <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
      {/* Chapter info - chỉ hiển thị cho comment cha trong comic detail */}
      {shouldShowChapter && comment.chapter && (
        <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
          <Link
            href={`/comic/${comment.comic.slug}/${comment.chapter.id}`}
            className="flex items-center gap-2 text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
          >
            <FiBookOpen className="text-sm flex-shrink-0" />
            <span className="text-sm font-medium">
              Chapter {comment.chapter.chapterNumber}: {comment.chapter.title}
            </span>
          </Link>
        </div>
      )}

      {/* Header comment */}
      <div className="flex items-start gap-3 mb-3">
        <div className="relative w-10 h-10 rounded-full transition-all duration-200 select-none">
          <Image
            src={comment.user.imgUrl || "/images/placeholder.svg"}
            alt={comment.user.username}
            fill
            sizes="36px"
            className="rounded-full object-cover border-2 border-primary/20"
          />
          {comment.user?.vip && (
            <div className="absolute -top-1 -right-1 h-[14px] w-[14px] bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">★</span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span
                style={{
                  color:
                    comment.user.level?.levelNumber === 1
                      ? comment.user.level?.urlGif
                      : "transparent",
                  backgroundImage:
                    comment.user.level?.levelNumber !== 1
                      ? `url(${comment.user.level?.urlGif})`
                      : "none",
                  backgroundSize:
                    comment.user.level?.levelNumber !== 1
                      ? "auto"
                      : "none",
                  backgroundPosition:
                    comment.user.level?.levelNumber !== 1
                      ? "center"
                      : "none",
                  WebkitBackgroundClip:
                    comment.user.level?.levelNumber !== 1
                      ? "text"
                      : "none",
                }}
              >
                {comment.user.username}
              </span>
              {
                comment.user.level?.color.startsWith('linear-gradient') ? (
                  <Badge
                    className="text-xs bg-white dark:bg-gray-800 border rounded"
                    style={{
                      background: comment.user.level?.color,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      borderColor: getFirstColorFromGradient(comment.user.level?.color),
                    }}
                  >
                    {comment.user.level?.name}
                  </Badge>
                ) : (
                  <Badge
                    className="text-xs bg-white dark:bg-gray-800 border rounded"
                    style={{
                      color: comment.user.level?.color,
                      borderColor: comment.user.level?.color,
                    }}
                  >
                    {comment.user.level?.name}
                  </Badge>
                )
              }

              {/* {comment.user.vip && (
                <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-xs">
                  VIP
                </Badge>
              )} */}
            </div>
            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {formatDate(comment.createdAt)}
            </span>
          </div>

          {/* Nội dung comment */}
          <div className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed break-words mb-3">
            {comment.content}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {
              canDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onStartReply}
                  className="text-primary hover:text-primary/80 hover:bg-primary/10 h-8 px-2 text-xs sm:text-sm"
                >
                  <FiMessageCircle className="mr-1 text-xs sm:text-sm" />
                  Phản hồi
                </Button>
              )
            }

            {hasReplies && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleReplies}
                className="text-gray-600 hover:text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700/50 h-8 px-2 text-xs sm:text-sm"
              >
                {showReplies ? (
                  <FiChevronDown className="mr-1 text-xs sm:text-sm" />
                ) : (
                  <FiChevronRight className="mr-1 text-xs sm:text-sm" />
                )}
                {comment.repliesCount || comment.replies?.length || 0} phản hồi
              </Button>
            )}

            {canDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onDeleteComment}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 h-8 px-2 ml-auto text-xs sm:text-sm"
              >
                <FiTrash2 className="mr-1 text-xs sm:text-sm" />
                Xóa
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Form phản hồi */}
      {isReplyingTo && (
        <div className="ml-0 sm:ml-13 mt-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50 rounded border border-gray-200 dark:border-gray-600">
          <Textarea
            placeholder={`Phản hồi ${comment.user.username}...`}
            value={replyContent}
            onChange={(e) => onReplyContentChange(e.target.value)}
            className="mb-3 min-h-[80px] border-gray-300 dark:border-gray-600 focus:border-primary text-sm sm:text-base"
            disabled={isSubmitting}
          />
          <div className="flex flex-col sm:flex-row justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onCancelReply}
              disabled={isSubmitting}
              className="border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 w-full sm:w-auto"
            >
              Hủy
            </Button>
            <Button
              size="sm"
              onClick={onSubmitReply}
              disabled={isSubmitting || !replyContent.trim()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto"
            >
              {isSubmitting ? "Đang gửi..." : "Gửi phản hồi"}
            </Button>
          </div>
        </div>
      )}

      {/* Danh sách replies */}
      {showReplies && comment.replies && comment.replies.length > 0 && (
        <div className="ml-0 sm:ml-13 mt-4 space-y-3">
          {comment.replies.map((reply) => (
            <div
              key={reply.id}
              className="bg-gray-50 dark:bg-gray-700/50 rounded border border-gray-200 dark:border-gray-600 p-3"
            >
              <div className="flex items-start gap-3">
                <div className="relative w-10 h-10 rounded-full transition-all duration-200 select-none">
                  <Image
                    src={reply.user.imgUrl || "/images/placeholder.svg"}
                    alt={reply.user.username}
                    fill
                    sizes="36px"
                    className="rounded-full object-cover border-2 border-primary/20"
                  />
                  {reply.user?.vip && (
                    <div className="absolute -top-1 -right-1 h-[14px] w-[14px] bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">★</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        style={{
                          color:
                            reply.user.level?.levelNumber === 1
                              ? reply.user.level?.urlGif
                              : "transparent",
                          backgroundImage:
                            reply.user.level?.levelNumber !== 1
                              ? `url(${reply.user.level?.urlGif})`
                              : "none",
                          backgroundSize:
                            reply.user.level?.levelNumber !== 1
                              ? "auto"
                              : "none",
                          backgroundPosition:
                            reply.user.level?.levelNumber !== 1
                              ? "center"
                              : "none",
                          WebkitBackgroundClip:
                            reply.user.level?.levelNumber !== 1
                              ? "text"
                              : "none",
                        }}
                      >
                        {reply.user.username}
                      </span>
                      {
                        reply.user.level?.color.startsWith('linear-gradient') ? (
                          <Badge
                            className="text-xs bg-white dark:bg-gray-800 border rounded"
                            style={{
                              background: reply.user.level?.color,
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              borderColor: getFirstColorFromGradient(reply.user.level?.color),
                            }}
                          >
                            {reply.user.level?.name}
                          </Badge>
                        ) : (
                          <Badge
                            className="text-xs bg-white dark:bg-gray-800 border rounded"
                            style={{
                              color: reply.user.level?.color,
                              borderColor: reply.user.level?.color,
                            }}
                          >
                            {reply.user.level?.name}
                          </Badge>
                        )
                      }
                      {/* {reply.user.vip && (
                        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-xs">
                          VIP
                        </Badge>
                      )} */}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(reply.createdAt)}
                      </span>
                      {currentUserId === reply.user.id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteComment()}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 h-6 px-1"
                        >
                          <FiTrash2 className="text-xs" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed break-words">
                    {reply.content}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 