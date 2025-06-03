'use client';

import PopulerTodayComponent from "./PopulerTodayComponent";
import Sidebar from "../layout/Sidebar";
import ComicLastUpdateComponent from "./ComicLastUpdateComponent";
import useHome from "@/hooks/useHome";
import PopulerTodaySkeletonComponent from "./PopulerTodaySkeletonComponent";
import ComicLastUpdateSkeletonComponent from "./ComicLastUpdateSkeletonComponent";
import SidebarSkeletonComponent from "../layout/SidebarSkeletonComponent";

export default function Content() {
  const {
    populerToday,
    populerWeek,
    populerMonth,
    populerAll,
    comicLastUpdate,
    categories,
    isLoading,
    error
  } = useHome();

  // Hiển thị error state
  if (error) {
    return (
      <main className="w-full">
        <div className="mt-4 sm:mt-6 lg:mt-8">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
              Có lỗi xảy ra
            </h3>
            <p className="text-red-600 dark:text-red-300">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full">
      <div className="mt-4 sm:mt-6 lg:mt-8 flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
        <div className="flex-1 min-w-0">
          {/* Populer Today Section */}
          {isLoading ? (
            <PopulerTodaySkeletonComponent />
          ) : (
            <PopulerTodayComponent comics={populerToday} />
          )}

          {/* Comic Last Update Section */}
          {isLoading ? (
            <ComicLastUpdateSkeletonComponent />
          ) : (
            <ComicLastUpdateComponent comics={comicLastUpdate} />
          )}
        </div>

        <div className="w-full lg:w-80 xl:w-96 flex-shrink-0">
          {/* Sidebar Section */}
          {isLoading ? (
            <SidebarSkeletonComponent />
          ) : (
            <Sidebar
              populerWeek={populerWeek}
              populerMonth={populerMonth}
              populerAll={populerAll}
              categories={categories}
            />
          )}
        </div>
      </div>
    </main>
  );
}
