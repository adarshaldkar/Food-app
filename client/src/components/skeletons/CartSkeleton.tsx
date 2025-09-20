import { Skeleton } from "@/components/ui/skeleton"

const CartSkeleton = () => {
  return (
    <div className="flex flex-col max-w-7xl mx-auto my-10">
      <div className="flex justify-end mb-6 px-4">
        <Skeleton className="h-10 w-24 rounded-md" />
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8 px-4">
        {/* Cart Items */}
        <div className="flex-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <Skeleton className="h-6 w-32 mb-6" />
            
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg animate-[bounce-subtle_2s_ease-in-out_infinite]"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-16 w-16 rounded-lg" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-6 w-8" />
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-8 w-16 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sticky top-4 animate-[float_3s_ease-in-out_infinite]">
            <Skeleton className="h-6 w-32 mb-6" />
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-12" />
              </div>
              
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-10" />
              </div>
              
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-8" />
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-16" />
                </div>
              </div>
              
              <Skeleton className="h-12 w-full rounded-md mt-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartSkeleton
