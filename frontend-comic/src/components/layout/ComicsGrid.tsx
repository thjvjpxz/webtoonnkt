import { PopulerToday } from "@/types/home";
import { chooseImageUrl } from "@/utils/string";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { FiCheck, FiEye, FiBookOpen } from "react-icons/fi";

interface CategoryComicsGridProps {
  comics: PopulerToday[];
  categoryName: string;
}

export default function CategoryComicsGrid({ comics, categoryName }: CategoryComicsGridProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 shadow-sm">
      {/* Header */}
      <h2 className="text-lg font-bold p-4 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
        {categoryName}
      </h2>

      {/* Comics Grid */}
      <div className="p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {comics.map((comic, index) => {
            // Tính toán trạng thái đọc
            const isFullyRead = comic.alreadyRead >= comic.latestChapter;
            const hasStartedReading = comic.alreadyRead > 0;
            const readingProgress = hasStartedReading ? ((comic.alreadyRead / comic.latestChapter) * 100).toFixed(0) : '0';

            return (
              <div
                key={comic.id}
                className={`flex items-start gap-3 border-b border-gray-200 dark:border-gray-700 pb-4 ${comics.length === index + 1 ||
                  (comics.length % 2 === 0 && comics.length === index + 2) ||
                  (comics.length % 2 === 1 && (comics.length === index + 1 || comics.length === index + 2))
                  ? 'border-b-0'
                  : ''
                  } group`}
              >
                <div className="relative">
                  <Link href={`/comic/${comic.slug}`}>
                    <Image
                      src={chooseImageUrl(comic.thumbUrl)}
                      alt={comic.name}
                      width={120}
                      height={150}
                      className="rounded flex-shrink-0 h-[150px] object-cover group-hover:opacity-80 transition-opacity cursor-pointer"
                      loading={index < 4 ? "eager" : "lazy"}
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                      onError={(e) => {
                        e.currentTarget.src = '/images/placeholder.svg';
                      }}
                    />
                  </Link>

                  {/* Badge trạng thái đọc */}
                  {isFullyRead && (
                    <div className="absolute top-2 right-2">
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 border-green-200 dark:border-green-800"
                      >
                        <FiCheck className="w-3 h-3 mr-1" />
                        Hoàn thành
                      </Badge>
                    </div>
                  )}

                  {/* Badge đang đọc */}
                  {hasStartedReading && !isFullyRead && (
                    <div className="absolute top-2 right-2">
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 border-blue-200 dark:border-blue-800"
                      >
                        <FiBookOpen className="w-3 h-3 mr-1" />
                        {readingProgress}%
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <Link href={`/comic/${comic.slug}`}>
                    <h3 className="text-md font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-primary dark:group-hover:text-primary transition-colors cursor-pointer">
                      {comic.name}
                    </h3>
                  </Link>

                  <div className="flex flex-col gap-2">
                    <div className="text-gray-500 dark:text-gray-400">
                      <span className="text-sm">
                        Chương mới nhất: {comic.latestChapter}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <FiEye className="w-4 h-4" />
                      <span className="text-sm">
                        {comic.viewCount?.toLocaleString()} lượt xem
                      </span>
                    </div>

                    {/* Hiển thị trạng thái đọc */}
                    {hasStartedReading && (
                      <div className="flex items-center gap-1">
                        {isFullyRead ? (
                          <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                            <FiCheck className="w-3 h-3" />
                            <span className="text-xs font-medium">Đã đọc hoàn ({comic.alreadyRead}/{comic.latestChapter} chương)</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                            <FiBookOpen className="w-3 h-3" />
                            <span className="text-xs font-medium">Đã đọc đến chương {comic.alreadyRead}/{comic.latestChapter}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 