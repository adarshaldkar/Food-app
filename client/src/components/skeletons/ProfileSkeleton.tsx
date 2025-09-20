import { Skeleton } from "@/components/ui/skeleton"

const ProfileSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto my-10 px-4">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Section - Profile Info */}
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <div className="flex flex-col items-center mb-6 animate-[float_2s_ease-in-out_infinite]">
            <Skeleton className="h-24 w-24 rounded-full mb-4" />
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-24" />
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            
            <div className="space-y-2">
              <Skeleton className="h-4 w-18" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            
            <div className="space-y-2">
              <Skeleton className="h-4 w-14" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            
            <Skeleton className="h-11 w-full rounded-md mt-6" />
          </div>
        </div>
        
        {/* Right Section - Additional Info */}
        <div className="flex-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-4 w-40" />
              </div>
              <div className="flex items-center space-x-3">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-4 w-36" />
              </div>
              <div className="flex items-center space-x-3">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-4 w-44" />
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg animate-[bounce-subtle_3s_ease-in-out_infinite]">
            <Skeleton className="h-6 w-28 mb-4" />
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <Skeleton className="h-8 w-12 mx-auto mb-2" />
                <Skeleton className="h-4 w-16 mx-auto" />
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <Skeleton className="h-8 w-12 mx-auto mb-2" />
                <Skeleton className="h-4 w-20 mx-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileSkeleton
