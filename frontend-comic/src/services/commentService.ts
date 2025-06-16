import { fetchApi } from "./api";
import { CommentResponse, CommentRequest, CommentFilters } from "@/types/comment";

const endpoint = '/comments';

// Lấy danh sách comment với phân trang và bộ lọc (cho admin)
export const getComments = async (
  page: number = 1,
  limit: number = 10,
  filters?: CommentFilters
) => {
  let fullEndpoint = `${endpoint}?page=${page - 1}&limit=${limit}`;

  if (filters?.search) {
    fullEndpoint += `&search=${encodeURIComponent(filters.search)}`;
  }

  if (filters?.comicId) {
    fullEndpoint += `&comicId=${filters.comicId}`;
  }

  if (filters?.chapterId) {
    fullEndpoint += `&chapterId=${filters.chapterId}`;
  }

  if (filters?.userId) {
    fullEndpoint += `&userId=${filters.userId}`;
  }

  if (filters?.status) {
    fullEndpoint += `&status=${filters.status}`;
  }

  return await fetchApi<CommentResponse[]>(fullEndpoint);
};

// Lấy chi tiết comment theo ID
export const getComment = async (id: string) => {
  return await fetchApi<CommentResponse>(`${endpoint}/${id}`);
};

// Tạo comment mới
export const createComment = async (data: CommentRequest) => {
  return await fetchApi<CommentResponse>(endpoint, {
    method: "POST",
    data: data,
  });
};

// Xóa comment (soft delete)
export const deleteComment = async (id: string) => {
  return await fetchApi<string>(`${endpoint}/${id}`, {
    method: "DELETE",
  });
};

// Chặn comment (admin only)
export const blockComment = async (id: string) => {
  return await fetchApi<string>(`${endpoint}/${id}/block`, {
    method: "POST",
  });
};

// Bỏ chặn comment (admin only)
export const unblockComment = async (id: string) => {
  return await fetchApi<string>(`${endpoint}/${id}/unblock`, {
    method: "POST",
  });
};

// Lấy comment theo chapter
export const getCommentsByChapter = async (
  chapterId: string,
  page: number = 1,
  limit: number = 10
) => {
  return await fetchApi<CommentResponse[]>(
    `${endpoint}/chapter/${chapterId}?page=${page - 1}&limit=${limit}`
  );
};

// Đếm comment theo comic
export const countCommentsByComic = async (comicId: string) => {
  return await fetchApi<number>(`${endpoint}/comic/${comicId}/count`);
};

// Đếm comment theo chapter
export const countCommentsByChapter = async (chapterId: string) => {
  return await fetchApi<number>(`${endpoint}/chapter/${chapterId}/count`);
};

// Lấy parent comments theo comic (bao gồm replies)
export const getParentCommentsByComic = async (
  comicId: string,
  page: number = 1,
  limit: number = 10
) => {
  return await fetchApi<CommentResponse[]>(
    `${endpoint}/comic/${comicId}/parents?page=${page - 1}&limit=${limit}`
  );
};

// Lấy replies theo parent comment ID
export const getRepliesByParentId = async (parentId: string) => {
  return await fetchApi<CommentResponse[]>(`${endpoint}/${parentId}/replies`);
};