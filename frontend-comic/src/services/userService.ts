import { UserCreateUpdate, UserResponse, Role } from "@/types/user";
import { LevelResponse, LevelTypeResponse } from "@/types/level";
import { fetchApi, fetchApiWithFormData } from "./api";

const endpoint = '/users';

// Lấy danh sách người dùng với phân trang và tìm kiếm
export const getUsers = async (
  page: number = 1,
  limit: number = 5,
  search?: string,
  role?: string,
  deleted: boolean = false
) => {
  const params: any = { page, limit, search, roleId: role, deleted };

  if (search) {
    params.search = search;
  }

  if (role) {
    params.roleId = role;
  }

  if (deleted) {
    params.deleted = deleted;
  }

  return await fetchApi<UserResponse[]>(endpoint, {
    method: "GET",
    params
  });
};

// Lấy thông tin chi tiết một người dùng
export const getUser = async (
  id: string
) => {
  return await fetchApi<UserResponse>(`${endpoint}/${id}`);
};

// Tạo người dùng mới
export const createUser = async (
  data: UserCreateUpdate
) => {
  return await fetchApi<UserResponse>(endpoint, {
    method: "POST",
    data: data,
  });
};

// Tạo người dùng mới với avatar
export const createUserWithAvatar = async (
  data: UserCreateUpdate,
  file?: File
) => {
  const formData = new FormData();
  formData.append(
    "data",
    new Blob([JSON.stringify(data)], { type: "application/json" })
  );

  if (file) {
    // Thêm file avatar
    formData.append('avatar', file);
  }

  return await fetchApiWithFormData<UserResponse>(endpoint, {
    method: "POST",
    data: formData,
  });
};

// Cập nhật thông tin người dùng
export const updateUser = async (
  id: string,
  data: UserCreateUpdate
) => {
  return await fetchApi<UserResponse>(`${endpoint}/${id}`, {
    method: "PUT",
    data: data,
  });
};

// Cập nhật thông tin người dùng với avatar
export const updateUserWithAvatar = async (
  id: string,
  data: UserCreateUpdate,
  file?: File
) => {
  const formData = new FormData();
  formData.append(
    "data",
    new Blob([JSON.stringify(data)], { type: "application/json" })
  );

  if (file) {
    // Thêm file avatar
    formData.append('avatar', file);
  }

  return await fetchApiWithFormData<UserResponse>(`${endpoint}/${id}`, {
    method: "PUT",
    data: formData,
  });
};

// Xóa người dùng
export const deleteUser = async (
  id: string
) => {
  return await fetchApi<UserResponse>(`${endpoint}/${id}`, {
    method: "DELETE",
  });
};

// Chặn người dùng
export const blockUser = async (
  id: string
) => {
  return await fetchApi<UserResponse>(`${endpoint}/${id}/block`, {
    method: "PUT",
  });
};

// Bỏ chặn người dùng
export const unblockUser = async (
  id: string
) => {
  return await fetchApi<UserResponse>(`${endpoint}/${id}/unblock`, {
    method: "PUT",
  });
};

// Lấy danh sách vai trò
export const getRoles = async () => {
  return await fetchApi<Role[]>('/roles');
};

// Lấy danh sách loại level
export const getAllLevelTypes = async () => {
  return await fetchApi<LevelTypeResponse[]>('/level-types');
};

// Lấy danh sách level theo loại level
export const getLevelsByTypeId = async (levelTypeId: string) => {
  if (!levelTypeId) {
    // Trả về mảng rỗng nếu không có levelTypeId
    return {
      status: 200,
      data: [],
      timestamp: new Date().toISOString()
    };
  }
  return await fetchApi<LevelResponse[]>(`/levels/by-type?levelTypeId=${levelTypeId}`);
};