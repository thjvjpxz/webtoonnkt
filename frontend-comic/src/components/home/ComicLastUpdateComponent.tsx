import { ComicLastUpdate } from "@/types/home";
import { formatDate } from "@/utils/helpers";
import Image from "next/image";
import Link from "next/link";

interface ComicLastUpdateProps {
  comics: ComicLastUpdate[];
}

export default function ComicLastUpdateComponent({ comics }: ComicLastUpdateProps) {

  return (
    <div className="my-4 sm:my-6 lg:my-8 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 shadow-sm">
      {/* Header */}
      <h2 className="text-lg font-bold p-4 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
        Truyện mới cập nhật
      </h2>
      {/* List comic */}
      <div className="p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {comics.map((comic, index) => (
            <div
              key={comic.id}
              className={`flex items-start gap-3 border-b border-gray-200 dark:border-gray-700 pb-4 ${comics.length === index + 1 || comics.length === index + 2 ? 'border-b-0' : ''} group`}>
              <Link href={`/comic/${comic.slug}`}>
                {
                  comic.thumbUrl ?
                    <Image
                      src={comic.thumbUrl}
                      alt={comic.name}
                      width={120}
                      height={100}
                      className="rounded flex-shrink-0 h-[150px] object-cover group-hover:opacity-80 transition-opacity cursor-pointer"
                      loading={index < 4 ? "eager" : "lazy"}
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                      onError={(e) => {
                        e.currentTarget.src = '/images/placeholder.svg';
                      }}
                    /> :
                    <Image
                      src="/images/placeholder.svg"
                      alt={comic.name}
                      width={120}
                      height={100}
                      className="rounded flex-shrink-0 h-[150px] object-cover group-hover:opacity-80 transition-opacity cursor-pointer"
                      loading={index < 4 ? "eager" : "lazy"}
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    />
                }
              </Link>
              <div className="flex-1 min-w-0">
                <Link href={`/comic/${comic.slug}`}>
                  <h3 className="truncate text-md font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-primary dark:group-hover:text-primary transition-colors cursor-pointer">
                    {comic.name}
                  </h3>
                </Link>
                <div className="flex flex-col gap-2">
                  {comic.chapters.map((chapter) => (
                    <Link
                      href={`/comic/${comic.slug}/${chapter.id}`}
                      key={chapter.id}
                      className="flex justify-between text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                      <span className="text-sm">
                        Chapter {chapter.chapterNumber}
                      </span>
                      <span className="text-sm">
                        {formatDate(chapter.updatedAt)}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div >
  );
}