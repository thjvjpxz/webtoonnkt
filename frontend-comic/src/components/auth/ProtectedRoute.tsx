"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "@/hooks/useAuthState";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: string[]; // Các role được phép truy cập
  requireVIP?: boolean; // Có yêu cầu VIP không
  redirectTo?: string; // Redirect về đâu nếu không có quyền
  fallback?: ReactNode; // Component hiển thị khi loading
}

export function ProtectedRoute({
  children,
  roles = [],
  requireVIP = false,
  redirectTo = "/",
  fallback
}: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, hasRole, isVIP, user } = useAuthState();

  useEffect(() => {
    if (!isLoading) {
      // Nếu chưa đăng nhập
      if (!isAuthenticated) {
        router.push(redirectTo);
        return;
      }

      // Nếu yêu cầu VIP nhưng user không có VIP
      if (requireVIP && !isVIP()) {
        router.push(redirectTo);
        return;
      }

      // Nếu có yêu cầu role cụ thể nhưng user không có
      if (roles.length > 0 && !hasRole(roles)) {
        router.push(redirectTo);
        return;
      }
    }
  }, [isAuthenticated, isLoading, hasRole, isVIP, router, roles, requireVIP, redirectTo]);

  // Hiển thị loading khi đang kiểm tra authentication
  if (isLoading) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Nếu chưa đăng nhập hoặc không có quyền, không hiển thị gì (đang redirect)
  if (!isAuthenticated) {
    return null;
  }

  if (requireVIP && !isVIP()) {
    return null;
  }

  if (roles.length > 0 && !hasRole(roles)) {
    return null;
  }

  return <>{children}</>;
}

// HOC để wrap component cần protection
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: Omit<ProtectedRouteProps, 'children'>
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}

// Component để hiển thị nội dung dựa trên authentication state
interface ConditionalAuthProps {
  children: ReactNode;
  fallback?: ReactNode;
  roles?: string[];
  requireVIP?: boolean;
}

export function ConditionalAuth({
  children,
  fallback,
  roles = [],
  requireVIP = false
}: ConditionalAuthProps) {
  const { isAuthenticated, hasRole, isVIP } = useAuthState();

  // Kiểm tra điều kiện hiển thị
  const shouldShow = isAuthenticated &&
    (roles.length === 0 || hasRole(roles)) &&
    (!requireVIP || isVIP());

  return shouldShow ? <>{children}</> : <>{fallback}</>;
} 