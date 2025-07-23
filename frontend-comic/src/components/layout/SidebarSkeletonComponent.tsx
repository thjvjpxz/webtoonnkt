import { Skeleton } from "@/components/ui/skeleton";

export default function SidebarSkeletonComponent() {
  return (
    <aside className="w-full space-y-4 sm:space-y-6">
      {/* Truyện phổ biến skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 shadow-sm">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <Skeleton className="h-6 w-32" />
        </div>

        <div className="p-4 space-y-3">
          {/* Tabs skeleton - giống với cấu trúc thực tế */}
          <div className="flex border bg-gray-200 dark:bg-gray-700 rounded">
            <div className="text-sm rounded w-full py-1 m-1">
              <Skeleton className="h-6 w-full rounded" />
            </div>
            <div className="text-sm rounded w-full py-1 m-1">
              <Skeleton className="h-6 w-full rounded" />
            </div>
            <div className="text-sm rounded w-full py-1 m-1">
              <Skeleton className="h-6 w-full rounded" />
            </div>
          </div>

          {/* Comic list skeleton */}
          <ul>
            {Array.from({ length: 5 }, (_, index) => (
              <li key={index}>
                <div className={`flex items-start gap-2 border-b border-gray-200 dark:border-gray-700 py-4 ${index === 4 ? 'border-b-0' : ''}`}>
                  <Skeleton className="w-6 h-6 rounded" />
                  <Skeleton className="h-[70px] w-[60px] rounded" />
                  <div className="flex flex-col gap-1 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Thể loại hot skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 shadow-sm">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <Skeleton className="h-6 w-28" />
        </div>

        {/* Categories skeleton */}
        <div className="p-4">
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 8 }, (_, index) => (
              <Skeleton key={index} className="h-7 w-20 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
} 