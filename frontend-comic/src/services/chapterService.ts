import { ApiResponse, ChapterCreateUpdate, ChapterResponse } from "@/types/api";
import { fetchApi, fetchApiWithFormData } from "./api";

// Lấy danh sách chapter của một truyện
export const getChaptersByComic = async (
  comicId: string,
  page: number = 1,
  limit: number = 10
): Promise<ApiResponse<ChapterResponse[]>> => {
  return await fetchApi<ApiResponse<ChapterResponse[]>>(
    `/comics/${comicId}/chapters?page=${page}&limit=${limit}`
  );
};

// Lấy chi tiết một chapter
export const getChapter = async (
  id: string
): Promise<ApiResponse<ChapterResponse>> => {
  return await fetchApi<ApiResponse<ChapterResponse>>(`/chapters/${id}`);
};

// Tạo chapter mới với nhiều ảnh
export const createChapter = async (
  data: ChapterCreateUpdate,
  files: File[]
): Promise<ApiResponse<ChapterResponse>> => {
  const formData = new FormData();
  formData.append(
    "data",
    new Blob([JSON.stringify(data)], { type: "application/json" })
  );

  files.forEach((file) => {
    formData.append("file", file);
  });

  return await fetchApiWithFormData<ApiResponse<ChapterResponse>>("/chapters", {
    method: "POST",
    body: formData,
  });
};

// Cập nhật chapter
export const updateChapter = async (
  id: string,
  data: ChapterCreateUpdate,
  files?: File[]
): Promise<ApiResponse<ChapterResponse>> => {
  const formData = new FormData();
  formData.append(
    "data",
    new Blob([JSON.stringify(data)], { type: "application/json" })
  );

  if (files && files.length > 0) {
    files.forEach((file) => {
      formData.append("file", file);
    });
  }

  return await fetchApiWithFormData<ApiResponse<ChapterResponse>>(
    `/chapters/${id}`,
    {
      method: "PUT",
      body: formData,
    }
  );
};

// Xóa chapter
export const deleteChapter = async (id: string): Promise<ApiResponse<null>> => {
  return await fetchApi<ApiResponse<null>>(`/chapters/${id}`, {
    method: "DELETE",
  });
}; 