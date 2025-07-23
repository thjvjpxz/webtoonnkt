import { LoginRequest, LoginResponse, RegisterRequest } from "@/types/auth";
import { fetchApi } from "./api";
import { UserResponse } from "@/types/user";

/**
 * Đăng nhập
 * @param request - Thông tin đăng nhập
 * @returns LoginResponse
 */
export const login = async (request: LoginRequest) => {
  const url = '/auth/login';
  const response = await fetchApi<LoginResponse>(url, {
    method: 'POST',
    data: request,
  });

  return response;
};

/**
 * Đăng ký
 * @param request - Thông tin đăng ký
 * @returns UserResponse
 */
export const register = async (request: RegisterRequest) => {
  const url = '/auth/register';
  const response = await fetchApi<UserResponse>(url, {
    method: 'POST',
    data: request,
  });

  return response;
}

/**
 * Xác thực email
 * @param token - Token xác thực
 * @returns UserResponse
 */
export const verifyEmail = async (token: string) => {
  const url = `/auth/verify?token=${token}`;
  const response = await fetchApi<UserResponse>(url, {
    method: 'GET',
  });

  return response;
};

/**
 * Làm mới token
 * @param refreshToken - Token làm mới
 * @returns LoginResponse
 */
export const refreshTokenService = async (refreshToken: string) => {
  const url = '/auth/refresh';
  const response = await fetchApi<LoginResponse>(url, {
    method: 'POST',
    data: { refreshToken },
  });

  return response;
};

/**
 * Quên mật khẩu
 * @param email - Email của người dùng
 * @returns void
 */
export const forgotPassword = async (email: string) => {
  const url = '/auth/forgot-password';
  const response = await fetchApi<void>(url, {
    method: 'POST',
    data: { email },
  });

  return response;
}

/**
 * Đặt lại mật khẩu
 * @param token - Token xác thực
 * @param newPassword - Mật khẩu mới
 * @param confirmPassword - Mật khẩu xác nhận
 * @returns void
 */
export const resetPassword = async (token: string, password: string, confirmPassword: string) => {
  const url = '/auth/reset-password';
  const response = await fetchApi<void>(url, {
    method: 'POST',
    data: { token, password, confirmPassword },
  });
  return response;
}

/**
 * Kiểm tra token đặt lại mật khẩu có hết hạn không
 * @param token - Token đặt lại mật khẩu
 * @returns void
 */
export const checkResetPasswordToken = async (token: string) => {
  const url = `/auth/check-reset-password-token-expired?token=${token}`;
  const response = await fetchApi<void>(url, {
    method: 'GET',
  });
  return response;
}

/**
 * Gửi lại email xác thực
 * @param body - Thông tin gửi lại email xác thực
 * @returns void
 */
export const resendVerifyEmail = async (body: LoginRequest) => {
  const url = '/auth/resend-verification-email';
  const response = await fetchApi<void>(url, {
    method: 'POST',
    data: body,
  });
  return response;
}
