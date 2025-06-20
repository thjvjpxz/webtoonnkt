// Service cơ bản để gọi API
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse } from '@/types/api';
import { getAccessToken, getRefreshToken, handleLogout } from '@/utils/authUtils';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Tạo instance axios
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Biến để theo dõi việc refresh token
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

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

// Hàm refresh token
const refreshToken = async (): Promise<string | null> => {
  try {
    const refreshTokenValue = getRefreshToken();
    if (!refreshTokenValue) {
      return null;
    }

    const response = await axios.post(`${API_URL}/auth/refresh`, {
      refreshToken: refreshTokenValue
    });

    if (response.data?.status === 200 && response.data?.data) {
      const loginData = response.data.data;

      // Lưu token mới vào localStorage
      localStorage.setItem('accessToken', loginData.accessToken);
      if (loginData.refreshToken) {
        localStorage.setItem('refreshToken', loginData.refreshToken);
      }

      // Cập nhật user data nếu có
      if (loginData.id && loginData.username) {
        const userData = {
          id: loginData.id,
          username: loginData.username,
          imgUrl: loginData.imgUrl,
          vip: loginData.vip,
          role: loginData.role,
        };
        localStorage.setItem('user', JSON.stringify(userData));
      }

      return loginData.accessToken;
    }

    return null;
  } catch (error) {
    console.error('Lỗi khi refresh token:', error);
    return null;
  }
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
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Nếu đang refresh token, thêm request vào queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return axiosInstance(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshToken();

        if (newToken) {
          // Token refresh thành công
          processQueue(null, newToken);
          originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
          return axiosInstance(originalRequest);
        } else {
          // Refresh token thất bại
          processQueue(error, null);
          toast.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
          await new Promise((resolve) => setTimeout(resolve, 1000));
          handleLogout();
          return Promise.reject(error);
        }
      } catch (refreshError) {
        // Lỗi khi refresh token
        processQueue(refreshError, null);
        toast.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
        await new Promise((resolve) => setTimeout(resolve, 1000));
        handleLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
