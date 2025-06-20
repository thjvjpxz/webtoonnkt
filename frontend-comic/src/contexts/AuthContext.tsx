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
import { handleLogout } from "@/utils/authUtils";

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
  updateUserFromRefresh: (loginResponse: LoginResponse) => void;
  isTokenExpired: () => boolean;
  setUserData: (userData: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  // Logout function
  const logout = useCallback(() => {
    handleLogout();
    setUser(null);
  }, []);

  // Cập nhật user data từ refresh token response
  const updateUserFromRefresh = useCallback((loginResponse: LoginResponse) => {
    localStorage.setItem("accessToken", loginResponse.accessToken);

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

    if (loginResponse.refreshToken) {
      localStorage.setItem("refreshToken", loginResponse.refreshToken);
    }
  }, []);

  // Set user data (dùng cho các tình huống khác)
  const setUserData = useCallback((userData: User | null) => {
    setUser(userData);
  }, []);

  // Kiểm tra token trong localStorage khi component mount
  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem("accessToken");
      const userData = localStorage.getItem("user");

      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

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
    // Reload page
    window.location.reload();
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUserFromRefresh,
    isTokenExpired,
    setUserData
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