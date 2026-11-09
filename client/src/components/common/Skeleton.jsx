/**
 * Skeleton loaders for product cards, lists, and general content.
 */

function Shimmer({ className = '' }) {
  return (
    <div
      className={`bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:600px_100%] animate-pulse rounded ${className}`}
      aria-hidden="true"
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="card p-3 space-y-3" aria-busy="true" aria-label="Loading product">
      <Shimmer className="aspect-square rounded-lg" />
      <div className="space-y-2 px-1">
        <Shimmer className="h-4 w-3/4" />
        <Shimmer className="h-3 w-1/2" />
        <Shimmer className="h-4 w-1/3" />
        <Shimmer className="h-8 w-full rounded-lg mt-2" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className="card p-4 space-y-2 text-center" aria-hidden="true">
      <Shimmer className="w-16 h-16 rounded-full mx-auto" />
      <Shimmer className="h-3 w-20 mx-auto" />
    </div>
  );
}

export function TextSkeleton({ lines = 3 }) {
  return (
    <div className="space-y-2" aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Shimmer key={i} className={`h-4 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} />
      ))}
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }) {
  return (
    <tr aria-hidden="true">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3 border-b border-surface-border">
          <Shimmer className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

export default Shimmer;
