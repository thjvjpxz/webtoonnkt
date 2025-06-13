// Service cơ bản để gọi API
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { ApiResponse } from '@/types/api';
import { getAccessToken, handleLogout } from '@/utils/authUtils';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Tạo instance axios
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const handleApiError = (error: unknown): string => {
  if (error instanceof AxiosError) {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }

    // Lỗi HTTP status
    if (error.response?.status) {
      switch (error.response.status) {
        case 400:
          return "Dữ liệu không hợp lệ";
        case 401:
          return "Không có quyền truy cập";
        case 403:
          return "Bị cấm truy cập";
        case 404:
          return "Không tìm thấy";
        case 500:
          return "Lỗi server";
        default:
          return "Có lỗi xảy ra";
      }
    }

    // Lỗi kết nối
    if (error.request) {
      return "Không thể kết nối đến server";
    }
  }

  // Lỗi khác
  return error instanceof Error ? error.message : "Đã xảy ra lỗi";
};

// Hàm fetch API chính
export const fetchApi = async <T>(
  endpoint: string,
  options: AxiosRequestConfig = {}
): Promise<ApiResponse<T>> => {
  try {
    const response = await axiosInstance({
      url: endpoint,
      ...options,
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data) {
      return error.response.data;
    }

    const errorMessage = handleApiError(error);
    console.error(`API Error [${endpoint}]:`, errorMessage);
    throw new Error(errorMessage);
  }
};

// Hàm fetch API với FormData
export const fetchApiWithFormData = async <T>(
  endpoint: string,
  options: AxiosRequestConfig = {}
): Promise<ApiResponse<T>> => {
  try {
    const config: AxiosRequestConfig = {
      url: endpoint,
      ...options,
      headers: {
        ...options.headers,
        'Content-Type': 'multipart/form-data',
      },
    };

    const response = await axiosInstance(config);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data) {
      return error.response.data;
    }

    const errorMessage = handleApiError(error);
    console.error(`API Error [${endpoint}]:`, errorMessage);
    throw new Error(errorMessage);
  }
};

// Request interceptor để thêm token vào header
axiosInstance.interceptors.request.use(
  (config) => {
    // Thêm token vào header nếu có
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor để xử lý token hết hạn
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      
      toast.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
      await new Promise((resolve) => setTimeout(resolve, 3000));
      handleLogout();
    }
    return Promise.reject(error);
  }
);
