'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Lock, CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react';
import { resetPassword, checkResetPasswordToken } from '@/services/authService';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import Main from '@/components/layout/Main';

interface ResetPasswordForm {
  password: string;
  confirmPassword: string;
}

function ResetPasswordContent() {
  const token = useSearchParams().get('token');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const [isCheckingToken, setIsCheckingToken] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
  } = useForm<ResetPasswordForm>();

  const password = watch('password');

  // Kiểm tra tính hợp lệ của token khi component mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsTokenValid(false);
        setIsCheckingToken(false);
        return;
      }

      try {
        const result = await checkResetPasswordToken(token);

        if (result.status === 200) {
          setIsTokenValid(true);
        } else {
          setIsTokenValid(false);
          toast.error(result.message || 'Token không hợp lệ hoặc đã hết hạn.');
        }
      } catch (error) {
        console.error('Lỗi kiểm tra token:', error);
        setIsTokenValid(false);
        toast.error('Không thể xác thực token. Vui lòng thử lại.');
      } finally {
        setIsCheckingToken(false);
      }
    };

    validateToken();
  }, [token]);

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!token) {
      toast.error('Token không hợp lệ. Vui lòng kiểm tra liên kết trong email.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await resetPassword(token, data.password, data.confirmPassword);

      if (result.status === 200) {
        setIsSuccess(true);
        toast.success('Mật khẩu đã được đặt lại thành công!');
      } else {
        setError('password', {
          type: 'manual',
          message: result.message || 'Đã xảy ra lỗi khi đặt lại mật khẩu.',
        });
        toast.error(result.message || 'Đã xảy ra lỗi. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Lỗi đặt lại mật khẩu:', error);
      toast.error('Đã xảy ra lỗi trong quá trình xử lý. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  // Hiển thị loading khi đang kiểm tra token
  if (isCheckingToken) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <LoadingSpinner size="lg" className="mx-auto mb-4" />
            <CardTitle className="text-2xl font-bold">
              Đang xác thực...
            </CardTitle>
            <CardDescription>
              Vui lòng chờ trong khi chúng tôi xác thực liên kết đặt lại mật khẩu của bạn.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Kiểm tra token không hợp lệ
  if (!token || isTokenValid === false) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <XCircle className="h-16 w-16 mx-auto mb-4 text-red-500" />
            <CardTitle className="text-2xl font-bold">
              Liên kết không hợp lệ
            </CardTitle>
            <CardDescription>
              Token không tồn tại hoặc đã hết hạn. Vui lòng yêu cầu đặt lại mật khẩu mới.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <Button asChild>
                <Link href="/">
                  Yêu cầu đặt lại mật khẩu
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/">
                  Quay lại trang chủ
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Hiển thị thành công
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
            <CardTitle className="text-2xl font-bold">
              Đặt lại mật khẩu thành công!
            </CardTitle>
            <CardDescription>
              Mật khẩu của bạn đã được cập nhật. Bạn có thể đăng nhập với mật khẩu mới.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <Button asChild>
                <Link href="/">
                  Đăng nhập ngay
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/">
                  Quay lại trang chủ
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Lock className="h-16 w-16 mx-auto mb-4 text-primary" />
          <CardTitle className="text-2xl font-bold text-primary">
            Đặt lại mật khẩu
          </CardTitle>
          <CardDescription>
            Nhập mật khẩu mới cho tài khoản của bạn
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu mới</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Nhập mật khẩu mới"
                  disabled={isLoading}
                  {...register('password', {
                    required: 'Mật khẩu là bắt buộc',
                    minLength: {
                      value: 6,
                      message: 'Mật khẩu phải có ít nhất 6 ký tự',
                    },
                  })}
                  className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Nhập lại mật khẩu mới"
                  disabled={isLoading}
                  {...register('confirmPassword', {
                    required: 'Xác nhận mật khẩu là bắt buộc',
                    validate: (value) =>
                      value === password || 'Mật khẩu xác nhận không khớp',
                  })}
                  className={errors.confirmPassword ? 'border-red-500 pr-10' : 'pr-10'}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <LoadingSpinner className="h-4 w-4 mr-2" />
                  Đang cập nhật...
                </>
              ) : (
                'Đặt lại mật khẩu'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              ← Quay lại trang chủ
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <Main>
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <LoadingSpinner size="lg" />
              <p className="text-gray-600 dark:text-gray-400 mt-4">Đang tải trang đặt lại mật khẩu...</p>
            </div>
          </div>
        </Main>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
} 