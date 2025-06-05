'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { CheckCircle, XCircle } from 'lucide-react';
import { verifyEmail } from '@/services/authService';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { UserResponse } from '@/types/user';
import Main from '@/components/layout/Main';

function VerifyPageContent() {
  const token = useSearchParams().get('token');

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserResponse | null>(null);

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
        } else {
          setError(result.message || 'Đã xảy ra lỗi không xác định.');
        }
      } catch (error) {
        console.error('Lỗi xác minh:', error);
        toast.error('Đã xảy ra lỗi trong quá trình xác minh. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };

    handleVerification();
  }, [token]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
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

        <CardContent>
          {/* Hiển thị thông tin user nếu xác minh thành công */}
          {user && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="font-medium text-green-800 mb-2">Thông tin tài khoản:</h3>
              <div className="space-y-1 text-sm text-green-700">
                <p><span className="font-medium">Tên đăng nhập:</span> {user.username}</p>
                <p><span className="font-medium">Email:</span> {user.email}</p>
                <p><span className="font-medium">Trạng thái:</span> Đã xác minh</p>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button asChild className="flex-1">
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