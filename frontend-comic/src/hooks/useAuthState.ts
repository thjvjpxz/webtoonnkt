import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { LoginRequest, RegisterRequest } from "@/types/auth";
import { login as loginAPI, register as registerAPI, resendVerifyEmail } from "@/services/authService";
import toast from "react-hot-toast";

export function useAuthState() {
  const {
    login: authLogin,
    logout: authLogout,
    user,
    isAuthenticated,
    isLoading,
  } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [unverifiedCredentials, setUnverifiedCredentials] = useState<LoginRequest | null>(null);

  // Login với better error handling
  const login = useCallback(async (credentials: LoginRequest): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      const response = await loginAPI(credentials);

      if (response.status === 200 && response.data) {
        authLogin(response.data);
        setUnverifiedCredentials(null); // Xóa thông tin đăng nhập chưa xác thực
        return true;
      } else {
        // Kiểm tra nếu tài khoản chưa được kích hoạt
        if (response.message?.includes("Tài khoản chưa được kích hoạt")) {
          setUnverifiedCredentials(credentials); // Lưu thông tin đăng nhập để gửi lại email
          toast.error("Tài khoản chưa được kích hoạt. Vui lòng kiểm tra email để xác thực tài khoản.");
        } else {
          toast.error(response.message || "Đăng nhập thất bại");
        }
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

  // Gửi lại email xác thực
  const resendVerification = useCallback(async (): Promise<boolean> => {
    if (!unverifiedCredentials) {
      toast.error("Không có thông tin tài khoản để gửi lại email xác thực");
      return false;
    }

    setIsResendingEmail(true);
    try {
      const response = await resendVerifyEmail(unverifiedCredentials);

      if (response.status === 200) {
        toast.success("Email xác thực đã được gửi lại! Vui lòng kiểm tra hộp thư của bạn.");
        return true;
      } else {
        toast.error(response.message || "Không thể gửi lại email xác thực");
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Đã xảy ra lỗi khi gửi email";
      toast.error(errorMessage);
      return false;
    } finally {
      setIsResendingEmail(false);
    }
  }, [unverifiedCredentials]);

  // Xóa thông tin tài khoản chưa xác thực
  const clearUnverifiedCredentials = useCallback(() => {
    setUnverifiedCredentials(null);
  }, []);



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
    }
  }, [authLogout]);

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
    isResendingEmail,
    unverifiedCredentials,

    // Actions
    login,
    register,
    logout,
    resendVerification,
    clearUnverifiedCredentials,

    // Helper functions
    hasRole,
    isAdmin,
    isVIP,
    isPublisher,
    isReader,
  };
} 