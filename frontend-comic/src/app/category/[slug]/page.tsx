'use client'

import Main from "@/components/layout/Main";
import Sidebar from "@/components/layout/Sidebar";
import SidebarSkeletonComponent from "@/components/layout/SidebarSkeletonComponent";
import CategoryComicsGrid from "@/components/layout/ComicsGrid";
import Pagination from "@/components/ui/pagination";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { getComicBySlugCategory } from "@/services/homeService";
import { PopulerToday } from "@/types/home";
import useHome from "@/hooks/useHome";
import { use, useEffect, useState } from "react";
import { FiTag } from "react-icons/fi";
import { Breadcrumb, BreadcrumbPage, BreadcrumbItem, BreadcrumbList, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";
import { FiHome } from "react-icons/fi";

interface DetailCategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default function DetailCategoryPage({ params }: DetailCategoryPageProps) {
  const { slug } = use(params);

  const [comics, setComics] = useState<PopulerToday[]>([]);
  const [isLoadingComics, setIsLoadingComics] = useState(true);
  const [categoryName, setCategoryName] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10; // Số comics mỗi trang

  // Sử dụng hook useHome để lấy dữ liệu cho sidebar
  const {
    populerWeek,
    populerMonth,
    populerAll,
    categories,
    isLoading: isLoadingSidebar,
  } = useHome();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setIsLoadingComics(true);
        const response = await getComicBySlugCategory(slug, currentPage, pageSize);
        if (response.status === 200 && response.data) {
          setComics(response.data);
          setTotalPages(response.totalPages || 1);
          // Tìm tên category từ slug
          const category = categories.find(cat => cat.slug === slug);
          setCategoryName(category?.name || slug);
        } else {
          setComics([]);
          setTotalPages(1);
        }
      } catch (error) {
        setComics([]);
        setTotalPages(1);
        console.error('Lỗi khi fetch comics:', error);
      } finally {
        setIsLoadingComics(false);
      }
    }
    fetchCategory();
  }, [slug, currentPage, pageSize, categories])

  // Xử lý thay đổi trang
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top khi chuyển trang
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (comics.length === 0 && !isLoadingComics) {
    return (
      <Main>
        <div className="mt-4 sm:mt-6 lg:mt-8 flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Main content - Empty State */}
          <div className="flex-1 min-w-0">
            <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 shadow-sm">
              <h2 className="text-lg font-bold p-4 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                Truyện thể loại: {categoryName || slug}
              </h2>
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-gray-400 dark:text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Không tìm thấy truyện
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
                    Hiện tại chưa có truyện nào trong thể loại <strong>{categoryName || slug}</strong>.
                    Hãy thử xem các thể loại khác hoặc quay lại sau nhé!
                  </p>
                  <button
                    onClick={() => window.history.back()}
                    className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      />
                    </svg>
                    Quay lại
                  </button>
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
                <BreadcrumbLink asChild>
                  <Link href="/category" className="flex items-center gap-1">
                    <FiTag className="w-4 h-4" />
                    Thể loại
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="flex items-center gap-1">
                  {categoryName || slug}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="mt-4 sm:mt-6 lg:mt-8 flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Main content - Comics Grid */}
          <div className="flex-1 min-w-0">
            {/* Loading state cho grid */}
            {isLoadingComics ? (
              <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 shadow-sm">
                <h2 className="text-lg font-bold p-4 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                  Truyện thể loại: {categoryName || slug}
                </h2>
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <LoadingSpinner size="lg" />
                    <p className="text-gray-600 dark:text-gray-400 mt-4">Đang tải truyện...</p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <CategoryComicsGrid
                  comics={comics}
                  categoryName={categoryName || slug}
                />

                {/* Pagination */}
                <div className="mt-6">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
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
