'use client'

import ChangePasswordModal from "@/components/auth/ChangePasswordModal";
import EditProfileModal from "@/components/profile/EditProfileModal";
import Main from "@/components/layout/Main";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuthState } from "@/hooks/useAuthState";
import { getProfile } from "@/services/homeService";
import { UserResponse } from "@/types/user";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { FiCalendar, FiDollarSign, FiEdit3, FiHome, FiKey, FiMail, FiShield, FiStar, FiTrendingUp, FiUser } from "react-icons/fi";

export default function ProfilePage() {
  const { isAuthenticated } = useAuthState();
  const router = useRouter();

  const [userProfile, setUserProfile] = useState<UserResponse | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  // Redirect nếu chưa đăng nhập
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }
  }, [isAuthenticated, router]);

  // Function để fetch profile (có thể tái sử dụng)
  const fetchProfile = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setIsLoadingProfile(true);
      setError(null);
      const response = await getProfile();

      if (response.status === 200 && response.data) {
        setUserProfile(response.data);
      } else {
        if (response.status === 401) {
          setError("Vui lòng đăng nhập để xem thông tin cá nhân");
        } else {
          setError(response.message || "Không thể tải thông tin cá nhân");
        }
      }
    } catch (error) {
      setError("Đã xảy ra lỗi khi tải thông tin cá nhân");
      console.error('Lỗi khi fetch profile:', error);
    } finally {
      setIsLoadingProfile(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Callback để refetch profile sau khi cập nhật
  const handleProfileUpdated = () => {
    fetchProfile();
  };

  // Không render gì nếu chưa đăng nhập (để tránh flash)
  if (!isAuthenticated) {
    return null;
  }

  // Format ngày tháng
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Tính phần trăm EXP
  const getExpPercentage = () => {
    if (!userProfile?.level || !userProfile?.currentExp) return 0;
    return Math.min((userProfile.currentExp / userProfile.level.expRequired) * 100, 100);
  };

  return (
    <Main>
      <div className="my-4 sm:my-6 lg:my-8">
        {/* Breadcrumb Navigation */}
        <div className="mb-4 sm:mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/" className="flex items-center gap-1">
                    <FiHome className="w-4 h-4" />
                    Trang chủ
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="flex items-center gap-1">
                  <FiUser className="w-4 h-4" />
                  Hồ sơ cá nhân
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Error state */}
            {error && (
              <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 shadow-sm mb-6">
                <div className="p-6 text-center">
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                    <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                      Thử lại
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Loading state */}
            {isLoadingProfile ? (
              <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 shadow-sm">
                <h2 className="text-lg font-bold p-4 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                  Hồ sơ cá nhân
                </h2>
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <LoadingSpinner size="lg" />
                    <p className="text-gray-600 dark:text-gray-400 mt-4">Đang tải thông tin cá nhân...</p>
                  </div>
                </div>
              </div>
            ) : userProfile ? (
              <div className="space-y-6">
                {/* Profile Header */}
                <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      {/* Avatar */}
                      <div className="relative">
                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-primary/20">
                          {userProfile.imgUrl ? (
                            <Image
                              src={userProfile.imgUrl}
                              alt={userProfile.username}
                              width={128}
                              height={128}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                              <FiUser className="w-12 h-12 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                        {userProfile.vip && (
                          <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800">
                            <FiStar className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>

                      {/* User Info */}
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <h1 className="text-2xl font-bold mb-2 text-center sm:text-left">
                              <span
                                style={{
                                  color:
                                    userProfile.level?.levelNumber === 1
                                      ? userProfile.level?.urlGif
                                      : "transparent",
                                  backgroundImage:
                                    userProfile.level?.levelNumber !== 1
                                      ? `url(${userProfile.level?.urlGif})`
                                      : "none",
                                  backgroundSize:
                                    userProfile.level?.levelNumber !== 1
                                      ? "auto"
                                      : "none",
                                  backgroundPosition:
                                    userProfile.level?.levelNumber !== 1
                                      ? "center"
                                      : "none",
                                  WebkitBackgroundClip:
                                    userProfile.level?.levelNumber !== 1
                                      ? "text"
                                      : "none",
                                }}
                              >
                                {userProfile.username}
                              </span>
                            </h1>
                            <div className="flex flex-wrap items-center gap-3">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${userProfile.role.name === 'ADMIN'
                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                }`}>
                                {userProfile.role.name === 'ADMIN' ? 'Quản trị viên' : 'Thành viên'}
                              </span>
                              {userProfile.vip && (
                                <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                                  VIP
                                </span>
                              )}
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${userProfile.active
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                }`}>
                                {userProfile.active ? 'Hoạt động' : 'Không hoạt động'}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowEditProfileModal(true)}
                            >
                              <FiEdit3 className="w-4 h-4 mr-2" />
                              Chỉnh sửa
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowChangePasswordModal(true)}
                            >
                              <FiKey className="w-4 h-4 mr-2" />
                              Đổi mật khẩu
                            </Button>
                          </div>
                        </div>

                        {/* Level Progress */}
                        {userProfile.level && (
                          <div className="mt-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Cấp độ: {userProfile.level.name}
                              </span>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {userProfile.currentExp}/{userProfile.level.expRequired} EXP
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className="h-2 rounded-full transition-all duration-300"
                                style={{
                                  width: `${getExpPercentage()}%`,
                                  backgroundColor: userProfile.level.color || '#3b82f6'
                                }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Thông tin cá nhân */}
                  <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 shadow-sm">
                    <h3 className="text-lg font-bold p-4 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                      Thông tin cá nhân
                    </h3>
                    <div className="p-4 space-y-4">
                      <div className="flex items-center gap-3">
                        <FiMail className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                          <p className="font-medium text-gray-900 dark:text-gray-100">{userProfile.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <FiCalendar className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Ngày tham gia</p>
                          <p className="font-medium text-gray-900 dark:text-gray-100">{formatDate(userProfile.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <FiShield className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Vai trò</p>
                          <p className="font-medium text-gray-900 dark:text-gray-100">{userProfile.role.description || userProfile.role.name}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Thống kê */}
                  <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 shadow-sm">
                    <h3 className="text-lg font-bold p-4 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                      Thống kê
                    </h3>
                    <div className="p-4 space-y-4">
                      <div className="flex items-center gap-3">
                        <FiDollarSign className="w-5 h-5 text-yellow-500" />
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Số dư</p>
                          <p className="font-medium text-gray-900 dark:text-gray-100">{userProfile.balance?.toLocaleString() || 0} coin</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <FiTrendingUp className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Kinh nghiệm</p>
                          <p className="font-medium text-gray-900 dark:text-gray-100">{userProfile.currentExp || 0} EXP</p>
                        </div>
                      </div>
                      {userProfile.lastTopup && (
                        <div className="flex items-center gap-3">
                          <FiCalendar className="w-5 h-5 text-green-500" />
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Nạp tiền gần nhất</p>
                            <p className="font-medium text-gray-900 dark:text-gray-100">{formatDate(userProfile.lastTopup.toString())}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Level Info */}
                {userProfile.level && (
                  <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 shadow-sm">
                    <h3 className="text-lg font-bold p-4 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                      Thông tin cấp độ
                    </h3>
                    <div className="p-4">
                      <div className="flex items-center gap-4">
                        {userProfile.level.urlGif && (
                          <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                            <Image
                              src={userProfile.level.urlGif}
                              alt={userProfile.level.name}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                            {userProfile.level.name} (Cấp {userProfile.level.levelNumber})
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                            Loại: {userProfile.level.levelType.name}
                          </p>
                          <div className="flex items-center gap-4 text-sm">
                            <span style={{ color: userProfile.level.color }} className="font-medium">
                              Màu đặc trưng
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>

        </div>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
      />

      {userProfile && (
        <EditProfileModal
          isOpen={showEditProfileModal}
          onClose={() => setShowEditProfileModal(false)}
          userProfile={userProfile}
          onProfileUpdated={handleProfileUpdated}
        />
      )}
    </Main>
  )
}
