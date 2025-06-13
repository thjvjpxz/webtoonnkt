
import { Chapter, ChapterCreateUpdate, ChapterWithComicDetail } from "@/types/chapter";
import { fetchApi, fetchApiWithFormData } from "./api";
import { ComicCreateUpdate, ComicResponse } from "@/types/comic";

// ==================== COMIC MANAGEMENT ====================

// Lấy danh sách comic của publisher
export async function getMyComics(
  page: number,
  size: number,
  search?: string,
  status?: string,
  category?: string,
  publisherId?: string
) {
  const params: Record<string, string | number> = { page, size };

  if (search) params.search = search;
  if (status) params.status = status;
  if (category) params.category = category;
  if (publisherId) params.publisherId = publisherId;

  return fetchApi<ComicResponse[]>('/publisher/comics', {
    method: 'GET',
    params
  });
}

// Xóa comic
export async function deleteComic(comicId: string) {
  return fetchApi<void>(`/publisher/comics/${comicId}`, {
    method: 'DELETE'
  });
}

// Tạo comic mới với file upload
export async function createComic(
  data: ComicCreateUpdate,
  file?: File
) {
  const formData = new FormData();
  formData.append(
    "data",
    new Blob([JSON.stringify(data)], { type: "application/json" })
  );
  if (file) {
    formData.append("cover", file);
  }

  return fetchApiWithFormData<ComicResponse>("/publisher/comics", {
    method: "POST",
    data: formData,
  });
}

// Cập nhật comic với file upload
export async function updateComic(
  comicId: string,
  data: ComicCreateUpdate,
  file?: File
) {
  const formData = new FormData();
  formData.append(
    "data",
    new Blob([JSON.stringify(data)], { type: "application/json" })
  );
  if (file) {
    formData.append("cover", file);
  }

  return fetchApiWithFormData<ComicResponse>(`/publisher/comics/${comicId}`, {
    method: "PUT",
    data: formData,
  });
}

// ==================== CHAPTER MANAGEMENT ====================
export async function getChapters(
  page: number,
  limit: number,
  search?: string,
  comicId?: string
) {
  const params: Record<string, string | number> = { page, limit };

  if (search) params.search = search;
  if (comicId) params.comicId = comicId;

  return fetchApi<ChapterWithComicDetail[]>(`/publisher/chapters`, {
    method: 'GET',
    params
  });
}

// Xóa chapter
export async function deleteChapter(chapterId: string) {
  return fetchApi<Chapter>(`/publisher/chapters/${chapterId}`, {
    method: 'DELETE'
  });
}

// Tạo chapter mới
export async function createChapter(
  chapterRequest: ChapterCreateUpdate,
  files: File[]
) {
  const formData = new FormData();
  formData.append("data", new Blob([JSON.stringify(chapterRequest)], { type: "application/json" }));

  files.forEach((file) => {
    formData.append("files", file);
  });

  return fetchApiWithFormData<ChapterWithComicDetail>(`/publisher/chapters`, {
    method: 'POST',
    data: formData
  });
}

// Cập nhật chapter
export async function updateChapter(
  chapterId: string,
  chapterRequest: ChapterCreateUpdate,
  files: File[]
) {
  const formData = new FormData();
  formData.append("data", new Blob([JSON.stringify(chapterRequest)], { type: "application/json" }));

  files.forEach((file) => {
    formData.append("files", file);
  });

  return fetchApiWithFormData<ChapterWithComicDetail>(`/publisher/chapters/${chapterId}`, {
    method: 'PUT',
    data: formData
  });
}