import { Skeleton } from "@/components/ui/skeleton"

const MenuItemSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 animate-[bounce-subtle_2s_ease-in-out_infinite]">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-20 w-20 rounded-lg flex-shrink-0" />
        
        <div className="flex-1 space-y-3">
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
        
        <div className="flex flex-col items-end space-y-2">
          <Skeleton className="h-8 w-16 rounded-md" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-6 w-8" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MenuItemSkeleton
