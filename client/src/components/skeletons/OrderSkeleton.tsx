import { Skeleton } from "@/components/ui/skeleton"

const OrderSkeleton = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 max-w-2xl w-full animate-[float_2s_ease-in-out_infinite]">
        {/* Status Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Skeleton className="h-8 w-8 rounded-full mr-3" />
            <Skeleton className="h-8 w-48" />
          </div>
          <Skeleton className="h-6 w-32 mx-auto mb-4 rounded-full" />
          <Skeleton className="h-4 w-80 mx-auto mb-2" />
          <Skeleton className="h-3 w-64 mx-auto" />
        </div>
        
        {/* Order Summary */}
        <div className="mb-6">
          <Skeleton className="h-6 w-32 mb-4" />
          
          <div className="border rounded-lg p-4 mb-4">
            <div className="mb-2 space-y-1">
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-4 w-48" />
            </div>
            
            {/* Order Items */}
            <div className="space-y-3 mb-4">
              {[1, 2].map((item) => (
                <div key={item} className="flex items-center space-x-4 animate-[bounce-subtle_1.5s_ease-in-out_infinite]" style={{ animationDelay: `${item * 0.2}s` }}>
                  <Skeleton className="h-12 w-12 rounded-md flex-shrink-0" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <div className="text-right">
                    <Skeleton className="h-4 w-12" />
                  </div>
                </div>
              ))}
            </div>
            
            {/* Total */}
            <div className="border-t pt-3 flex justify-between items-center">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-16" />
            </div>
          </div>
        </div>
        
        {/* Action Button */}
        <Skeleton className="h-12 w-full rounded-md" />
      </div>
    </div>
  )
}

export default OrderSkeleton
