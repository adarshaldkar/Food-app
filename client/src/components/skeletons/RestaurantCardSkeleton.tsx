import { Skeleton } from "@/components/ui/skeleton"

const RestaurantCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-[float_3s_ease-in-out_infinite]">
      <div className="relative">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="absolute top-2 right-2 h-8 w-16 rounded-full" />
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-6 w-32" />
          <div className="flex items-center space-x-1">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-8" />
          </div>
        </div>
        
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-3" />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-9 w-20 rounded-md" />
        </div>
      </div>
    </div>
  )
}

export default RestaurantCardSkeleton
