import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { LoginRequest, RegisterRequest } from "@/types/auth";
import { login as loginAPI, register as registerAPI } from "@/services/authService";
import toast from "react-hot-toast";

export function useAuthState() {
  const { login: authLogin, logout: authLogout, user, isAuthenticated, isLoading, redirectToHome, refreshToken: authRefreshToken } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Login với better error handling
  const login = useCallback(async (credentials: LoginRequest): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      const response = await loginAPI(credentials);

      if (response.status === 200 && response.data) {
        authLogin(response.data);
        toast.success("Đăng nhập thành công!");
        return true;
      } else {
        toast.error(response.message || "Đăng nhập thất bại");
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Đã xảy ra lỗi";
      toast.error(errorMessage);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [authLogin]);

  // Re-login with refresh token
  const refreshToken = useCallback(async (): Promise<boolean> => {
    const response = await authRefreshToken();
    return response;
  }, [authRefreshToken]);

  // Register với better error handling
  const register = useCallback(async (credentials: RegisterRequest): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      const response = await registerAPI(credentials);

      if (response.status === 200) {
        toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
        return true;
      } else {
        toast.error(response.message || "Đăng ký thất bại");
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Đã xảy ra lỗi";
      toast.error(errorMessage);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  // Logout với confirmation
  const logout = useCallback(() => {
    try {
      authLogout();
      toast.success("Đã đăng xuất thành công");
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
      toast.error("Có lỗi xảy ra khi đăng xuất");
      redirectToHome();
    }
  }, [authLogout, redirectToHome]);

  // Kiểm tra quyền của user
  const hasRole = useCallback((roleNames: string[]): boolean => {
    if (!user?.role?.name) return false;
    return roleNames.includes(user.role.name);
  }, [user]);

  // Kiểm tra user có phải admin không
  const isAdmin = useCallback((): boolean => {
    return hasRole(["ADMIN"]);
  }, [hasRole]);

  // Kiểm tra user có phải publisher không
  const isPublisher = useCallback((): boolean => {
    return hasRole(["PUBLISHER"]);
  }, [hasRole]);

  const isReader = useCallback((): boolean => {
    return hasRole(["READER"]);
  }, [hasRole]);

  // Kiểm tra user có phải VIP không
  const isVIP = useCallback((): boolean => {
    return user?.vip || false;
  }, [user]);

  return {
    // User state
    user,
    isAuthenticated,
    isLoading,
    isSubmitting,

    // Actions
    login,
    register,
    logout,
    refreshToken,

    // Helper functions
    hasRole,
    isAdmin,
    isVIP,
    isPublisher,
    isReader,
  };
} 