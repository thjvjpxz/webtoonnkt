'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { CheckCircle, XCircle } from 'lucide-react';
import { verifyEmail, resendVerifyEmail } from '@/services/authService';
import { LoginRequest } from '@/types/auth';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { UserResponse } from '@/types/user';
import Main from '@/components/layout/Main';


function VerifyPageContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const emailParam = searchParams.get('email');

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserResponse | null>(null);
  const [showResendForm, setShowResendForm] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCredentials, setResendCredentials] = useState<LoginRequest>({
    username: '',
    password: ''
  });

  useEffect(() => {
    const handleVerification = async () => {
      // Kiểm tra token có tồn tại không
      if (!token) {
        setError('Token không hợp lệ. Vui lòng kiểm tra email của bạn.');
        setIsLoading(false);
        return;
      }

      try {
        const result = await verifyEmail(token);
        if (result.status === 200) {
          setUser(result.data || null);
          toast.success('Xác minh email thành công! Bạn có thể đăng nhập ngay bây giờ.');
        } else {
          setError(result.message || 'Đã xảy ra lỗi không xác định.');
        }
      } catch (error) {
        console.error('Lỗi xác minh:', error);
        setError('Đã xảy ra lỗi trong quá trình xác minh. Vui lòng thử lại sau.');
        toast.error('Đã xảy ra lỗi trong quá trình xác minh. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };

    handleVerification();
  }, [token]);

  const handleResendVerification = async () => {
    if (!resendCredentials.username.trim() || !resendCredentials.password.trim()) {
      toast.error("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu");
      return;
    }

    setIsResending(true);
    try {
      const response = await resendVerifyEmail(resendCredentials);

      if (response.status === 200) {
        toast.success("Email xác thực đã được gửi lại! Vui lòng kiểm tra hộp thư của bạn.");
        setShowResendForm(false);
        setResendCredentials({ username: '', password: '' });
      } else {
        toast.error(response.message || "Không thể gửi lại email xác thực");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Đã xảy ra lỗi khi gửi email";
      toast.error(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  const handleInputChange = (field: keyof LoginRequest, value: string) => {
    setResendCredentials(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <LoadingSpinner className="h-16 w-16 mx-auto mb-4" />
            <CardTitle className="text-2xl font-bold">
              Đang xác minh email...
            </CardTitle>
            <CardDescription>
              Vui lòng chờ trong giây lát...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {user ? (
            <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
          ) : (
            <XCircle className="h-16 w-16 mx-auto mb-4 text-red-500" />
          )}

          <CardTitle className="text-2xl font-bold">
            {user ? 'Xác minh thành công!' : 'Xác minh thất bại'}
          </CardTitle>

          <CardDescription className="text-center">
            {error || (user ? 'Email đã được xác minh thành công.' : 'Đã xảy ra lỗi không xác định.')}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Hiển thị thông tin user nếu xác minh thành công */}
          {user && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <h3 className="font-medium text-green-800 dark:text-green-200 mb-2">Thông tin tài khoản:</h3>
              <div className="space-y-1 text-sm text-green-700 dark:text-green-300">
                <p><span className="font-medium">Tên đăng nhập:</span> {user.username}</p>
                <p><span className="font-medium">Email:</span> {user.email}</p>
                <p><span className="font-medium">Trạng thái:</span> Đã xác minh</p>
              </div>
            </div>
          )}

          {/* Hiển thị form gửi lại email khi xác minh thất bại */}
          {!user && error && (
            <div className="space-y-4">
              {/* Thông báo lỗi và tùy chọn gửi lại */}
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="text-sm text-red-800 dark:text-red-200">
                  <p className="font-medium mb-1">Xác minh thất bại</p>
                  <p className="mb-3">{error}</p>
                  {emailParam && (
                    <p className="text-xs">Email: {emailParam}</p>
                  )}
                </div>
              </div>

              {/* Form gửi lại email xác thực */}
              {!showResendForm ? (
                <div className="space-y-3">
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      Token có thể đã hết hạn hoặc không hợp lệ. Bạn có thể gửi lại email xác thực.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowResendForm(true)}
                    className="w-full"
                  >
                    Gửi lại email xác thực
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Tên đăng nhập</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Nhập tên đăng nhập"
                      value={resendCredentials.username}
                      onChange={(e) => handleInputChange("username", e.target.value)}
                      disabled={isResending}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Mật khẩu</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Nhập mật khẩu"
                      value={resendCredentials.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      disabled={isResending}
                    />
                  </div>

                  <div className="space-y-3">
                    <Button
                      onClick={handleResendVerification}
                      disabled={isResending || !resendCredentials.username.trim() || !resendCredentials.password.trim()}
                      className="w-full"
                    >
                      {isResending ? "Đang gửi..." : "Gửi lại email xác thực"}
                    </Button>

                    <Button
                      variant="ghost"
                      onClick={() => {
                        setShowResendForm(false);
                        setResendCredentials({ username: '', password: '' });
                      }}
                      disabled={isResending}
                      className="w-full"
                    >
                      Hủy
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button asChild className="flex-1">
              <Link href="/">
                Quay lại trang chủ
              </Link>
            </Button>
            {user && (
              <Button asChild variant="outline" className="flex-1">
                <Link href="/?login=true">
                  Đăng nhập ngay
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <Main>
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <LoadingSpinner size="lg" />
              <p className="text-gray-600 dark:text-gray-400 mt-4">Đang tải trang xác minh...</p>
            </div>
          </div>
        </Main>
      }
    >
      <VerifyPageContent />
    </Suspense>
  );
}