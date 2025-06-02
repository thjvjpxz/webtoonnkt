"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { isValidToken, getAccessToken, handleInvalidToken } from "@/utils/authUtils";

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * Component AuthGuard để kiểm tra token hợp lệ trên mọi trang
 * Tự động redirect về trang chủ nếu token không hợp lệ
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    // Chỉ kiểm tra khi có user authenticated
    if (isAuthenticated) {
      const token = getAccessToken();

      // Kiểm tra token có hợp lệ không
      if (!isValidToken(token)) {
        console.warn("Token không hợp lệ, đang đăng xuất...");
        logout(); // Đã có redirect trong logout function
      }
    }
  }, [isAuthenticated, logout]);

  // Kiểm tra token khi window focus (user quay lại tab)
  useEffect(() => {
    const handleFocus = () => {
      if (isAuthenticated) {
        const token = getAccessToken();

        if (!isValidToken(token)) {
          console.warn("Token không hợp lệ khi focus window, đang đăng xuất...");
          logout();
        }
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [isAuthenticated, logout]);

  return <>{children}</>;
}

// HOC để wrap component với AuthGuard
export function withAuthGuard<P extends object>(
  Component: React.ComponentType<P>
) {
  return function GuardedComponent(props: P) {
    return (
      <AuthGuard>
        <Component {...props} />
      </AuthGuard>
    );
  };
} 