import React from "react";
import { useCommentUser } from "@/hooks/useCommentUser";
import CommentItem from "./CommentItem";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Pagination from "@/components/ui/pagination";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { FiMessageCircle, FiEdit3 } from "react-icons/fi";

interface CommentSectionProps {
  comicId: string;
  chapterId?: string;
  currentUserId?: string;
  mode: "comic" | "chapter";
  title?: string;
}

export default function CommentSection({
  comicId,
  chapterId,
  currentUserId,
  mode,
  title
}: CommentSectionProps) {
  const {
    // Data
    comments,
    totalComments,
    currentPage,
    totalPages,
    replyingTo,
    showReplies,
    newComment,
    replyContent,

    // Loading states
    isLoading,
    isSubmitting,

    // Setters
    setNewComment,
    setReplyContent,

    // Actions
    submitComment,
    submitReply,
    handleDeleteComment,
    handlePageChange,
    startReply,
    cancelReply,
    toggleReplies,
  } = useCommentUser({ comicId, chapterId, mode });

  const sectionTitle = title || (mode === "comic" ? "Bình luận truyện" : "Bình luận chapter");

  return (
    <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <FiMessageCircle className="text-primary text-sm sm:text-base" />
          {sectionTitle}
          {totalComments > 0 && (
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
              ({totalComments})
            </span>
          )}
        </h2>
      </div>

      <div className="p-4">
        {/* Form tạo comment mới */}
        {currentUserId && (
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded border border-gray-200 dark:border-gray-600">
            <div className="flex items-center gap-2 mb-3">
              <FiEdit3 className="text-primary text-sm" />
              <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                Viết bình luận mới
              </span>
            </div>
            <Textarea
              placeholder={mode === "comic" ? "Chia sẻ cảm nghĩ của bạn về bộ truyện này..." : "Chia sẻ cảm nghĩ của bạn về chapter này..."}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="mb-3 min-h-[100px] border-gray-300 dark:border-gray-600 focus:border-primary text-sm sm:text-base rounded"
              disabled={isSubmitting}
            />
            <div className="flex justify-end">
              <Button
                onClick={submitComment}
                disabled={isSubmitting || !newComment.trim()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isSubmitting ? "Đang đăng..." : "Đăng bình luận"}
              </Button>
            </div>
          </div>
        )}

        {/* Danh sách comments */}
        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <FiMessageCircle className="mx-auto text-4xl mb-4 opacity-50" />
            <p className="text-lg font-medium">Chưa có bình luận nào</p>
            <p className="text-sm mt-2">
              {currentUserId
                ? "Hãy là người đầu tiên bình luận!"
                : "Đăng nhập để bình luận"
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                currentUserId={currentUserId}
                isReplyingTo={replyingTo === comment.id}
                showReplies={showReplies[comment.id] || false}
                replyContent={replyContent}
                isSubmitting={isSubmitting}
                mode={mode}
                onStartReply={() => startReply(comment.id)}
                onCancelReply={cancelReply}
                onSubmitReply={() => submitReply(comment.id)}
                onDeleteComment={() => handleDeleteComment(comment.id)}
                onToggleReplies={() => toggleReplies(comment.id, (comment.repliesCount || 0) > 0)}
                onReplyContentChange={setReplyContent}
              />
            ))}
          </div>
        )}

        {/* Phân trang */}
        {!isLoading && comments.length > 0 && totalPages > 1 && (
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
} 