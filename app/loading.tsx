import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Skeleton className="w-9 h-9 rounded-lg" />
            <div>
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-3 w-32 mt-1" />
            </div>
          </div>
          <div className="flex-1 flex justify-center mx-4">
            <Skeleton className="h-8 w-48" />
          </div>
          <Skeleton className="h-9 w-16" />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-5 rounded-full" />
              </div>
              <Skeleton className="h-9 w-32 mb-1" />
              <Skeleton className="h-3 w-40" />
            </div>
          ))}
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-3 w-64" />
                </div>
                <Skeleton className="h-6 w-32 rounded-full" />
              </div>
              <Skeleton className="h-[300px] w-full rounded-lg" />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <Skeleton className="h-6 w-40 mb-4" />
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-full">
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-[500px] w-full rounded-lg" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
