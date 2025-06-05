'use client';

import { CategoryResponse } from '@/types/category';
import { PopulerToday } from '@/types/home';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FiEye } from 'react-icons/fi';

interface SidebarProps {
  populerWeek: PopulerToday[];
  populerMonth: PopulerToday[];
  populerAll: PopulerToday[];
  categories: CategoryResponse[];
}

export default function Sidebar({ populerWeek, populerMonth, populerAll, categories }: SidebarProps) {
  // State để quản lý tab được chọn
  const [activeTab, setActiveTab] = useState<'week' | 'month' | 'all'>('week');
  const [comics, setComics] = useState<PopulerToday[]>([]);

  useEffect(() => {
    if (activeTab === 'week') {
      setComics(populerWeek);
    } else if (activeTab === 'month') {
      setComics(populerMonth);
    } else {
      setComics(populerAll);
    }
  }, [activeTab, populerWeek, populerMonth, populerAll]);

  return (
    <aside className="w-full space-y-4 sm:space-y-6">
      {/* Truyện phổ biến */}
      <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 shadow-sm">
        <h2 className="text-lg font-bold p-4 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
          Truyện phổ biến
        </h2>
        <div className="p-4 space-y-3">
          {/* Tab chọn thời gian */}
          <div className="flex border bg-background border-border rounded">
            <button
              onClick={() => setActiveTab('week')}
              className={`text-sm rounded w-full py-1 m-1 font-medium transition-colors duration-200 ${activeTab === 'week'
                ? 'bg-primary text-primary-foreground'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
            >
              Top tuần
            </button>
            <button
              onClick={() => setActiveTab('month')}
              className={`text-sm rounded w-full py-1 m-1 font-medium transition-colors duration-200 ${activeTab === 'month'
                ? 'bg-primary text-primary-foreground'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
            >
              Top tháng
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`text-sm rounded w-full py-1 m-1 font-medium transition-colors duration-200 ${activeTab === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
            >
              Tất cả
            </button>
          </div>
          {/* Nội dung truyện phổ biến */}
          <ul>
            {comics.map((comic, index) => (
              <li key={comic.id}>
                <Link
                  href={`/comic/${comic.slug}`}
                  className={`flex items-start gap-2 border-b border-gray-200 dark:border-gray-700 py-4 group ${index === comics.length - 1 ? 'border-b-0' : ''}`}>
                  <span className='w-6 h-6 self-center text-[13px] font-medium rounded border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 flex items-center justify-center'>
                    {index + 1}
                  </span>
                  {comic.thumbUrl ?
                    <Image
                      src={comic.thumbUrl}
                      alt={comic.name}
                      width={60}
                      height={100}
                      className='rounded h-[70px] object-cover group-hover:opacity-80 transition-opacity'
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                      onError={(e) => {
                        e.currentTarget.src = '/images/placeholder.svg';
                      }}
                    /> :
                    <Image
                      src="/images/placeholder.svg"
                      alt={comic.name}
                      width={60}
                      height={100}
                      className='rounded h-[70px] object-cover group-hover:opacity-80 transition-opacity'
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    />
                  }
                  <div className='flex flex-col gap-1'>
                    <span className='text-sm text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors'>{comic.name.length > 20 ? comic.name.slice(0, 20) + '...' : comic.name}</span>
                    <span className='text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1'>
                      <FiEye />
                      {comic.viewCount}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Thể loại hot */}
      <div className="mb-4 sm:mb-6 lg:mb-8 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 shadow-sm">
        <h2 className="text-lg font-bold p-4 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
          Thể loại phổ biến
        </h2>
        <div className="p-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-primary hover:text-primary-foreground dark:hover:bg-primary dark:hover:text-primary-foreground transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
