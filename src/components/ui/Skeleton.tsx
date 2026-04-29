import { cn } from "../../lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-white/5",
        className
      )}
    />
  );
}

// Card skeleton — for Portfolio / Services
export function SkeletonCard() {
  return (
    <div className="glass-card p-6 space-y-4 rounded-2xl">
      <Skeleton className="h-48 w-full rounded-xl" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
    </div>
  );
}

// Testimonial skeleton
export function SkeletonTestimonial() {
  return (
    <div className="glass-card p-6 space-y-4 rounded-2xl">
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
      <Skeleton className="h-3 w-4/5" />
      <div className="flex items-center gap-3 pt-2">
        <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-2 w-16" />
        </div>
      </div>
    </div>
  );
}

// Pricing skeleton
export function SkeletonPricing() {
  return (
    <div className="glass-card p-8 space-y-5 rounded-2xl">
      <Skeleton className="h-5 w-24" />
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-3 w-full" />
      {[1,2,3,4].map(i => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="h-4 w-4 rounded-full flex-shrink-0" />
          <Skeleton className="h-3 flex-1" />
        </div>
      ))}
    </div>
  );
}
