import { ApiResponse } from '@/types/api';
import { Chapter, ChapterCreateUpdate } from '@/types/chapter'
import { fetchApi, fetchApiWithFormData } from './api';

export const getChapters = async (
  page: number,
  limit: number,
  search?: string,
  comicId?: string
): Promise<ApiResponse<Chapter[]>> => {
  let endpoint = `/chapters?page=${page}&limit=${limit}`;

  if (search) {
    endpoint += `&search=${encodeURIComponent(search)}`;
  }

  if (comicId) {
    endpoint += `&comicId=${comicId}`;
  }

  return await fetchApi<ApiResponse<Chapter[]>>(endpoint);
}

export const deleteChapter = async (chapterId: string): Promise<ApiResponse<Chapter>> => {
  return await fetchApi<ApiResponse<Chapter>>(`/chapters/${chapterId}`, {
    method: "DELETE",
  });
}

export const createChapter = async (
  chapterRequest: ChapterCreateUpdate,
  files: File[]
): Promise<ApiResponse<Chapter>> => {
  const formData = new FormData();
  formData.append("data", new Blob([JSON.stringify(chapterRequest)], { type: "application/json" }));
  files.forEach((file) => {
    formData.append("files", file);
  });
  return await fetchApiWithFormData<ApiResponse<Chapter>>("/chapters", {
    method: "POST",
    data: formData,
  });
}

export const updateChapter = async (
  chapterId: string,
  chapterRequest: ChapterCreateUpdate,
  files: File[]
): Promise<ApiResponse<Chapter>> => {
  console.log(chapterRequest);
  const formData = new FormData();
  formData.append("data", new Blob([JSON.stringify(chapterRequest)], { type: "application/json" }));
  files.forEach((file) => {
    formData.append("files", file);
  });
  return await fetchApiWithFormData<ApiResponse<Chapter>>(`/chapters/${chapterId}`, {
    method: "PUT",
    data: formData,
  });
}

