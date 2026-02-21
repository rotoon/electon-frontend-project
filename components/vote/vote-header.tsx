import { Building2, MapPin, Vote } from 'lucide-react'
import { PollStatusBadge } from '@/components/vote/poll-status-badge'
import { User } from '@/types/user'

interface VoteHeaderProps {
  user: User
  pollOpen?: boolean
}

export function VoteHeader({ user, pollOpen }: VoteHeaderProps) {
  return (
    <div className='bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-100 mb-6 md:mb-8'>
      <div className='flex flex-col md:flex-row justify-between md:items-start gap-4'>
        <div>
          <h1 className='text-xl md:text-2xl font-bold text-slate-800 mb-3 md:mb-4'>
            คูหาเลือกตั้งออนไลน์
          </h1>
          <div className='flex flex-wrap gap-2 md:gap-x-6 gap-y-3 text-slate-600'>
            <div className='flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100'>
              <MapPin className='w-4 h-4 text-primary' />
              <span className='text-sm font-medium'>
                จ.{user.province?.name}
              </span>
            </div>
            <div className='flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100'>
              <Building2 className='w-4 h-4 text-primary' />
              <span className='text-sm font-medium'>
                อ.{user.district?.name}
              </span>
            </div>
            <div className='flex items-center gap-2 bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10 w-full md:w-auto mt-2 md:mt-0'>
              <Vote className='w-4 h-4 text-primary' />
              <span className='text-sm font-bold text-primary'>
                เขตเลือกตั้งที่ {user.constituency?.number}
              </span>
            </div>
          </div>
        </div>
        <div className='mt-2 md:mt-0 flex justify-end'>
          <PollStatusBadge isOpen={pollOpen} />
        </div>
      </div>
    </div>
  )
}
