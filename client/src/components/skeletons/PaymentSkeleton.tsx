import React from "react";
import { Skeleton } from "@/components/ui/skeleton"

const PaymentSkeleton = React.memo(() => {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48 mb-6" />
      
      {/* Delivery Details */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          ))}
        </div>
      </div>
      
      {/* Payment Section */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-80" />
        
        <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-700 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange"></div>
            <span className="text-gray-600 dark:text-gray-400">Loading payment methods...</span>
          </div>
        </div>
        
        <Skeleton className="h-4 w-64" />
      </div>
      
      <Skeleton className="h-12 w-full rounded-md" />
      <Skeleton className="h-4 w-72 mx-auto" />
    </div>
  )
});

export default PaymentSkeleton
