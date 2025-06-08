import { Chapter, ChapterCreateUpdate, ChapterWithComicDetail } from '@/types/chapter'
import { fetchApi, fetchApiWithFormData } from './api';

export const getChapters = async (
  page: number,
  limit: number,
  search?: string,
  comicId?: string
) => {
  let endpoint = `/chapters?page=${page}&limit=${limit}`;

  if (search) {
    endpoint += `&search=${encodeURIComponent(search)}`;
  }

  if (comicId) {
    endpoint += `&comicId=${comicId}`;
  }

  return await fetchApi<ChapterWithComicDetail[]>(endpoint);
}

export const deleteChapter = async (chapterId: string) => {
  return await fetchApi<Chapter>(`/chapters/${chapterId}`, {
    method: "DELETE",
  });
}

export const createChapter = async (
  chapterRequest: ChapterCreateUpdate,
  files: File[]
) => {
  const formData = new FormData();
  formData.append("data", new Blob([JSON.stringify(chapterRequest)], { type: "application/json" }));
  files.forEach((file) => {
    formData.append("files", file);
  });
  return await fetchApiWithFormData<ChapterWithComicDetail>("/chapters", {
    method: "POST",
    data: formData,
  });
}

export const updateChapter = async (
  chapterId: string,
  chapterRequest: ChapterCreateUpdate,
  files: File[]
) => {
  const formData = new FormData();
  formData.append("data", new Blob([JSON.stringify(chapterRequest)], { type: "application/json" }));
  files.forEach((file) => {
    formData.append("files", file);
  });
  return await fetchApiWithFormData<ChapterWithComicDetail>(`/chapters/${chapterId}`, {
    method: "PUT",
    data: formData,
  });
}

// API riêng cho publisher để lấy chapters của mình
export const getMyChapters = async (
  page: number,
  limit: number,
  search?: string,
  comicId?: string
) => {
  let endpoint = `/publisher/chapters?page=${page}&limit=${limit}`;

  if (search) {
    endpoint += `&search=${encodeURIComponent(search)}`;
  }

  if (comicId) {
    endpoint += `&comicId=${comicId}`;
  }

  return await fetchApi<ChapterWithComicDetail[]>(endpoint);
}

