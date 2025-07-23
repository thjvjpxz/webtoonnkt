'use client'

import Main from "@/components/layout/Main";
import Sidebar from "@/components/layout/Sidebar";
import SidebarSkeletonComponent from "@/components/layout/SidebarSkeletonComponent";
import CategoryComicsGrid from "@/components/layout/ComicsGrid";
import Pagination from "@/components/ui/pagination";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { getHistoryComic } from "@/services/homeService";
import { PopulerToday } from "@/types/home";
import useHome from "@/hooks/useHome";
import { useEffect, useState } from "react";
import { FiClock, FiHome } from "react-icons/fi";
import { Breadcrumb, BreadcrumbPage, BreadcrumbItem, BreadcrumbList, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";
import { useAuthState } from "@/hooks/useAuthState";
import { useRouter } from "next/navigation";

export default function HistoryPage() {
  const { isAuthenticated } = useAuthState();
  const router = useRouter();

  const [comics, setComics] = useState<PopulerToday[]>([]);
  const [isLoadingComics, setIsLoadingComics] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const pageSize = 10; // Số comics mỗi trang

  // Sử dụng hook useHome để lấy dữ liệu cho sidebar
  const {
    populerWeek,
    populerMonth,
    populerAll,
    categories,
    isLoading: isLoadingSidebar,
  } = useHome();

  // Redirect nếu chưa đăng nhập
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!isAuthenticated) return;

      try {
        setIsLoadingComics(true);
        setError(null);
        const response = await getHistoryComic(currentPage, pageSize);

        if (response.status === 200 && response.data) {
          setComics(response.data);
          setTotalPages(response.totalPages || 1);
        } else {
          setComics([]);
          setTotalPages(1);
          if (response.status === 401) {
            setError("Vui lòng đăng nhập để xem lịch sử đọc");
          } else {
            setError(response.message || "Không thể tải lịch sử đọc truyện");
          }
        }
      } catch (error) {
        setComics([]);
        setTotalPages(1);
        setError("Đã xảy ra lỗi khi tải lịch sử đọc truyện");
        console.error('Lỗi khi fetch history:', error);
      } finally {
        setIsLoadingComics(false);
      }
    }

    fetchHistory();
  }, [currentPage, pageSize, isAuthenticated]);

  // Xử lý thay đổi trang
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top khi chuyển trang
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Không render gì nếu chưa đăng nhập (để tránh flash)
  if (!isAuthenticated) {
    return null;
  }

  // Empty state khi không có lịch sử đọc
  if (comics.length === 0 && !isLoadingComics && !error) {
    return (
      <Main>
        <div className="mt-4 sm:mt-6 lg:mt-8 flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Main content - Empty State */}
          <div className="flex-1 min-w-0">
            <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 shadow-sm">
              <h2 className="text-lg font-bold p-4 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                Lịch sử đọc truyện
              </h2>
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <FiClock className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Chưa có lịch sử đọc
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
                    Bạn chưa đọc truyện nào.
                    Hãy bắt đầu khám phá và đọc những bộ truyện hay nhé!
                  </p>
                  <Link
                    href="/"
                    className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
                  >
                    <FiHome className="w-4 h-4 mr-2" />
                    Khám phá truyện
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 xl:w-96 flex-shrink-0">
            {isLoadingSidebar ? (
              <SidebarSkeletonComponent />
            ) : (
              <Sidebar
                populerWeek={populerWeek}
                populerMonth={populerMonth}
                populerAll={populerAll}
                categories={categories}
              />
            )}
          </div>
        </div>
      </Main>
    );
  }

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
                  <FiClock className="w-4 h-4" />
                  Lịch sử đọc truyện
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Main content - Comics Grid */}
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

            {/* Loading state cho grid */}
            {isLoadingComics ? (
              <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 shadow-sm">
                <h2 className="text-lg font-bold p-4 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                  Lịch sử đọc truyện
                </h2>
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <LoadingSpinner size="lg" />
                    <p className="text-gray-600 dark:text-gray-400 mt-4">Đang tải lịch sử đọc...</p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <CategoryComicsGrid
                  comics={comics}
                  categoryName="Lịch sử đọc truyện"
                />

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-6">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 xl:w-96 flex-shrink-0">
            {isLoadingSidebar ? (
              <SidebarSkeletonComponent />
            ) : (
              <Sidebar
                populerWeek={populerWeek}
                populerMonth={populerMonth}
                populerAll={populerAll}
                categories={categories}
              />
            )}
          </div>
        </div>
      </div>
    </Main>
  )
} 