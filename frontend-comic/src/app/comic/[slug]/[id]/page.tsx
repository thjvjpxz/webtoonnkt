'use client'
import Main from "@/components/layout/Main";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { getChaptersByComicId, getComicBySlug, gainExp } from "@/services/detailComicService";
import { Chapter } from "@/types/chapter";
import { notFound } from "next/navigation";
import { use, useEffect, useState } from "react";
import toast from "react-hot-toast";
import ReadComic from "@/components/comic/ReadComic";
import { useAuth } from "@/contexts/AuthContext";

interface ReadComicPageProps {
  params: Promise<{ slug: string, id: string }>; // chapterId
}

export default function ReadComicPage({ params }: ReadComicPageProps) {
  const { slug, id } = use(params);
  const { user, isAuthenticated } = useAuth();
  const [chapter, setChapter] = useState<Chapter>();
  const [comicId, setComicId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [readingStartTime, setReadingStartTime] = useState<number | null>(null);
  const [canGainExp, setCanGainExp] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy thông tin comic để có comicId
        const comicResponse = await getComicBySlug(slug);

        if (comicResponse.status === 200 && comicResponse.data) {
          setComicId(comicResponse.data.id);
        }

        // Lấy thông tin chapter
        const chapterResponse = await getChaptersByComicId(slug, id);

        if (chapterResponse.status === 200 && chapterResponse.data) {
          setChapter(chapterResponse.data);
          // Bắt đầu tính thời gian đọc khi chapter được load thành công
          setReadingStartTime(Date.now());
        } else {
          toast.error(chapterResponse.message || "Lỗi khi lấy thông tin chapter");
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin:", error);
        toast.error("Có lỗi xảy ra khi tải dữ liệu");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [slug, id]);

  // Kiểm tra thời gian đọc và cho phép nhận exp sau 60 giây
  useEffect(() => {
    if (!readingStartTime) return;

    const checkReadingTime = () => {
      const currentTime = Date.now();
      const readingDuration = currentTime - readingStartTime;

      if (readingDuration >= 60000) {
        setCanGainExp(true);
      }
    };

    checkReadingTime();

    const interval = setInterval(checkReadingTime, 1000);

    return () => clearInterval(interval);
  }, [readingStartTime]);

  // Nhận exp khi đọc truyện (chỉ gọi 1 lần cho mỗi chapter sau khi đã đọc đủ 60 giây)
  useEffect(() => {
    const handleGainExp = async () => {
      if (isAuthenticated && user && chapter && canGainExp) {
        try {
          const response = await gainExp();
          if (response.status === 200) {
            console.log("Đã nhận exp thành công sau khi đọc đủ 60 giây");
          }
        } catch (error) {
          console.error("Lỗi khi nhận exp:", error);
        }
      }
    };

    handleGainExp();
  }, [isAuthenticated, user, chapter, canGainExp]);

  if (isLoading) {
    return (
      <Main>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="text-gray-600 dark:text-gray-400 mt-4">Đang tải chapter...</p>
          </div>
        </div>
      </Main>
    );
  }

  if (!chapter || !comicId) {
    notFound();
  }

  return (
    <Main>
      <ReadComic
        chapter={chapter}
        comicSlug={slug}
        comicId={comicId}
      />
    </Main>
  );
}