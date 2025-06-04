"use client";

import { PopulerToday } from "@/types/home";
import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PopulerTodayComponentProps {
  comics: PopulerToday[];
}

export default function PopulerTodayComponent({ comics }: PopulerTodayComponentProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Scroll sang trái với auto-loop
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      const scrollAmount = 200;

      if (scrollLeft <= 0) {
        // Nếu đã ở đầu, nhảy tới cuối
        scrollContainerRef.current.scrollTo({
          left: scrollWidth - clientWidth,
          behavior: "smooth"
        });
      } else {
        // Scroll bình thường
        scrollContainerRef.current.scrollBy({
          left: -scrollAmount,
          behavior: "smooth"
        });
      }
    }
  };

  // Scroll sang phải với auto-loop
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      const scrollAmount = 200;

      if (scrollLeft >= scrollWidth - clientWidth - 1) {
        // Nếu đã ở cuối, nhảy về đầu
        scrollContainerRef.current.scrollTo({
          left: 0,
          behavior: "smooth"
        });
      } else {
        // Scroll bình thường
        scrollContainerRef.current.scrollBy({
          left: scrollAmount,
          behavior: "smooth"
        });
      }
    }
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 shadow-sm"
    >
      {/* Header với navigation buttons */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-bold">Truyện phổ biến hôm nay</h2>

        {/* Navigation buttons */}
        <div className="flex gap-2 items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={scrollLeft}
            className="h-8 w-8 p-0 rounded"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={scrollRight}
            className="h-8 w-8 p-0 rounded"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Carousel container */}
      <div className="p-4">
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none', // IE và Edge
          }}
        >
          {comics.map((comic, index) => (
            <div key={comic.id} className="flex-shrink-0 w-[180px] group">
              <Link href={`/comic/${comic.slug}`} className="block">
                <div className="relative overflow-hidden rounded mb-3">
                  <Image
                    src={comic.thumbUrl || "/images/placeholder.svg"}
                    alt={comic.name}
                    width={180}
                    height={230}
                    className="object-cover h-[230px] w-full transition-transform duration-300 group-hover:scale-105"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    onError={(e) => {
                      e.currentTarget.src = '/images/placeholder.svg';
                    }}
                  />
                </div>
                <div className="flex flex-col gap-2 items-center">
                  <h3 className="text-sm font-bold text-center line-clamp-2 group-hover:text-primary transition-colors duration-200">
                    {comic.name.length > 20 ? comic.name.slice(0, 20) + '...' : comic.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Chương {comic.latestChapter}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}