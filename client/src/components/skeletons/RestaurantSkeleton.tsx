import { Skeleton } from "@/components/ui/skeleton"
import MenuItemSkeleton from "./MenuItemSkeleton"

const RestaurantSkeleton = () => {
  return (
    <div className="max-w-6xl mx-auto my-10 px-4">
      {/* Restaurant Header */}
      <div className="relative">
        <Skeleton className="h-64 w-full rounded-lg mb-8" />
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 -mt-20 relative z-10 animate-[float_2s_ease-in-out_infinite]">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <Skeleton className="h-24 w-24 rounded-lg flex-shrink-0" />
            
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Skeleton className="h-6 w-20" />
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Skeleton key={star} className="h-5 w-5 rounded-full" />
                  ))}
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 my-8">
        <div className="flex-1">
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-10 w-20 rounded-full" />
          ))}
        </div>
      </div>
      
      {/* Menu Section */}
      <div className="space-y-6">
        <Skeleton className="h-8 w-48 mb-6" />
        
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="animate-[bounce-subtle_2s_ease-in-out_infinite]"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <MenuItemSkeleton />
            </div>
          ))}
        </div>
      </div>
      
      {/* Load More */}
      <div className="text-center mt-8">
        <Skeleton className="h-10 w-32 mx-auto rounded-md" />
      </div>
    </div>
  )
}

export default RestaurantSkeleton
