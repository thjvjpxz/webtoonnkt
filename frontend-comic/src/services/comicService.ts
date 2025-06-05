import { ComicCreateUpdate, ComicResponse } from "@/types/comic";
import { fetchApi, fetchApiWithFormData } from "./api";
import { ApiResponse } from '@/types/api';

// Lấy danh sách truyện có phân trang
export async function getComics(
  search: string = '',
  page: number = 0,
  limit: number = 10,
  status: string = '',
  category: string = '',
  publisherId?: string
): Promise<ApiResponse<ComicResponse[]>> {
  const params: any = { search, page, limit };

  if (status) params.status = status;
  if (category) params.category = category;
  if (publisherId) params.publisherId = publisherId;

  return fetchApi<ComicResponse[]>('/comics', {
    method: 'GET',
    params
  });
}

// Lấy chi tiết một truyện
export async function getComic(id: string): Promise<ApiResponse<ComicResponse>> {
  return fetchApi<ComicResponse>(`/comics/${id}`);
}

// Xóa truyện
export async function deleteComic(id: string): Promise<ApiResponse<void>> {
  return fetchApi<void>(`/comics/${id}`, {
    method: 'DELETE'
  });
}

// Tạo truyện mới với ảnh bìa
export const createComicWithCover = async (
  data: ComicCreateUpdate,
  file?: File
) => {
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
export const updateComicWithCover = async (
  id: string,
  data: ComicCreateUpdate,
  file?: File
) => {
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

// Hàm mới để lấy comics của publisher hiện tại
export async function getMyComics(
  search: string = '',
  page: number = 0,
  limit: number = 10,
  status: string = '',
  category: string = ''
): Promise<ApiResponse<ComicResponse[]>> {
  return fetchApi<ComicResponse[]>('/publisher/comics', {
    method: 'GET',
    params: { search, page, limit, status, category }
  });
}
