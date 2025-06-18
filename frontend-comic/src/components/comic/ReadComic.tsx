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
import { Chapter } from '@/types/chapter';
import { constructImageUrl } from '@/utils/helpers';
import { useAuth } from '@/contexts/AuthContext';
import CommentSection from './CommentSection';
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
  FiPlay,
  FiVolume2,
  FiVolumeX
} from 'react-icons/fi';
import { chooseImageUrl } from '@/utils/string';

interface ReadComicProps {
  chapter: Chapter;
  comicSlug: string;
  comicId: string;
}

type ReadingMode = 'horizontal' | 'vertical';
type AutoMode = 'none' | 'scroll' | 'audio'; // none: không tự động, scroll: tự động lướt, audio: tự động đọc

export default function ReadComic({
  chapter,
  comicSlug,
  comicId
}: ReadComicProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [readingMode, setReadingMode] = useState<ReadingMode>('vertical');
  const [autoMode, setAutoMode] = useState<AutoMode>('none');
  const [currentPage, setCurrentPage] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [audioError, setAudioError] = useState(false);

  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const detailChapters = chapter.detailChapters;
  const chapterSummaries = chapter.chapterSummaries || [];
  const urlAudio = process.env.NEXT_PUBLIC_OCR_BASE_URL + '/';

  // Kiểm tra chapter có hỗ trợ audio không
  const hasAudioSupport = chapter.hasAudio;

  // Thời gian delay cho ảnh không có bubble (ms)
  const NO_BUBBLE_DELAY = 2000; // 2 giây
  const AUDIO_END_DELAY = 1000; // 1 giây sau khi audio kết thúc

  // Xử lý tự động lướt khi không có audio
  useEffect(() => {
    if (autoMode === 'scroll' && isAutoPlaying && readingMode === 'horizontal') {
      const currentImage = detailChapters[currentPage];
      const delay = currentImage?.hasBubble ? 4000 : NO_BUBBLE_DELAY; // 4s cho có bubble, 2s cho không có bubble

      autoScrollIntervalRef.current = setTimeout(() => {
        setCurrentPage(prev => {
          if (prev >= detailChapters.length - 1) {
            setIsAutoPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, delay);
    } else {
      if (autoScrollIntervalRef.current) {
        clearTimeout(autoScrollIntervalRef.current);
        autoScrollIntervalRef.current = null;
      }
    }

    return () => {
      if (autoScrollIntervalRef.current) {
        clearTimeout(autoScrollIntervalRef.current);
      }
    };
  }, [autoMode, isAutoPlaying, readingMode, currentPage, detailChapters]);

  // Xử lý tự động đọc audio
  useEffect(() => {
    if (autoMode === 'audio' && isAutoPlaying && readingMode === 'horizontal') {
      const currentImage = detailChapters[currentPage];

      if (currentImage?.ttsUrl) {
        setIsAudioLoading(true);
        setAudioError(false);

        // Tạo audio element mới
        const audio = new Audio(urlAudio + currentImage.ttsUrl);
        audioRef.current = audio;

        audio.onloadeddata = () => {
          setIsAudioLoading(false);
          audio.play().catch(() => {
            setAudioError(true);
            setIsAudioLoading(false);
          });
        };

        audio.onended = () => {
          // Sau khi audio kết thúc, delay 1s rồi chuyển trang
          setTimeout(() => {
            setCurrentPage(prev => {
              if (prev >= detailChapters.length - 1) {
                setIsAutoPlaying(false);
                return prev;
              }
              return prev + 1;
            });
          }, AUDIO_END_DELAY);
        };

        audio.onerror = () => {
          setAudioError(true);
          setIsAudioLoading(false);
          // Nếu audio lỗi, tự động chuyển sang chế độ scroll
          setTimeout(() => {
            setCurrentPage(prev => {
              if (prev >= detailChapters.length - 1) {
                setIsAutoPlaying(false);
                return prev;
              }
              return prev + 1;
            });
          }, NO_BUBBLE_DELAY);
        };
      } else {
        // Nếu không có audio, dùng delay như chế độ scroll
        const delay = currentImage?.hasBubble ? 4000 : NO_BUBBLE_DELAY;
        autoScrollIntervalRef.current = setTimeout(() => {
          setCurrentPage(prev => {
            if (prev >= detailChapters.length - 1) {
              setIsAutoPlaying(false);
              return prev;
            }
            return prev + 1;
          });
        }, delay);
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [autoMode, isAutoPlaying, readingMode, currentPage, detailChapters, urlAudio]);

  // Dừng audio khi chuyển trang thủ công
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsAudioLoading(false);
    setAudioError(false);
  }, [currentPage]);

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
        if (autoMode !== 'none') {
          setIsAutoPlaying(prev => !prev);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [readingMode, autoMode, detailChapters.length]);

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(detailChapters.length - 1, prev + 1));
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(prev => !prev);
  };

  const handleAutoModeChange = (mode: AutoMode) => {
    setAutoMode(mode);
    setIsAutoPlaying(false);
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
              {hasAudioSupport && (
                <div className="flex items-center gap-2 mt-2">
                  <FiVolume2 className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-blue-500 font-medium">Hỗ trợ âm thanh</span>
                </div>
              )}
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
                  src={chooseImageUrl(constructImageUrl(chapter, image.imgUrl))}
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

                {/* Chế độ tự động */}
                <div className="flex items-center gap-2">
                  <Select value={autoMode} onValueChange={(value) => handleAutoModeChange(value as AutoMode)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Thủ công</SelectItem>
                      <SelectItem value="scroll">Tự động lướt</SelectItem>
                      {hasAudioSupport && (
                        <SelectItem value="audio">Tự động đọc</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Điều khiển phát/dừng */}
                {autoMode !== 'none' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleAutoPlay}
                    className="flex items-center gap-1"
                  >
                    {isAutoPlaying ? <FiPause className="w-4 h-4" /> : <FiPlay className="w-4 h-4" />}
                    {autoMode === 'audio' && isAudioLoading && (
                      <div className="w-3 h-3 border border-gray-300 border-t-transparent rounded-full animate-spin" />
                    )}
                    {autoMode === 'audio' && audioError && (
                      <FiVolumeX className="w-4 h-4 text-red-500" />
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* Container ảnh chính */}
            <div className="flex-1 relative flex items-center justify-center bg-gray-50 dark:bg-gray-900">
              <Image
                src={chooseImageUrl(constructImageUrl(chapter, detailChapters[currentPage].imgUrl))}
                alt={`Trang ${currentPage + 1}`}
                fill
                className="object-contain"
                priority
                sizes="100vw"
              />

              {/* Indicator cho ảnh có/không có bubble */}
              <div className="absolute top-4 left-4 z-10">
                <div className={`px-2 py-1 rounded text-xs font-medium ${detailChapters[currentPage]?.hasBubble
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-500 text-white'
                  }`}>
                  {detailChapters[currentPage]?.hasBubble ? 'Có hội thoại' : 'Không có hội thoại'}
                </div>
              </div>

              {/* Indicator cho audio */}
              {autoMode === 'audio' && detailChapters[currentPage]?.ttsUrl && (
                <div className="absolute top-4 right-4 z-10">
                  <div className="px-2 py-1 rounded text-xs font-medium bg-green-500 text-white flex items-center gap-1">
                    <FiVolume2 className="w-3 h-3" />
                    Có âm thanh
                  </div>
                </div>
              )}

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

      {/* Phần bình luận - chỉ hiển thị ở chế độ dọc */}
      {readingMode === 'vertical' && (
        <div className="bg-gray-50 dark:bg-gray-900 py-6">
          <div className="container mx-auto px-4">
            <CommentSection
              comicId={comicId}
              chapterId={chapter.id}
              currentUserId={user?.id}
              mode="chapter"
              title={`Bình luận Chapter ${chapter.chapterNumber}`}
            />
          </div>
        </div>
      )}
    </div>
  );
}
