/**
 * Utility functions cho xử lý authentication
 */

import { AUTH_PUBLIC_PATHS } from '@/config/app.config';

// Kiểm tra token có hợp lệ không (format và không expired)
export function isValidToken(token: string | null): boolean {
  if (!token) return false;

  try {
    // Kiểm tra format JWT token
    const parts = token.split('.');
    if (parts.length !== 3) return false;

    // Decode payload để kiểm tra expiration
    const payload = JSON.parse(atob(parts[1]));
    const currentTime = Date.now() / 1000;

    // Token hợp lệ nếu chưa hết hạn
    return payload.exp > currentTime;
  } catch (error) {
    console.error("Lỗi khi kiểm tra token:", error);
    return false;
  }
}

// Kiểm tra token sắp hết hạn (trong vòng 5 phút)
export function isTokenExpiringSoon(token: string | null): boolean {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;

    // Token sắp hết hạn nếu còn ít hơn 5 phút
    return payload.exp <= (currentTime + 300);
  } catch (error) {
    console.error("Lỗi khi kiểm tra token expiring:", error);
    return true;
  }
}

// Xóa tất cả dữ liệu authentication khỏi localStorage
export function clearAuthData(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
}

// Redirect về trang chủ
export function redirectToHome(): void {
  if (typeof window !== 'undefined') {
    if (AUTH_PUBLIC_PATHS.some(path => window.location.pathname.startsWith(path))) {
      return;
    }
    // Nếu không phải đang ở trang chủ thì redirect về trang chủ
    if (window.location.pathname !== '/') {
      window.location.href = '/';
    } else {
      // Nếu đã ở trang chủ thì reload để reset state
      window.location.reload();
    }
  }
}

// Xử lý khi token hết hạn hoặc không hợp lệ
export function handleInvalidToken(): void {
  clearAuthData();
  redirectToHome();
}

// Lấy user data từ localStorage với error handling
export function getUserFromStorage(): any | null {
  if (typeof window === 'undefined') return null;

  try {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Lỗi khi parse user data từ localStorage:", error);
    // Xóa dữ liệu không hợp lệ
    localStorage.removeItem('user');
    return null;
  }
}

// Lấy access token từ localStorage
export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
}

// Lấy refresh token từ localStorage
export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('refreshToken');
} 