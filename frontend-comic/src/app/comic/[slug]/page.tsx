'use client'
import ComicDetailContent from "@/components/comic/ComicDetailContent";
import Main from '../../../components/layout/Main';
import { use, useEffect, useState } from "react";
import { ComicDetailResponse } from "@/types/comic";
import { getComicBySlug } from "@/services/comicDetailService";
import { notFound } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface ComicDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function ComicDetailPage({ params }: ComicDetailPageProps) {
  const [comicDetailResponse, setComicDetailResponse] = useState<ComicDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { slug } = use(params);

  useEffect(() => {
    const fetchComic = async () => {
      try {
        const comicResponse = await getComicBySlug(slug);
        if (comicResponse.status === 200 && comicResponse.data) {
          setComicDetailResponse(comicResponse.data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin truyện:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchComic();
  }, [slug]);

  if (isLoading) {
    return (
      <Main>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="text-gray-600 dark:text-gray-400">Đang tải thông tin truyện...</p>
          </div>
        </div>
      </Main>
    );
  }

  if (!comicDetailResponse) {
    notFound();
  }

  return (
    <div>
      <Main>
        <div className="min-h-screen">
          <div className="container mx-auto px-4 py-8">
            <ComicDetailContent comicDetailResponse={comicDetailResponse} />
          </div>
        </div>
      </Main>
    </div>
  );
}