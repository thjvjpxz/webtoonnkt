"use client";

import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useComicDetail from "@/hooks/useComicDetail";
import { ChapterStatus } from "@/types/chapter";
import { ComicDetailResponse } from "@/types/comic";
import { formatDate } from "@/utils/helpers";
import Image from "next/image";
import Link from "next/link";
import {
  FiBookmark,
  FiBookOpen,
  FiCalendar,
  FiEye,
  FiHeart,
  FiHome,
  FiPlay,
  FiSearch,
  FiStar,
  FiTag,
  FiUser,
  FiX
} from "react-icons/fi";

interface ComicDetailContentProps {
  comicDetailResponse: ComicDetailResponse;
}

export default function ComicDetailContent({ comicDetailResponse }: ComicDetailContentProps) {
  const {
    isFollowing,
    showAllChapters,
    searchTerm,
    sortedChapters,
    filteredChapters,
    displayedChapters,
    followersCount,
    handleFollow,
    clearSearch,
    setShowAllChapters,
    setSearchTerm
  } = useComicDetail(comicDetailResponse);

  const renderStatus = (status: string) => {
    const statusConfig = {
      ONGOING: { label: "Đang cập nhật", className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
      COMPLETED: { label: "Đã hoàn thành", className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] ||
      { label: status, className: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200" };

    return (
      <Badge className={config.className} >
        {config.label}
      </Badge>
    );
  };

  const renderChapterStatus = (status: ChapterStatus, price?: number) => {
    return status === ChapterStatus.FEE ? (
      <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 ml-auto" >
        {price ? `${price.toLocaleString('vi-VN')}đ` : 'Trả phí'
        }
      </Badge>
    ) : (
      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 ml-auto" >
        Miễn phí
      </Badge>
    );
  };

  return (
    <div>
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
              <BreadcrumbPage className="line-clamp-1 max-w-[200px] sm:max-w-none">
                {comicDetailResponse.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 shadow-sm mb-4 sm:mb-6 lg:mb-8">
        <div className="p-0">
          <div className="flex flex-col lg:flex-row">
            {/* Ảnh bìa */}
            <div className="lg:w-1/3 xl:w-1/4 p-4 sm:p-6 flex justify-center lg:justify-start">
              <div className="relative w-40 h-56 sm:w-48 sm:h-64 md:w-56 md:h-80 lg:w-64 lg:h-96 rounded-md overflow-hidden shadow-lg group">
                <Image
                  src={comicDetailResponse.thumbUrl || "/images/placeholder.svg"}
                  alt={comicDetailResponse.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  priority
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                  onError={(e) => {
                    e.currentTarget.src = '/images/placeholder.svg';
                  }}
                />
              </div>
            </div>

            {/* Thông tin truyện */}
            <div className="lg:w-2/3 xl:w-3/4 p-4 sm:p-6 lg:py-8">
              <div className="space-y-4 sm:space-y-6">
                {/* Tiêu đề Typography */}
                <div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                    {comicDetailResponse.name}
                  </h1>
                  {comicDetailResponse.originName && (
                    <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400">
                      {comicDetailResponse.originName}
                    </p>
                  )}
                </div>

                {/* Thông tin cơ bản Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <FiUser className="text-primary flex-shrink-0 text-sm sm:text-base" />
                    <span className="font-medium text-sm sm:text-base">Tác giả:</span>
                    <span className="truncate text-sm sm:text-base">{comicDetailResponse.author}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <FiCalendar className="text-primary flex-shrink-0 text-sm sm:text-base" />
                    <span className="font-medium text-sm sm:text-base">Cập nhật:</span>
                    <span className="text-xs sm:text-sm">{formatDate(comicDetailResponse.updatedAt)}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <FiEye className="text-primary flex-shrink-0 text-sm sm:text-base" />
                    <span className="font-medium text-sm sm:text-base">Lượt xem:</span>
                    <span className="text-sm sm:text-base">{comicDetailResponse.viewsCount.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <FiHeart className="text-primary flex-shrink-0 text-sm sm:text-base" />
                    <span className="font-medium text-sm sm:text-base">Theo dõi:</span>
                    <span className="text-sm sm:text-base">{followersCount.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <FiStar className="text-primary flex-shrink-0 text-sm sm:text-base" />
                    <span className="font-medium text-gray-700 dark:text-gray-300 text-sm sm:text-base">Trạng thái:</span>
                    {renderStatus(comicDetailResponse.status)}
                  </div>

                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <FiBookOpen className="text-primary flex-shrink-0 text-sm sm:text-base" />
                    <span className="font-medium text-sm sm:text-base">Số chapter:</span>
                    <span className="text-sm sm:text-base">{comicDetailResponse.chapters.length}</span>
                  </div>
                </div>

                {/* Thể loại */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <FiTag className="text-primary text-sm sm:text-base" />
                    <h3 className="font-medium text-gray-700 dark:text-gray-300 text-sm sm:text-base">Thể loại:</h3>
                    <div className="flex flex-wrap gap-2">
                      {comicDetailResponse.categories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/category/${category.slug}`}
                          className="px-2 py-1 rounded-md text-xs border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Nút hành động */}
                <div className="flex flex-col sm:flex-row flex-wrap gap-3 pt-4">
                  {comicDetailResponse.chapters.length > 0 && (
                    <Link href={`/comic/${comicDetailResponse.slug}/${comicDetailResponse.chapters[0].id}`}>
                      <Button>
                        <FiPlay />
                        Đọc từ đầu
                      </Button>
                    </Link>
                  )}

                  {sortedChapters.length > 0 && (
                    <Link href={`/comic/${comicDetailResponse.slug}/${sortedChapters[0].id}`}>
                      <Button variant="outline">
                        <FiBookOpen />
                        Chapter mới nhất
                      </Button>
                    </Link>
                  )}

                  <Button
                    variant={isFollowing ? "default" : "outline"}
                    onClick={handleFollow}
                    className={`w-full sm:w-auto ${isFollowing ? "bg-red-500 hover:bg-red-600" : ""}`}
                  >
                    <FiBookmark />
                    {isFollowing ? "Bỏ theo dõi" : "Theo dõi"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mô tả */}
      <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 shadow-sm mb-4 sm:mb-6 lg:mb-8">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Nội dung truyện</h2>
        </div>
        <div className="p-4">
          <div className="prose dark:prose-invert max-w-none">
            <div
              className="text-gray-700 dark:text-gray-300 leading-relaxed prose prose-sm max-w-none dark:prose-invert text-sm sm:text-base"
              dangerouslySetInnerHTML={{
                __html: comicDetailResponse.description || "Chưa có mô tả cho truyện này."
              }}
            />
          </div>
        </div>
      </div>

      {/* Danh sách Chapter */}
      <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 gap-4">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex-shrink-0">
            Danh sách chapter ({filteredChapters.length}{searchTerm && ` / ${comicDetailResponse.chapters.length}`})
          </h2>

          {/* Search Input */}
          {comicDetailResponse.chapters.length > 0 && (
            <div className="relative w-full sm:w-64 md:w-80">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <Input
                type="text"
                placeholder="Tìm số chapter..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10 h-9 text-sm w-full"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSearch}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <FiX className="text-gray-400 text-sm" />
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="p-4">
          {comicDetailResponse.chapters.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <FiBookOpen className="mx-auto text-4xl mb-4 opacity-50" />
              <p className="text-lg font-medium">Chưa có chapter nào</p>
              <p className="text-sm mt-2">Hãy quay lại sau để đọc chapter mới nhất!</p>
            </div>
          ) : filteredChapters.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <FiSearch className="mx-auto text-4xl mb-4 opacity-50" />
              <p className="text-lg font-medium">Không tìm thấy chapter nào</p>
              <p className="text-sm mt-2">Thử tìm kiếm với từ khóa khác</p>
              <Button
                variant="outline"
                size="sm"
                onClick={clearSearch}
                className="mt-4"
              >
                <FiX className="mr-2 text-xs" />
                Xóa bộ lọc
              </Button>
            </div>
          ) : (
            <>
              {/* Hiển thị thông tin kết quả tìm kiếm */}
              {searchTerm && (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                      <FiSearch className="text-sm flex-shrink-0" />
                      <span className="text-sm font-medium">
                        Tìm thấy {filteredChapters.length} chapter cho &quot;{searchTerm}&quot;
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearSearch}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 w-full sm:w-auto"
                    >
                      <FiX className="mr-1 text-xs" />
                      Xóa
                    </Button>
                  </div>
                </div>
              )}

              {/* Chapter List */}
              <div className="space-y-2">
                {displayedChapters.map((chapter) => (
                  <Link
                    key={chapter.id}
                    href={`/comic/${comicDetailResponse.slug}/${chapter.id}`}
                    className="group block p-3 sm:p-4 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:border-primary/50 transition-all duration-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-200 text-sm sm:text-base line-clamp-2 sm:line-clamp-1">
                          Chapter {chapter.chapterNumber}: {chapter.title}
                        </h3>
                        <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                          <div className="flex items-center gap-1">
                            <FiCalendar className="text-xs flex-shrink-0" />
                            <span className="truncate">{formatDate(chapter.createdAt)}</span>
                          </div>

                          {/* Price badge on mobile */}
                          <div className="flex sm:hidden items-center">
                            {renderChapterStatus(chapter.status, chapter.price)}
                          </div>
                        </div>
                      </div>

                      {/* Price badge on desktop */}
                      <div className="hidden sm:flex items-center gap-2">
                        {renderChapterStatus(chapter.status, chapter.price)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Nút xem thêm */}
              {!searchTerm.trim() && filteredChapters.length > 5 && (
                <div className="text-center mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setShowAllChapters(!showAllChapters)}
                    className="border-primary text-primary hover:bg-primary hover:text-white w-full sm:w-auto"
                  >
                    {showAllChapters ? (
                      <>
                        <FiBookOpen />
                        Thu gọn
                      </>
                    ) : (
                      <>
                        <FiBookOpen />
                        Xem thêm {filteredChapters.length - 5} chapter
                      </>
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}