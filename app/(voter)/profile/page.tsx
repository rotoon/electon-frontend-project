'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/store/useAuthStore'
import {
  CircleUserRound,
  Hash,
  Home,
  Landmark,
  MapPin,
  Vote,
} from 'lucide-react'
import Link from 'next/link'

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuthStore()

  if (!isAuthenticated || !user) {
    return (
      <div className='flex flex-col items-center justify-center py-20 space-y-4'>
        <CircleUserRound className='w-16 h-16 text-slate-300' />
        <h1 className='text-2xl font-bold text-slate-700'>กรุณาเข้าสู่ระบบ</h1>
        <p className='text-slate-500'>คุณต้องเข้าสู่ระบบเพื่อดูข้อมูลโปรไฟล์</p>
        <Link
          href='/auth'
          className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
        >
          เข้าสู่ระบบ
        </Link>
      </div>
    )
  }

  // Format citizen ID: x-xxxx-xxxxx-xx-x
  const formatCitizenId = (id: string) => {
    if (id.length !== 13) return id
    return `${id[0]}-${id.slice(1, 5)}-${id.slice(5, 10)}-${id.slice(10, 12)}-${id[12]}`
  }

  return (
    <div className='max-w-3xl mx-auto space-y-6'>
      {/* Profile Header */}
      <div className='bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-lg'>
        <div className='flex items-center space-x-4'>
          <div className='w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center'>
            <CircleUserRound className='w-10 h-10 text-white' />
          </div>
          <div>
            <h1 className='text-2xl font-bold'>
              {user.firstName} {user.lastName}
            </h1>
            <p className='text-blue-100 text-sm mt-1'>
              สมาชิกตั้งแต่{' '}
              {new Date(user.createdAt).toLocaleDateString('th-TH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Info Cards Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {/* Personal Info */}
        <Card className='border-slate-200 shadow-sm'>
          <CardHeader className='pb-3'>
            <CardTitle className='text-base font-semibold text-slate-700 flex items-center gap-2'>
              <CircleUserRound className='w-4 h-4 text-blue-600' />
              ข้อมูลส่วนตัว
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <InfoRow
              icon={<Hash className='w-4 h-4' />}
              label='เลขบัตรประชาชน'
              value={formatCitizenId(user.citizenId)}
            />
            <InfoRow
              icon={<CircleUserRound className='w-4 h-4' />}
              label='ชื่อ-นามสกุล'
              value={`${user.firstName} ${user.lastName}`}
            />
          </CardContent>
        </Card>

        {/* Address Info */}
        <Card className='border-slate-200 shadow-sm'>
          <CardHeader className='pb-3'>
            <CardTitle className='text-base font-semibold text-slate-700 flex items-center gap-2'>
              <Home className='w-4 h-4 text-blue-600' />
              ที่อยู่
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <InfoRow
              icon={<MapPin className='w-4 h-4' />}
              label='ที่อยู่'
              value={user.address}
            />
            <InfoRow
              icon={<Landmark className='w-4 h-4' />}
              label='อำเภอ'
              value={user.district?.name || '-'}
            />
            <InfoRow
              icon={<MapPin className='w-4 h-4' />}
              label='จังหวัด'
              value={user.province?.name || '-'}
            />
          </CardContent>
        </Card>

        {/* Constituency Info */}
        <Card className='border-slate-200 shadow-sm'>
          <CardHeader className='pb-3'>
            <CardTitle className='text-base font-semibold text-slate-700 flex items-center gap-2'>
              <Vote className='w-4 h-4 text-blue-600' />
              เขตเลือกตั้ง
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <InfoRow
              icon={<Hash className='w-4 h-4' />}
              label='เขตเลือกตั้งที่'
              value={
                user.constituency?.number
                  ? `เขตที่ ${user.constituency.number}`
                  : '-'
              }
            />
            <div className='flex items-center justify-between'>
              <span className='text-sm text-slate-500'>สถานะ</span>
              {user.constituency ? (
                user.constituency.isClosed ? (
                  <Badge
                    variant='destructive'
                    className='text-xs'
                  >
                    ปิดรับสมัคร
                  </Badge>
                ) : (
                  <Badge className='bg-green-100 text-green-700 hover:bg-green-100 text-xs'>
                    เปิดรับสมัคร
                  </Badge>
                )
              ) : (
                <span className='text-sm text-slate-400'>-</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// === Sub Components ===

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className='flex items-center justify-between'>
      <div className='flex items-center gap-2 text-sm text-slate-500'>
        {icon}
        <span>{label}</span>
      </div>
      <span className='text-sm font-medium text-slate-800'>{value}</span>
    </div>
  )
}
