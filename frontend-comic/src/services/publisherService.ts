import { ApiResponse } from "@/types/api";
import {
  PublisherComicRequest,
  PublisherComicResponse,
  PublisherStatsResponse,
  WithdrawalRequest,
  WithdrawalRequestDto
} from "@/types/publisher";
import { Chapter, ChapterCreateUpdate } from "@/types/chapter";
import { fetchApi, fetchApiWithFormData } from "./api";

// ==================== DASHBOARD ====================

// Lấy thống kê publisher
export async function getPublisherStats(): Promise<ApiResponse<PublisherStatsResponse>> {
  return fetchApi<PublisherStatsResponse>('/publisher/stats', {
    method: 'GET'
  });
}

// Lấy số dư khả dụng
export async function getAvailableBalance(): Promise<ApiResponse<number>> {
  return fetchApi<number>('/publisher/balance', {
    method: 'GET'
  });
}

// ==================== COMIC MANAGEMENT ====================

// Lấy danh sách comic của publisher
export async function getMyComics(
  search: string = '',
  status: string = '',
  category: string = '',
  page: number = 0,
  size: number = 10
): Promise<ApiResponse<PublisherComicResponse[]>> {
  const params: Record<string, string | number> = { page, size };

  // Chỉ thêm param nếu có giá trị
  if (search.trim()) {
    params.search = search.trim();
  }
  if (status) {
    params.status = status;
  }
  if (category) {
    params.category = category;
  }

  return fetchApi<PublisherComicResponse[]>('/publisher/comics', {
    method: 'GET',
    params
  });
}

// Lấy chi tiết comic của publisher
export async function getMyComic(comicId: string): Promise<ApiResponse<PublisherComicResponse>> {
  return fetchApi<PublisherComicResponse>(`/publisher/comics/${comicId}`, {
    method: 'GET'
  });
}

// Tạo comic mới với file upload
export async function createComicWithCover(
  data: PublisherComicRequest,
  file?: File
): Promise<ApiResponse<PublisherComicResponse>> {
  const formData = new FormData();
  formData.append(
    "data",
    new Blob([JSON.stringify(data)], { type: "application/json" })
  );
  if (file) {
    formData.append("cover", file);
  }

  return fetchApiWithFormData<PublisherComicResponse>("/publisher/comics", {
    method: "POST",
    data: formData,
  });
}

// Cập nhật comic với file upload
export async function updateComicWithCover(
  comicId: string,
  data: PublisherComicRequest,
  file?: File
): Promise<ApiResponse<PublisherComicResponse>> {
  const formData = new FormData();
  formData.append(
    "data",
    new Blob([JSON.stringify(data)], { type: "application/json" })
  );
  if (file) {
    formData.append("cover", file);
  }

  return fetchApiWithFormData<PublisherComicResponse>(`/publisher/comics/${comicId}`, {
    method: "PUT",
    data: formData,
  });
}

// Xóa comic
export async function deleteComic(comicId: string): Promise<ApiResponse<void>> {
  return fetchApi<void>(`/publisher/comics/${comicId}`, {
    method: 'DELETE'
  });
}

// ==================== CHAPTER MANAGEMENT ====================

// Lấy danh sách chapter theo comic
export async function getChaptersByComic(
  comicId: string,
  page: number = 0,
  limit: number = 20
): Promise<ApiResponse<Chapter[]>> {
  return fetchApi<Chapter[]>(`/publisher/comics/${comicId}/chapters`, {
    method: 'GET',
    params: { page, limit }
  });
}

// Tạo chapter mới
export async function createChapter(
  comicId: string,
  chapterData: ChapterCreateUpdate
): Promise<ApiResponse<Chapter>> {
  return fetchApi<Chapter>(`/publisher/comics/${comicId}/chapters`, {
    method: 'POST',
    data: chapterData
  });
}

// Cập nhật chapter
export async function updateChapter(
  chapterId: string,
  chapterData: ChapterCreateUpdate
): Promise<ApiResponse<Chapter>> {
  return fetchApi<Chapter>(`/publisher/chapters/${chapterId}`, {
    method: 'PUT',
    data: chapterData
  });
}

// Xóa chapter
export async function deleteChapter(chapterId: string): Promise<ApiResponse<void>> {
  return fetchApi<void>(`/publisher/chapters/${chapterId}`, {
    method: 'DELETE'
  });
}

// ==================== WITHDRAWAL ====================

// Tạo yêu cầu rút tiền
export async function createWithdrawalRequest(
  requestData: WithdrawalRequestDto
): Promise<ApiResponse<WithdrawalRequest>> {
  return fetchApi<WithdrawalRequest>('/publisher/withdrawal', {
    method: 'POST',
    data: requestData
  });
}

// Lấy danh sách yêu cầu rút tiền
export async function getMyWithdrawalRequests(
  page: number = 0,
  limit: number = 10
): Promise<ApiResponse<WithdrawalRequest[]>> {
  return fetchApi<WithdrawalRequest[]>('/publisher/withdrawal', {
    method: 'GET',
    params: { page, limit }
  });
} 