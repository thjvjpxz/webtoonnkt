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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Logout function
  const logout = useCallback(() => {
    handleLogout();
    setUser(null);
  }, []);

  // Cập nhật user data khi token được refresh
  const updateUserFromStorage = useCallback(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Lỗi khi parse user data:', error);
        logout();
      }
    }
  }, [logout]);



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
  };

  // Lắng nghe storage changes để cập nhật user khi refresh token
  useEffect(() => {
    const handleStorageChange = () => {
      updateUserFromStorage();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [updateUserFromStorage]);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
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