import { CategoryCreateUpdate, CategoryResponse } from "@/types/category";
import { ApiResponse } from "@/types/api";
import { fetchApi } from "./api";

// Lấy danh sách thể loại có phân trang
export const getCategories = async (
  page: number = 1,
  limit: number = 5,
  search?: string
): Promise<ApiResponse<CategoryResponse[]>> => {
  let endpoint = `/categories?page=${page}&limit=${limit}`;

  if (search) {
    endpoint += `&search=${encodeURIComponent(search)}`;
  }

  return await fetchApi<ApiResponse<CategoryResponse[]>>(endpoint);
};

// Lấy chi tiết một thể loại
export const getCategory = async (
  id: number
): Promise<ApiResponse<CategoryResponse>> => {
  return await fetchApi<ApiResponse<CategoryResponse>>(`/categories/${id}`);
};

// Tạo thể loại mới
export const createCategory = async (
  data: CategoryCreateUpdate
): Promise<ApiResponse<CategoryResponse>> => {
  return await fetchApi<ApiResponse<CategoryResponse>>("/categories", {
    method: "POST",
    data: data,
  });
};

// Cập nhật thể loại
export const updateCategory = async (
  id: string,
  data: CategoryCreateUpdate
): Promise<ApiResponse<CategoryResponse>> => {
  return await fetchApi<ApiResponse<CategoryResponse>>(`/categories/${id}`, {
    method: "PUT",
    data: data,
  });
};

// Xóa thể loại
export const deleteCategory = async (
  id: string
): Promise<ApiResponse<null>> => {
  return await fetchApi<ApiResponse<null>>(`/categories/${id}`, {
    method: "DELETE",
  });
};
