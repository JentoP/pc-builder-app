import { Skeleton } from '@/components/ui/skeleton';

export default function SharedBuildLoading() {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-8">
        <Skeleton className="h-9 w-24 mb-4" />
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-48" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 border rounded bg-sidebar">
            <Skeleton className="w-16 h-16 rounded" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-3 w-1/4" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-4 border-t">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-32" />
        </div>
        <Skeleton className="h-10 w-40 mt-6" />
      </div>
    </div>
  );
}
