// Service cơ bản để gọi API
import axios, { AxiosError, AxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Tạo instance axios
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Hàm xử lý lỗi chung
const handleError = (error: unknown) => {
  console.error("API Error:", error);

  if (error instanceof AxiosError) {
    if (error.response) {
      // Lỗi từ server với response
      return {
        success: false,
        data: null,
        error: error.response.data?.message || "Lỗi từ server",
      };
    } else if (error.request) {
      // Lỗi không nhận được response
      return {
        success: false,
        data: null,
        error: "Không thể kết nối đến server",
      };
    }
  }

  // Lỗi khác
  const errorMessage = error instanceof Error ? error.message : "Đã xảy ra lỗi";
  return {
    success: false,
    data: null,
    error: errorMessage,
  };
};

// Hàm fetch API chung với axios
export const fetchApi = async <T>(
  endpoint: string,
  options: AxiosRequestConfig = {}
): Promise<T> => {
  try {
    const response = await axiosInstance({
      url: endpoint,
      ...options,
    });

    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

// Hàm fetch API với FormData
export const fetchApiWithFormData = async <T>(
  endpoint: string,
  options: AxiosRequestConfig = {}
): Promise<T> => {
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
    throw handleError(error);
  }
};

// Thêm interceptor để xử lý token nếu cần
axiosInstance.interceptors.request.use(
  (config) => {
    // Có thể thêm token vào header ở đây nếu cần
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => Promise.reject(error)
);
