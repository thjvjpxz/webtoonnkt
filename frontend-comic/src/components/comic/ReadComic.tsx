'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Chapter } from '@/types/chapter';
import { constructImageUrl } from '@/utils/helpers';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
  FiChevronLeft,
  FiChevronRight,
  FiColumns,
  FiHome,
  FiMenu,
  FiPause,
  FiPlay
} from 'react-icons/fi';

interface ReadComicProps {
  chapter: Chapter;
  comicSlug: string;
}

type ReadingMode = 'horizontal' | 'vertical';

export default function ReadComic({
  chapter,
  comicSlug
}: ReadComicProps) {
  const router = useRouter();
  const [readingMode, setReadingMode] = useState<ReadingMode>('vertical');
  const [autoRead, setAutoRead] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const autoReadIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const detailChapters = chapter.detailChapters;
  const chapterSummaries = chapter.chapterSummaries || [];

  // Xử lý tự động đọc
  useEffect(() => {
    if (autoRead && isAutoPlaying && readingMode === 'horizontal') {
      autoReadIntervalRef.current = setInterval(() => {
        setCurrentPage(prev => {
          if (prev >= detailChapters.length - 1) {
            setIsAutoPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 3000); // 3 giây mỗi trang
    } else {
      if (autoReadIntervalRef.current) {
        clearInterval(autoReadIntervalRef.current);
        autoReadIntervalRef.current = null;
      }
    }

    return () => {
      if (autoReadIntervalRef.current) {
        clearInterval(autoReadIntervalRef.current);
      }
    };
  }, [autoRead, isAutoPlaying, readingMode, detailChapters.length]);

  // Xử lý phím tắt
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (readingMode === 'horizontal') {
        if (e.key === 'ArrowLeft') {
          setCurrentPage(prev => Math.max(0, prev - 1));
        } else if (e.key === 'ArrowRight') {
          setCurrentPage(prev => Math.min(detailChapters.length - 1, prev + 1));
        }
      }
      if (e.key === ' ') {
        e.preventDefault();
        if (autoRead) {
          setIsAutoPlaying(prev => !prev);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [readingMode, autoRead, detailChapters.length]);

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(detailChapters.length - 1, prev + 1));
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(prev => !prev);
  };

  const handleChapterChange = (chapterId: string) => {
    router.push(`/comic/${comicSlug}/${chapterId}`);
  };

  // Tìm chapter trước và sau
  const currentChapterIndex = chapterSummaries.findIndex(ch => ch.id === chapter.id);
  const prevChapter = currentChapterIndex > 0 ? chapterSummaries[currentChapterIndex - 1] : null;
  const nextChapter = currentChapterIndex < chapterSummaries.length - 1 ? chapterSummaries[currentChapterIndex + 1] : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header với thông tin chapter */}
      <div className={`bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 top-0 z-50 ${readingMode === 'horizontal' ? 'hidden' : ''}`}>
        <div className="container mx-auto p-4">
          {/* Breadcrumb Navigation */}
          <div className="mb-4">
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
                    <Link href={`/comic/${comicSlug}`} className="line-clamp-1 max-w-[150px] sm:max-w-none">
                      {chapter.comicName || 'Truyện'}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="line-clamp-1 max-w-[120px] sm:max-w-none">
                    Chapter {chapter.chapterNumber}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white text-wrap">
                Chapter {chapter.chapterNumber}: {chapter.title}
              </h1>
            </div>

            {/* Menu toggle cho mobile */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="sm:hidden"
            >
              <FiMenu className="w-4 h-4" />
            </Button>
          </div>

          {/* Menu điều khiển cho chế độ dọc */}
          <div className={`mt-4 ${isMenuOpen ? 'block' : 'hidden'} sm:block`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded">
              {/* Chế độ đọc */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setReadingMode('horizontal')}
                  className="flex items-center gap-2"
                >
                  <FiColumns className="w-4 h-4" />
                  Chế độ ngang
                </Button>
              </div>

              {/* Tự động đọc */}
              {readingMode === 'horizontal' && (
                <div className="flex items-center gap-2">
                  <Switch
                    id="auto-read"
                    checked={autoRead}
                    onCheckedChange={setAutoRead}
                  />
                  <Label htmlFor="auto-read" className="text-sm font-medium whitespace-nowrap">
                    Tự động đọc
                  </Label>
                </div>
              )}

              {/* Điều khiển tự động đọc cho chế độ dọc */}
              {autoRead && readingMode === 'horizontal' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleAutoPlay}
                  className="flex items-center gap-2"
                >
                  {isAutoPlaying ? <FiPause className="w-4 h-4" /> : <FiPlay className="w-4 h-4" />}
                  {isAutoPlaying ? 'Tạm dừng' : 'Phát'}
                </Button>
              )}

              {/* Chọn chapter */}
              {chapterSummaries.length > 0 && (
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium whitespace-nowrap">Chapter:</Label>
                  <Select value={chapter.id} onValueChange={handleChapterChange}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {chapterSummaries.map((ch) => (
                        <SelectItem key={ch.id} value={ch.id}>
                          Chapter {ch.chapterNumber}: {ch.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Nội dung đọc truyện */}
      <div ref={containerRef} className={`${readingMode === 'horizontal' ? '' : 'container px-4 sm:px-0'}`}>
        {readingMode === 'vertical' ? (
          // Chế độ đọc dọc
          <div className="mx-auto">
            {detailChapters.map((image, index) => (
              <div key={image.id} className="relative">
                <Image
                  src={constructImageUrl(chapter, image.imgUrl)}
                  alt={`Trang ${index + 1}`}
                  width={800}
                  height={1200}
                  className="w-full h-auto shadow-sm"
                  priority={index < 3}
                  loading={index < 3 ? 'eager' : 'lazy'}
                />
              </div>
            ))}
          </div>
        ) : (
          // Chế độ đọc ngang
          <div className="fixed inset-0 flex flex-col overflow-hidden">
            {/* Header thu gọn cho chế độ ngang */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 backdrop-blur-sm p-2 flex items-center justify-between z-10">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {currentPage + 1}/{detailChapters.length}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setReadingMode('vertical')}
                >
                  <FiColumns className="w-4 h-4 rotate-90 mr-2" />
                  Chế độ dọc
                </Button>
              </div>

              <div className="flex items-center gap-2">
                {/* Chọn chapter cho chế độ ngang */}
                {chapterSummaries.length > 0 && (
                  <Select value={chapter.id} onValueChange={handleChapterChange}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {chapterSummaries.map((ch) => (
                        <SelectItem key={ch.id} value={ch.id}>
                          Chapter {ch.chapterNumber}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {/* Tự động đọc cho chế độ ngang */}
                <div className="flex items-center gap-2">
                  <Switch
                    checked={autoRead}
                    onCheckedChange={setAutoRead}
                  />
                  <Label className="text-sm text-gray-900 dark:text-white">Auto</Label>
                </div>

                {/* Điều khiển tự động đọc */}
                {autoRead && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleAutoPlay}
                  >
                    {isAutoPlaying ? <FiPause className="w-4 h-4" /> : <FiPlay className="w-4 h-4" />}
                  </Button>
                )}
              </div>
            </div>

            {/* Container ảnh chính */}
            <div className="flex-1 relative flex items-center justify-center bg-gray-50 dark:bg-gray-900">
              <Image
                src={constructImageUrl(chapter, detailChapters[currentPage].imgUrl)}
                alt={`Trang ${currentPage + 1}`}
                fill
                className="object-contain"
                priority
                sizes="100vw"
              />

              {/* Nút điều khiển bên trái */}
              <div className="absolute left-0 inset-y-0 flex items-center z-10">
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={handlePrevPage}
                  disabled={currentPage === 0}
                  className="h-full w-16 rounded-none text-gray-900 dark:text-white hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-30"
                >
                  <FiChevronLeft className="w-8 h-8" />
                </Button>
              </div>

              {/* Nút điều khiển bên phải */}
              <div className="absolute right-0 inset-y-0 flex items-center z-10">
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={handleNextPage}
                  disabled={currentPage === detailChapters.length - 1}
                  className="h-full w-16 rounded-none text-gray-900 dark:text-white hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-30"
                >
                  <FiChevronRight className="w-8 h-8" />
                </Button>
              </div>

              {/* Vùng click để chuyển trang */}
              <div
                className="absolute left-16 top-0 bottom-0 w-1/3 cursor-pointer z-5"
                onClick={handlePrevPage}
              />
              <div
                className="absolute right-16 top-0 bottom-0 w-1/3 cursor-pointer z-5"
                onClick={handleNextPage}
              />
            </div>

            {/* Footer với thanh tiến trình */}
            <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 backdrop-blur-sm p-3">
              <div className="bg-gray-200 dark:bg-gray-600 rounded-full h-1 max-w-md mx-auto">
                <div
                  className="bg-primary h-1 rounded-full transition-all duration-300"
                  style={{ width: `${((currentPage + 1) / detailChapters.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation giữa các chapter */}
      {(prevChapter || nextChapter) && (
        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-2">
              {prevChapter ? (
                <Button
                  variant="outline"
                  onClick={() => handleChapterChange(prevChapter.id)}
                  className="flex items-center gap-2"
                >
                  <FiChevronLeft className="w-4 h-4" />
                  <div className="text-left">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Chapter {prevChapter.chapterNumber}</div>
                  </div>
                </Button>
              ) : <div />}

              {nextChapter ? (
                <Button
                  variant="outline"
                  onClick={() => handleChapterChange(nextChapter.id)}
                  className="flex items-center gap-2"
                >
                  <div className="text-right">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Chapter {nextChapter.chapterNumber}</div>
                  </div>
                  <FiChevronRight className="w-4 h-4" />
                </Button>
              ) : <div />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
