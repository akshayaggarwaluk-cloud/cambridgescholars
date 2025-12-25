import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface BookCardSkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export function BookCardSkeleton({ className, style }: BookCardSkeletonProps) {
  return (
    <div
      className={cn(
        "relative bg-card rounded-2xl overflow-hidden",
        "border border-border/50 shadow-card",
        className
      )}
      style={style}
    >
      {/* Image skeleton */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <Skeleton className="w-full h-full rounded-none" />
        
        {/* Floating wishlist button skeleton */}
        <div className="absolute top-4 right-4">
          <Skeleton className="w-11 h-11 rounded-full" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="p-6 space-y-4">
        {/* Category */}
        <Skeleton className="h-3 w-16 rounded-full" />
        
        {/* Title - two lines */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-full rounded-lg" />
          <Skeleton className="h-5 w-3/4 rounded-lg" />
        </div>
        
        {/* Author */}
        <Skeleton className="h-4 w-24 rounded-lg" />

        {/* Rating & Price */}
        <div className="flex items-center justify-between pt-5 border-t border-border/50">
          {/* Rating stars */}
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-4 rounded" />
              ))}
            </div>
            <Skeleton className="h-4 w-6 rounded" />
          </div>
          
          {/* Price */}
          <Skeleton className="h-6 w-16 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function BookCardSkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <BookCardSkeleton 
          key={index} 
          className="animate-fade-up"
          style={{ animationDelay: `${index * 0.05}s` } as React.CSSProperties}
        />
      ))}
    </div>
  );
}