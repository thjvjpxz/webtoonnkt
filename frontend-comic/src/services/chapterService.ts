import { ChapterCreateUpdate, ChapterWithComicDetail } from '@/types/chapter'
import { fetchApi, fetchApiWithFormData } from './api';

export const getChapters = async (
  page: number,
  limit: number,
  search?: string,
  comicId?: string
) => {
  const params: Record<string, string | number> = { page, limit };

  if (search) params.search = search;
  if (comicId) params.comicId = comicId;

  return await fetchApi<ChapterWithComicDetail[]>(`/chapters`, {
    method: "GET",
    params
  });
}

export const deleteChapter = async (chapterId: string) => {
  return await fetchApi<void>(`/chapters/${chapterId}`, {
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