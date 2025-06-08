"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { LoginResponse } from "@/types/auth";
import { handleLogout, handleRedirectToHome } from "@/utils/authUtils";
import { refreshTokenService } from "@/services/authService";

interface User {
  id: string;
  username: string;
  imgUrl: string;
  vip: boolean;
  role: {
    id: string;
    name: string;
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (loginResponse: LoginResponse) => void;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
  isTokenExpired: () => boolean;
  redirectToHome: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hàm redirect về trang chủ
  const redirectToHome = useCallback(() => {
    handleRedirectToHome();
  }, []);

  // Kiểm tra token có hết hạn không
  const isTokenExpired = useCallback(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return true;

    try {
      // Decode JWT token để kiểm tra thời gian hết hạn
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;

      // Kiểm tra nếu token sắp hết hạn trong 5 phút tới
      return payload.exp <= (currentTime + 300);
    } catch (error) {
      console.error("Lỗi khi kiểm tra token:", error);
      return true;
    }
  }, []);

  // Logout function - đặt trước refreshToken để tránh lỗi "used before declaration"
  const logout = useCallback(() => {
    handleLogout();
  }, [redirectToHome]);

  // Refresh token function
  const refreshToken = useCallback(async (): Promise<boolean> => {
    const refreshTokenValue = localStorage.getItem("refreshToken");
    if (!refreshTokenValue) {
      // Không có refresh token, redirect về trang chủ
      logout();
      return false;
    }

    try {
      const response = await refreshTokenService(refreshTokenValue);

      if (response.status === 200) {
        const data = response.data;
        localStorage.setItem("accessToken", data?.accessToken || "");
        if (data?.refreshToken) {
          localStorage.setItem("refreshToken", data.refreshToken);
        }
        return true;
      } else {
        logout();
        return false;
      }
    } catch (error) {
      console.error("Lỗi khi refresh token:", error);
      // Lỗi khi refresh, đăng xuất và redirect
      logout();
      return false;
    }
  }, [logout]);

  // Kiểm tra và auto refresh token
  const checkAndRefreshToken = useCallback(async () => {
    if (isTokenExpired()) {
      const refreshed = await refreshToken();
      if (!refreshed) {
        setUser(null);
      }
    }
  }, [isTokenExpired, refreshToken]);

  // Kiểm tra token trong localStorage khi component mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("accessToken");
      const userData = localStorage.getItem("user");

      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);

          // Kiểm tra token có hết hạn không
          if (isTokenExpired()) {
            // Thử refresh token
            const refreshed = await refreshToken();
            if (refreshed) {
              setUser(parsedUser);
            }
            // Nếu refresh thất bại, logout() đã được gọi trong refreshToken()
          } else {
            setUser(parsedUser);
          }
        } catch (error) {
          console.error("Lỗi khi parse user data:", error);
          // Xóa dữ liệu không hợp lệ và redirect
          logout();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, [isTokenExpired, refreshToken, logout]);

  // Auto refresh token mỗi 4 phút
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      checkAndRefreshToken();
    }, 4 * 60 * 1000); // 4 phút

    return () => clearInterval(interval);
  }, [user, checkAndRefreshToken]);

  // Lắng nghe focus window để check token
  useEffect(() => {
    const handleFocus = () => {
      if (user) {
        checkAndRefreshToken();
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [user, checkAndRefreshToken]);

  const login = (loginResponse: LoginResponse) => {
    // Lưu tokens vào localStorage
    localStorage.setItem("accessToken", loginResponse.accessToken);
    localStorage.setItem("refreshToken", loginResponse.refreshToken);

    // Tạo user object từ response
    const userData: User = {
      id: loginResponse.id,
      username: loginResponse.username,
      imgUrl: loginResponse.imgUrl,
      vip: loginResponse.vip,
      role: loginResponse.role,
    };

    // Lưu user data vào localStorage và state
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    refreshToken,
    isTokenExpired,
    redirectToHome,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook để sử dụng auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
} 