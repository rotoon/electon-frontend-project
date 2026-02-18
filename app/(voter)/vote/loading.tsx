import { Skeleton } from "@/components/ui/skeleton";

export default function VoteLoading() {
  return (
    <div className="space-y-6 md:space-y-8 pb-20 md:pb-0">
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-100 mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
          <div className="flex-1">
            <Skeleton className="h-7 w-48 mb-4" />
            <div className="flex flex-wrap gap-2 md:gap-4">
              <Skeleton className="h-8 w-28 rounded-lg" />
              <Skeleton className="h-8 w-28 rounded-lg" />
              <Skeleton className="h-8 w-40 rounded-lg" />
            </div>
          </div>
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-start gap-4 mb-4">
              <Skeleton className="w-16 h-16 rounded-[18px]" />
              <div className="flex-1">
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}
