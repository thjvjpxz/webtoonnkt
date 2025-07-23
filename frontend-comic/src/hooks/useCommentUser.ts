import { useState, useEffect, useCallback } from "react";
import { CommentResponse, CommentRequest } from "@/types/comment";
import {
  getCommentsByChapter,
  getParentCommentsByComic,
  getRepliesByParentId,
  createComment,
  deleteComment,
  countCommentsByComic,
  countCommentsByChapter,
} from "@/services/commentService";
import toast from "react-hot-toast";

interface UseCommentUserProps {
  comicId?: string;
  chapterId?: string;
  mode: "comic" | "chapter";
}

export function useCommentUser({ comicId, chapterId, mode }: UseCommentUserProps) {
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [totalComments, setTotalComments] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [showReplies, setShowReplies] = useState<Record<string, boolean>>({});
  const [newComment, setNewComment] = useState("");
  const [replyContent, setReplyContent] = useState("");

  const limit = 10;

  // Lấy danh sách comment
  const fetchComments = useCallback(async (page = 1) => {
    if (!comicId) return;

    setIsLoading(true);
    try {
      let response;

      if (mode === "comic") {
        response = await getParentCommentsByComic(comicId, page, limit);
      } else if (mode === "chapter" && chapterId) {
        response = await getCommentsByChapter(chapterId, page, limit);
      } else {
        return;
      }

      if (response.status === 200 && response.data) {
        setComments(response.data);
        setTotalPages(Math.ceil(response.data.length / limit));
      }
    } catch (error) {
      console.error("Lỗi khi tải comment:", error);
      toast.error("Không thể tải bình luận");
    } finally {
      setIsLoading(false);
    }
  }, [comicId, chapterId, mode, limit]);

  // Đếm tổng số comment
  const fetchCommentCount = useCallback(async () => {
    if (!comicId) return;

    try {
      let response;

      if (mode === "comic") {
        response = await countCommentsByComic(comicId);
      } else if (mode === "chapter" && chapterId) {
        response = await countCommentsByChapter(chapterId);
      } else {
        return;
      }

      if (response.status === 200 && typeof response.data === "number") {
        setTotalComments(response.data);
      }
    } catch (error) {
      console.error("Lỗi khi đếm comment:", error);
    }
  }, [comicId, chapterId, mode]);

  // Load replies cho một comment
  const loadReplies = useCallback(async (parentId: string) => {
    try {
      const response = await getRepliesByParentId(parentId);

      if (response.status === 200 && response.data) {
        setComments(prev => prev.map(comment =>
          comment.id === parentId
            ? { ...comment, replies: response.data }
            : comment
        ));
      }
    } catch (error) {
      console.error("Lỗi khi tải phản hồi:", error);
      toast.error("Không thể tải phản hồi");
    }
  }, []);

  // Toggle show/hide replies
  const toggleReplies = useCallback(async (commentId: string, hasReplies: boolean) => {
    if (!showReplies[commentId] && hasReplies) {
      await loadReplies(commentId);
    }
    setShowReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  }, [showReplies, loadReplies]);

  // Tạo comment mới
  const submitComment = useCallback(async () => {
    if (!newComment.trim() || !comicId) return;

    setIsSubmitting(true);
    try {
      const commentData: CommentRequest = {
        content: newComment.trim(),
        comicId,
        ...(mode === "chapter" && chapterId && { chapterId })
      };

      const response = await createComment(commentData);

      if (response.status === 200) {
        toast.success("Đăng bình luận thành công!");
        setNewComment("");
        await fetchComments(1);
        await fetchCommentCount();
        setCurrentPage(1);
      } else {
        toast.error(response.message || "Không thể đăng bình luận");
      }
    } catch (error) {
      console.error("Lỗi khi đăng comment:", error);
      toast.error("Có lỗi xảy ra khi đăng bình luận");
    } finally {
      setIsSubmitting(false);
    }
  }, [newComment, comicId, chapterId, mode, fetchComments, fetchCommentCount]);

  // Phản hồi comment
  const submitReply = useCallback(async (parentId: string) => {
    if (!replyContent.trim() || !comicId) return;

    setIsSubmitting(true);
    try {
      const replyData: CommentRequest = {
        content: replyContent.trim(),
        comicId,
        parentId,
        ...(mode === "chapter" && chapterId && { chapterId })
      };

      const response = await createComment(replyData);

      if (response.status === 200) {
        toast.success("Phản hồi thành công!");
        setReplyContent("");
        setReplyingTo(null);
        await loadReplies(parentId);
        await fetchCommentCount();
      } else {
        toast.error(response.message || "Không thể gửi phản hồi");
      }
    } catch (error) {
      console.error("Lỗi khi phản hồi:", error);
      toast.error("Có lỗi xảy ra khi gửi phản hồi");
    } finally {
      setIsSubmitting(false);
    }
  }, [replyContent, comicId, chapterId, mode, loadReplies, fetchCommentCount]);

  // Xóa comment
  const handleDeleteComment = useCallback(async (commentId: string) => {
    try {
      const response = await deleteComment(commentId);

      if (response.status === 200) {
        toast.success("Xóa bình luận thành công!");
        await fetchComments(currentPage);
        await fetchCommentCount();
      } else {
        toast.error(response.message || "Không thể xóa bình luận");
      }
    } catch (error) {
      console.error("Lỗi khi xóa comment:", error);
      toast.error("Có lỗi xảy ra khi xóa bình luận");
    }
  }, [fetchComments, fetchCommentCount, currentPage]);

  // Thay đổi trang
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    fetchComments(page);
  }, [fetchComments]);

  // Bắt đầu phản hồi
  const startReply = useCallback((commentId: string) => {
    setReplyingTo(commentId);
    setReplyContent("");
  }, []);

  // Hủy phản hồi
  const cancelReply = useCallback(() => {
    setReplyingTo(null);
    setReplyContent("");
  }, []);

  // Load dữ liệu ban đầu
  useEffect(() => {
    if (comicId) {
      fetchComments(1);
      fetchCommentCount();
      setCurrentPage(1);
    }
  }, [comicId, chapterId, mode, fetchComments, fetchCommentCount]);

  return {
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
  };
} 