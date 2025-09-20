import { useState } from "react"
import { Skeleton } from "./skeleton"

interface SkeletonImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string
  skeletonClassName?: string
}

const SkeletonImage = ({ 
  src, 
  alt, 
  className, 
  fallback, 
  skeletonClassName,
  ...props 
}: SkeletonImageProps) => {
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  const handleImageLoad = () => {
    setImageLoading(false)
  }

  const handleImageError = () => {
    setImageLoading(false)
    setImageError(true)
  }

  if (imageError) {
    return (
      <div className={`bg-gray-200 dark:bg-gray-800 flex items-center justify-center ${className}`}>
        <span className="text-gray-400 text-sm">
          {fallback || "Image failed to load"}
        </span>
      </div>
    )
  }

  return (
    <div className="relative">
      {imageLoading && (
        <Skeleton 
          className={`absolute inset-0 z-10 ${skeletonClassName}`} 
        />
      )}
      <img
        src={src}
        alt={alt}
        className={`transition-opacity duration-300 ${
          imageLoading ? 'opacity-0' : 'opacity-100'
        } ${className}`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        {...props}
      />
    </div>
  )
}

export { SkeletonImage }
