import { Skeleton } from "@/components/ui/skeleton";

export default function ComicLastUpdateSkeletonComponent() {
  return (
    <div className="my-4 sm:my-6 lg:my-8 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 shadow-sm">
      {/* Header Skeleton */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <Skeleton className="h-6 w-40" />
      </div>

      {/* Comic List Skeleton */}
      <div className="p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 border-b border-gray-200 dark:border-gray-700 pb-4 ${index >= 4 ? 'border-b-0' : ''
                }`}
            >
              {/* Ảnh thumbnail skeleton */}
              <Skeleton className="h-[150px] w-[120px] rounded flex-shrink-0" />

              {/* Nội dung skeleton */}
              <div className="flex-1">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 