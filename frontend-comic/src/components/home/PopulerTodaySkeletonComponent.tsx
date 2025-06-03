import { Skeleton } from "@/components/ui/skeleton";

export default function PopulerTodaySkeletonComponent() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 shadow-sm">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <Skeleton className="h-6 w-48" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </div>

      {/* Carousel Skeleton */}
      <div className="p-4">
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className="flex-shrink-0 w-[180px]">
              <div className="mb-3">
                <Skeleton className="h-[230px] w-full rounded" />
              </div>
              <div className="flex flex-col gap-2 items-center">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 