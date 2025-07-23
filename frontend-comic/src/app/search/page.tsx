"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PopulerToday } from "@/types/home";
import CategoryComicsGrid from "@/components/layout/ComicsGrid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FiSearch, FiHome } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { getComicBySearch } from "@/services/homeService";
import Main from "@/components/layout/Main";
import Sidebar from "@/components/layout/Sidebar";
import SidebarSkeletonComponent from "@/components/layout/SidebarSkeletonComponent";
import { Breadcrumb, BreadcrumbPage, BreadcrumbItem, BreadcrumbList, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";
import useHome from "@/hooks/useHome";
import Pagination from "@/components/ui/pagination";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// Component con chứa logic sử dụng useSearchParams
function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("query") || "";

  const [searchQuery, setSearchQuery] = useState(query);
  const [comics, setComics] = useState<PopulerToday[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);

  const limit = 10; // Số lượng truyện trên mỗi trang

  // Sử dụng hook useHome để lấy dữ liệu cho sidebar
  const {
    populerWeek,
    populerMonth,
    populerAll,
    categories,
    isLoading: isLoadingSidebar,
  } = useHome();

  // Hàm tìm kiếm truyện
  const searchComics = async (searchTerm: string, page: number = 1) => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await getComicBySearch(searchTerm, page, limit);

      if (response.status === 200 && response.data) {
        setComics(response.data);
        const total = response.data.length;
        setTotalPages(Math.ceil(total / limit));
        setCurrentPage(page);
      } else {
        setComics([]);
        setError(response.message || "Không thể tìm kiếm truyện");
      }
    } catch (err) {
      setError("Đã xảy ra lỗi khi tìm kiếm");
      setComics([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Tìm kiếm khi component mount hoặc query thay đổi
  useEffect(() => {
    if (query) {
      setSearchQuery(query);
      searchComics(query, 1);
    }
  }, [query]);

  // Xử lý submit form tìm kiếm
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Xử lý thay đổi trang
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && !loading) {
      searchComics(query, page);
      // Scroll to top khi chuyển trang
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Xóa tìm kiếm
  const clearSearch = () => {
    setSearchQuery("");
    setComics([]);
    setHasSearched(false);
    setError(null);
    router.push("/search");
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
                  <FiSearch className="w-4 h-4" />
                  Tìm kiếm
                  {query && `: "${query}"`}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 shadow-sm">
              {/* Header tìm kiếm */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
                  Tìm kiếm truyện
                </h2>

                {/* Form tìm kiếm */}
                <div className="max-w-md">
                  <form onSubmit={handleSearchSubmit} className="relative w-full group">
                    <div className={`relative transition-all duration-300 ${searchQuery ? 'transform scale-105' : ''
                      }`}>
                      <Input
                        type="search"
                        placeholder="Tìm kiếm truyện..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`pl-12 pr-4 py-2 w-full focus:bg-white dark:focus:bg-gray-700 border-2 transition-all duration-300 ${searchQuery
                          ? 'border-primary shadow-lg shadow-primary/20'
                          : 'border-border hover:border-primary/50'
                          }`}
                      />
                      <FiSearch className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${searchQuery ? 'text-primary scale-110' : 'text-muted-foreground'
                        } w-4 h-4`} />

                      {/* Search suggestions */}
                      {searchQuery && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg z-50">
                          <div className="p-2 text-sm text-muted-foreground">
                            Nhấn Enter để tìm kiếm &quot;{searchQuery}&quot;
                          </div>
                        </div>
                      )}
                    </div>
                  </form>
                </div>

                {/* Hiển thị từ khóa đang tìm */}
                {query && (
                  <p className="mt-3 text-gray-600 dark:text-gray-400">
                    Kết quả tìm kiếm cho: <span className="font-semibold text-primary">&quot;{query}&quot;</span>
                  </p>
                )}
              </div>

              {/* Nội dung kết quả */}
              <div className="p-4">
                {/* Loading state */}
                {loading && (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <LoadingSpinner size="lg" />
                      <p className="text-gray-600 dark:text-gray-400 mt-4">Đang tìm kiếm...</p>
                    </div>
                  </div>
                )}

                {/* Error state */}
                {error && (
                  <div className="text-center py-12">
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                      <p className="text-red-600 dark:text-red-400">{error}</p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => searchComics(query, currentPage)}
                      >
                        Thử lại
                      </Button>
                    </div>
                  </div>
                )}

                {/* No results state */}
                {!loading && !error && hasSearched && comics.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <FiSearch className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        Không tìm thấy kết quả
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md mx-auto">
                        Không có truyện nào phù hợp với từ khóa <strong>&quot;{query}&quot;</strong>.
                        Hãy thử tìm kiếm với từ khóa khác!
                      </p>
                      <Button variant="outline" onClick={clearSearch}>
                        Tìm kiếm khác
                      </Button>
                    </div>
                  </div>
                )}

                {/* Empty state khi chưa tìm kiếm */}
                {!hasSearched && !query && (
                  <div className="text-center py-12">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <FiSearch className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        Tìm kiếm truyện yêu thích
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Nhập tên truyện hoặc tác giả để bắt đầu tìm kiếm
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Results */}
            {!loading && !error && comics.length > 0 && (
              <>
                {/* Hiển thị số kết quả */}
                <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  Tìm thấy {comics.length} truyện
                </div>

                {/* Grid kết quả sử dụng ComicsGrid */}
                <div className="mt-4">
                  <CategoryComicsGrid
                    comics={comics}
                    categoryName={`Kết quả tìm kiếm: "${query}"`}
                  />
                </div>

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
  );
}

// Component chính với Suspense boundary
export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <Main>
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <LoadingSpinner size="lg" />
              <p className="text-gray-600 dark:text-gray-400 mt-4">Đang tải trang tìm kiếm...</p>
            </div>
          </div>
        </Main>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
} 