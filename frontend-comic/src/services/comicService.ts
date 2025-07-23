import { ComicCreateUpdate, ComicResponse } from "@/types/comic";
import { fetchApi, fetchApiWithFormData } from "./api";

// Lấy danh sách truyện có phân trang
export async function getComics(
  page: number,
  limit: number,
  search?: string,
  status?: string,
  category?: string,
  publisherId?: string
) {
  const params: Record<string, string | number> = { page, limit };

  if (search) params.search = search;
  if (status) params.status = status;
  if (category) params.category = category;
  if (publisherId) params.publisherId = publisherId;

  return fetchApi<ComicResponse[]>('/comics', {
    method: 'GET',
    params
  });
}

// Lấy chi tiết một truyện
export async function getComic(id: string) {
  return fetchApi<ComicResponse>(`/comics/${id}`);
}

// Xóa truyện
export async function deleteComic(id: string) {
  return fetchApi<void>(`/comics/${id}`, {
    method: 'DELETE'
  });
}

// Tạo truyện mới với ảnh bìa
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

  return await fetchApiWithFormData<ComicResponse>("/comics", {
    method: "POST",
    data: formData,
  });
};

// Cập nhật truyện với ảnh bìa
export async function updateComic(
  id: string,
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

  return await fetchApiWithFormData<ComicResponse>(
    `/comics/${id}`,
    {
      method: "PUT",
      data: formData,
    }
  );
};
