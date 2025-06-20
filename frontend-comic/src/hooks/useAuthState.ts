import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { LoginRequest, RegisterRequest } from "@/types/auth";
import { login as loginAPI, register as registerAPI, refreshTokenService, resendVerifyEmail } from "@/services/authService";
import toast from "react-hot-toast";

export function useAuthState() {
  const {
    login: authLogin,
    logout: authLogout,
    user,
    isAuthenticated,
    isLoading,
    updateUserFromRefresh,
    isTokenExpired,
    setUserData
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

  // Refresh token với better error handling
  const refreshToken = useCallback(async (): Promise<boolean> => {
    const refreshTokenValue = localStorage.getItem("refreshToken");
    if (!refreshTokenValue) {
      // Không có refresh token, logout
      authLogout();
      return false;
    }

    try {
      const response = await refreshTokenService(refreshTokenValue);

      if (response.status === 200 && response.data) {
        updateUserFromRefresh(response.data);
        return true;
      } else {
        // Refresh token thất bại, logout
        authLogout();
        return false;
      }
    } catch (error) {
      console.error("Lỗi khi refresh token:", error);
      // Lỗi khi refresh, đăng xuất
      authLogout();
      return false;
    }
  }, [updateUserFromRefresh, authLogout]);

  // Kiểm tra và auto refresh token
  const checkAndRefreshToken = useCallback(async () => {
    if (isTokenExpired()) {
      const refreshed = await refreshToken();
      if (!refreshed) {
        setUserData(null);
      }
    }
  }, [isTokenExpired, refreshToken, setUserData]);

  // Kiểm tra token khi app khởi động và user đã có trong localStorage
  useEffect(() => {
    if (!isLoading && user && isTokenExpired()) {
      checkAndRefreshToken();
    }
  }, [isLoading, user, isTokenExpired, checkAndRefreshToken]);

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
    refreshToken,
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