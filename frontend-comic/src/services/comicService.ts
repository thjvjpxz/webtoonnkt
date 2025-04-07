import { ComicCreateUpdate, ComicResponse } from "@/types/comic";
import { ApiResponse } from "@/types/api";
import { fetchApi, fetchApiWithFormData } from "./api";

// Lấy danh sách truyện có phân trang
export const getComics = async (
  page: number = 1,
  limit: number = 5,
  search?: string,
  status?: string,
  category?: string
): Promise<ApiResponse<ComicResponse[]>> => {
  let endpoint = `/comics?page=${page}&limit=${limit}`;

  if (search) {
    endpoint += `&search=${encodeURIComponent(search)}`;
  }

  if (status) {
    endpoint += `&status=${status}`;
  }

  if (category) {
    endpoint += `&category=${category}`;
  }

  return await fetchApi<ApiResponse<ComicResponse[]>>(endpoint);
};

// Lấy chi tiết một truyện
export const getComic = async (
  id: string
): Promise<ApiResponse<ComicResponse>> => {
  return await fetchApi<ApiResponse<ComicResponse>>(`/comics/${id}`);
};

// Xóa truyện
export const deleteComic = async (id: string): Promise<ApiResponse<null>> => {
  return await fetchApi<ApiResponse<null>>(`/comics/${id}`, {
    method: "DELETE",
  });
};

// Tạo truyện mới với ảnh bìa
export const createComicWithCover = async (
  data: ComicCreateUpdate,
  file?: File
): Promise<ApiResponse<ComicResponse>> => {
  const formData = new FormData();
  formData.append(
    "data",
    new Blob([JSON.stringify(data)], { type: "application/json" })
  );
  if (file) {
    formData.append("cover", file);
  }

  return await fetchApiWithFormData<ApiResponse<ComicResponse>>("/comics", {
    method: "POST",
    body: formData,
  });
};

// Cập nhật truyện với ảnh bìa
export const updateComicWithCover = async (
  id: string,
  data: ComicCreateUpdate,
  file?: File
): Promise<ApiResponse<ComicResponse>> => {
  const formData = new FormData();
  formData.append(
    "data",
    new Blob([JSON.stringify(data)], { type: "application/json" })
  );
  if (file) {
    formData.append("cover", file);
  }

  return await fetchApiWithFormData<ApiResponse<ComicResponse>>(
    `/comics/${id}`,
    {
      method: "PUT",
      body: formData,
    }
  );
};
