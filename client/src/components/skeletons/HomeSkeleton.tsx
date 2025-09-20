import { Skeleton } from "@/components/ui/skeleton"
import RestaurantCardSkeleton from "./RestaurantCardSkeleton"

const HomeSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto my-10 px-4">
      {/* Hero Section Skeleton */}
      <div className="flex flex-col md:flex-row max-w-7xl mx-auto md:p-10 rounded-lg items-center justify-center m-4 gap-8">
        <div className="flex-1 animate-[float_2s_ease-in-out_infinite]">
          <Skeleton className="h-12 w-80 mb-4" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-3/4 mb-6" />
          
          {/* Search Bar */}
          <div className="relative flex items-center gap-2">
            <Skeleton className="h-12 flex-1 rounded-full" />
            <Skeleton className="h-12 w-12 rounded-full" />
          </div>
        </div>
        
        <div className="flex-1 flex justify-center animate-[bounce-subtle_3s_ease-in-out_infinite]">
          <Skeleton className="h-80 w-80 rounded-lg" />
        </div>
      </div>
      
      {/* Filter Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 my-8">
        <div className="w-full md:w-1/3">
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-10 w-20 rounded-full" />
          ))}
        </div>
      </div>
      
      {/* Section Title */}
      <div className="text-center mb-8">
        <Skeleton className="h-8 w-64 mx-auto mb-2" />
        <Skeleton className="h-4 w-96 mx-auto" />
      </div>
      
      {/* Restaurant Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="animate-[float_2s_ease-in-out_infinite]"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <RestaurantCardSkeleton />
          </div>
        ))}
      </div>
      
      {/* Load More Button */}
      <div className="text-center mt-8">
        <Skeleton className="h-12 w-32 mx-auto rounded-md" />
      </div>
    </div>
  )
}

export default HomeSkeleton
