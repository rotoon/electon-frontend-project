import { Skeleton } from '@/components/ui/skeleton'

export function VoteSkeletonList() {
  return (
    <div className='space-y-6 md:space-y-8 pb-20 md:pb-0'>
      <div className='bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-100 mb-6 md:mb-8'>
        <Skeleton className='h-7 w-40 mb-4' />
        <div className='flex flex-wrap gap-2 md:gap-4'>
          <Skeleton className='h-6 w-24' />
          <Skeleton className='h-6 w-24' />
          <Skeleton className='h-6 w-32' />
        </div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className='bg-white p-4 rounded-xl shadow-sm border border-slate-200'
          >
            <Skeleton className='h-48 w-full mb-4' />
            <Skeleton className='h-5 w-3/4 mb-2' />
            <Skeleton className='h-4 w-1/2' />
          </div>
        ))}
      </div>
    </div>
  )
}
