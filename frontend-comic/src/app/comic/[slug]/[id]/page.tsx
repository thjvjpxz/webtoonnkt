'use client'
import Main from "@/components/layout/Main";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { getChaptersByComicId } from "@/services/comicDetailService";
import { Chapter } from "@/types/chapter";
import { notFound } from "next/navigation";
import { use, useEffect, useState } from "react";
import toast from "react-hot-toast";
import ReadComic from "@/components/comic/ReadComic";

interface ReadComicPageProps {
  params: Promise<{ slug: string, id: string }>; // chapterId
}

export default function ReadComicPage({ params }: ReadComicPageProps) {
  const { slug, id } = use(params);
  const [chapter, setChapter] = useState<Chapter>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await getChaptersByComicId(slug, id);

        if (response.status === 200 && response.data) {
          setChapter(response.data);
        }
        else {
          toast.error(response.message || "Lỗi khi lấy thông tin chapter");
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin chapter:", error);
        toast.error("Có lỗi xảy ra khi tải chapter");
      } finally {
        setIsLoading(false);
      }
    }
    fetchChapters();
  }, [slug, id]);

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

  if (!chapter) {
    notFound();
  }

  return (
    <Main>
      <ReadComic
        chapter={chapter}
        comicSlug={slug}
      />
    </Main>
  );
}