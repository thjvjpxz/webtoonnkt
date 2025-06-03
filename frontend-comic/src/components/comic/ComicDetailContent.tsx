"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/utils/helpers";
import {
  FiBookmark,
  FiEye,
  FiHeart,
  FiCalendar,
  FiUser,
  FiBookOpen,
  FiPlay,
  FiTag,
  FiClock,
  FiStar,
  FiSearch,
  FiX
} from "react-icons/fi";
import { ComicDetailResponse } from "@/types/comic";
import { ChapterStatus } from "@/types/chapter";

interface ComicDetailContentProps {
  comicDetailResponse: ComicDetailResponse;
}

export default function ComicDetailContent({ comicDetailResponse }: ComicDetailContentProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [showAllChapters, setShowAllChapters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const sortedChapters = [...comicDetailResponse.chapters].sort((a, b) => b.chapterNumber - a.chapterNumber);

  const filteredChapters = sortedChapters.filter(chapter => {
    if (!searchTerm.trim()) return true;

    const searchLower = searchTerm.toLowerCase().trim();
    const chapterNumberMatch = chapter.chapterNumber.toString().includes(searchLower);
    // const titleMatch = chapter.title.toLowerCase().includes(searchLower);

    return chapterNumberMatch;
  });

  const displayedChapters = searchTerm.trim()
    ? filteredChapters // Hiển thị tất cả kết quả tìm kiếm
    : showAllChapters
      ? filteredChapters
      : filteredChapters.slice(0, 5); // Chỉ giới hạn khi không tìm kiếm

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    // TODO: Implement follow/unfollow API call
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const renderStatus = (status: string) => {
    const statusConfig = {
      ONGOING: { label: "Đang cập nhật", className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
      COMPLETED: { label: "Đã hoàn thành", className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] ||
      { label: status, className: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200" };

    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const renderChapterStatus = (status: ChapterStatus, price?: number) => {
    return status === ChapterStatus.FEE ? (
      <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 ml-auto">
        {price ? `${price.toLocaleString('vi-VN')}đ` : 'Trả phí'}
      </Badge>
    ) : (
      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 ml-auto">
        Miễn phí
      </Badge>
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section - Giống style home page */}
      <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 shadow-sm mb-4 sm:mb-6 lg:mb-8">
        <div className="p-0">
          <div className="flex flex-col lg:flex-row">
            {/* Ảnh bìa */}
            <div className="lg:w-1/3 xl:w-1/4 p-4 sm:p-6 flex justify-center lg:justify-start">
              <div className="relative w-48 sm:w-64 h-64 sm:h-96 rounded-md overflow-hidden shadow-lg group">
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
                {/* Tiêu đề */}
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {comicDetailResponse.name}
                  </h1>
                  {comicDetailResponse.originName && (
                    <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
                      {comicDetailResponse.originName}
                    </p>
                  )}
                </div>

                {/* Thông tin cơ bản - Grid responsive */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <FiUser className="text-primary flex-shrink-0" />
                    <span className="font-medium">Tác giả:</span>
                    <span className="truncate">{comicDetailResponse.author}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <FiCalendar className="text-primary flex-shrink-0" />
                    <span className="font-medium">Cập nhật:</span>
                    <span className="text-sm">{formatDate(comicDetailResponse.updatedAt)}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <FiEye className="text-primary flex-shrink-0" />
                    <span className="font-medium">Lượt xem:</span>
                    <span>{comicDetailResponse.viewsCount.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <FiHeart className="text-primary flex-shrink-0" />
                    <span className="font-medium">Theo dõi:</span>
                    <span>{comicDetailResponse.followersCount.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <FiStar className="text-primary flex-shrink-0" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">Trạng thái:</span>
                    {renderStatus(comicDetailResponse.status)}
                  </div>

                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <FiBookOpen className="text-primary flex-shrink-0" />
                    <span className="font-medium">Số chapter:</span>
                    <span>{comicDetailResponse.chapters.length}</span>
                  </div>
                </div>

                {/* Thể loại */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <FiTag className="text-primary" />
                    <h3 className="font-medium text-gray-700 dark:text-gray-300">Thể loại:</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {comicDetailResponse.categories.map((category) => (
                      <Badge
                        key={category.id}
                        variant="outline"
                        className="hover:bg-primary/10 hover:border-primary/50 transition-colors duration-200 cursor-pointer"
                      >
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Nút hành động */}
                <div className="flex flex-wrap gap-3 pt-4">
                  {comicDetailResponse.chapters.length > 0 && (
                    <Link href={`/comic/${comicDetailResponse.slug}/${comicDetailResponse.chapters[0].id}`}>
                      <Button size="lg" className="bg-primary hover:bg-primary/90">
                        <FiPlay className="mr-2" />
                        Đọc từ đầu
                      </Button>
                    </Link>
                  )}

                  {sortedChapters.length > 0 && (
                    <Link href={`/comic/${comicDetailResponse.slug}/${sortedChapters[0].id}`}>
                      <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                        <FiBookOpen className="mr-2" />
                        Chapter mới nhất
                      </Button>
                    </Link>
                  )}

                  <Button
                    size="lg"
                    variant={isFollowing ? "default" : "outline"}
                    onClick={handleFollow}
                    className={isFollowing ? "bg-red-500 hover:bg-red-600" : ""}
                  >
                    <FiBookmark className="mr-2" />
                    {isFollowing ? "Bỏ theo dõi" : "Theo dõi"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mô tả - Giống style home page */}
      <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 shadow-sm mb-4 sm:mb-6 lg:mb-8">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Nội dung truyện</h2>
        </div>
        <div className="p-4">
          <div className="prose dark:prose-invert max-w-none">
            <div
              className="text-gray-700 dark:text-gray-300 leading-relaxed prose prose-sm max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{
                __html: comicDetailResponse.description || "Chưa có mô tả cho truyện này."
              }}
            />
          </div>
        </div>
      </div>

      {/* Danh sách Chapter - Giống style home page */}
      <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 gap-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Danh sách chapter ({filteredChapters.length}{searchTerm && ` / ${comicDetailResponse.chapters.length}`})
          </h2>

          {/* Search Input */}
          {comicDetailResponse.chapters.length > 0 && (
            <div className="relative w-full sm:w-80">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <Input
                type="text"
                placeholder="Tìm kiếm chapter (số hoặc tiêu đề)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10 h-9 text-sm"
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
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                      <FiSearch className="text-sm" />
                      <span className="text-sm font-medium">
                        Tìm thấy {filteredChapters.length} chapter cho "{searchTerm}"
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearSearch}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                    >
                      <FiX className="mr-1 text-xs" />
                      Xóa
                    </Button>
                  </div>
                </div>
              )}

              <div className="grid gap-2">
                {displayedChapters.map((chapter, index) => (
                  <Link
                    key={chapter.id}
                    href={`/comic/${comicDetailResponse.slug}/${chapter.id}`}
                    className="group block p-4 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:border-primary/50 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-200 truncate">
                          Chapter {chapter.chapterNumber}: {chapter.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                          <div className="flex items-center gap-1">
                            <FiCalendar className="text-xs" />
                            <span>{formatDate(chapter.createdAt)}</span>
                          </div>
                          {!searchTerm && index === 0 && (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs">
                              Mới nhất
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="ml-4 flex items-center gap-2">
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
                    className="border-primary text-primary hover:bg-primary hover:text-white"
                  >
                    {showAllChapters ? (
                      <>
                        <FiBookOpen className="mr-2" />
                        Thu gọn
                      </>
                    ) : (
                      <>
                        <FiBookOpen className="mr-2" />
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