export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <div className="h-6 w-24 animate-pulse rounded bg-gray-200"></div>
      </div>
      
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Product Images Skeleton */}
        <div className="space-y-4">
          <div className="aspect-square animate-pulse rounded-lg bg-gray-200"></div>
          <div className="aspect-square animate-pulse rounded-lg bg-gray-200"></div>
        </div>
        
        {/* Product Info Skeleton */}
        <div className="space-y-6">
          <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
          <div className="h-8 w-3/4 animate-pulse rounded bg-gray-200"></div>
          <div className="h-10 w-32 animate-pulse rounded bg-gray-200"></div>
          
          <div className="space-y-2">
            <div className="h-6 w-32 animate-pulse rounded bg-gray-200"></div>
            <div className="h-4 w-full animate-pulse rounded bg-gray-200"></div>
            <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200"></div>
          </div>
          
          <div className="space-y-2">
            <div className="h-6 w-32 animate-pulse rounded bg-gray-200"></div>
            <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
            <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
            <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
          </div>
          
          <div className="h-12 w-full animate-pulse rounded bg-gray-200"></div>
        </div>
      </div>
      
      {/* Related Products Skeleton */}
      <section className="mt-16">
        <div className="mb-6 h-8 w-48 animate-pulse rounded bg-gray-200"></div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="aspect-square animate-pulse rounded-lg bg-gray-200"></div>
              <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200"></div>
              <div className="h-6 w-24 animate-pulse rounded bg-gray-200"></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
} 