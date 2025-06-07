import { Skeleton } from "@/components/ui/skeleton"

export function DashboardSkeleton() {
    return (
        <div className="p-4 mb-32 max-w-10xl mx-auto">
            <Skeleton className="h-10 w-64 mx-auto mb-10" />
            <div className="my-4">
                <Skeleton className="h-32 w-full rounded-lg" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array(6).fill(0).map((_, i) => (
                    <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                        <Skeleton className="h-8 w-48 mb-4" />
                        <Skeleton className="h-8 w-48 mb-2" />
                        <Skeleton className="h-8 w-48 mb-6" />
                    </div>
                ))}
            </div>
        </div>
    )
}
