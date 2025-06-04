import { Skeleton } from '@/components/ui/skeleton';

export default function SharedBuildsLoading() {
  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center gap-4 mb-6">
        <Skeleton className="h-9 w-9 rounded-md" />
        <Skeleton className="h-8 w-48" />
      </div>
      
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="border rounded-lg p-4 bg-sidebar">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-24" />
              </div>
              <div className="space-y-2 text-right">
                <Skeleton className="h-5 w-20 ml-auto" />
                <Skeleton className="h-8 w-20 ml-auto" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
