'use client'

import { useDashboardStats } from '@/hooks/use-dashboard'
import { Button } from '@/components/ui/button'
import { User, Vote } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useMemo } from 'react'

// Mock data for demo
const mockPartyListData = [
  { name: 'พลังประชาชน', color: '#1e3a8a', votes: 8542120 },
  { name: 'ประชาชน', color: '#f97316', votes: 5234567 },
  { name: 'เพื่อไทย', color: '#dc2626', votes: 4123456 },
  { name: 'ประชาธิปัตย์', color: '#0ea5e9', votes: 2345678 },
  { name: 'ก้าวไกล', color: '#f59e0b', votes: 1823456 },
  { name: 'อื่นๆ', color: '#6b7280', votes: 3456789 },
]

export default function Home() {
  const { data, isLoading: loading } = useDashboardStats()

  // Get Top 3 Parties
  const topParties = useMemo(
    () =>
      data?.partyStats?.toSorted((a, b) => b.seats - a.seats).slice(0, 3) ?? [
        {
          id: 1,
          name: 'พลังประชาชน',
          leader: 'อนุทิน ชาญวิริ',
          seats: 193,
          color: '#1e3a8a',
          logoUrl: '',
        },
        {
          id: 2,
          name: 'ประชาชน',
          leader: 'ณัฐพล ร่วมประเสริ',
          seats: 118,
          color: '#f97316',
          logoUrl: '',
        },
        {
          id: 3,
          name: 'เพื่อไทย',
          leader: 'เศรษฐา ทวีสิน',
          seats: 74,
          color: '#dc2626',
          logoUrl: '',
        },
      ],
    [data?.partyStats],
  )

  const totalSeats = 500

  return (
    <div className='bg-gray-50 min-h-screen'>
      {/* Header */}
      <header className='bg-gradient-to-r from-blue-900 to-blue-800 text-white sticky top-0 z-50'>
        <div className='max-w-7xl mx-auto px-4 h-16 flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <div className='bg-white text-blue-900 p-2 rounded-lg'>
              <Vote className='w-5 h-5' aria-hidden='true' />
            </div>
            <div className='block'>
              <h1 className='font-bold text-lg sm:text-xl tracking-tight'>
                ELECTION
              </h1>
              <p className='text-[9px] sm:text-[10px] text-blue-200 font-semibold tracking-wider uppercase hidden xs:block'>
                ผลการเลือกตั้ง
              </p>
            </div>
          </div>

          {/* Top 3 Summary */}
          <div className='flex-1 flex justify-center mx-4 overflow-hidden'>
            {loading ? (
              <div className='h-2 w-24 bg-blue-700 rounded animate-pulse'></div>
            ) : (
              <div className='flex items-center space-x-4 overflow-x-auto no-scrollbar'>
                {topParties.map((p, i) => (
                  <div key={p.id} className='flex items-center space-x-2 shrink-0'>
                    <span className='text-xs font-bold text-blue-300 w-4'>{i + 1}</span>
                    {p.logoUrl ? (
                      <Image
                        src={p.logoUrl}
                        alt={p.name}
                        width={20}
                        height={20}
                        className='w-5 h-5 rounded-full object-cover border border-blue-400'
                        unoptimized
                      />
                    ) : (
                      <div className='w-5 h-5 rounded-full bg-blue-700 flex items-center justify-center'>
                        <span className='text-[10px] font-bold'>{p.name[0]}</span>
                      </div>
                    )}
                    <div className='flex flex-col leading-none'>
                      <span className='text-[10px] uppercase font-bold text-blue-200'>
                        {p.name}
                      </span>
                      <span className='text-sm font-semibold'>{p.seats}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className='flex items-center space-x-3'>
            <Button asChild size='sm' className='font-bold shadow-md bg-red-600 hover:bg-red-700'>
              <Link href='/vote'>ลงคะแนน</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Status Bar */}
      <div className='bg-gray-800 text-white text-center py-2'>
        <span className='text-yellow-400 font-bold'>●</span> อัปเดตล่าสุด 23
        ก.พ. 2569 | นับคะแนนแล้ว 94%
      </div>

      {/* Hero Leaderboard */}
      <section className='max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-4'>
        {topParties.map((party, idx) => (
          <div
            key={party.id}
            className='bg-white rounded-xl shadow-lg overflow-hidden border-t-4'
            style={{ borderTopColor: party.color }}
          >
            <div
              className='text-white text-center py-2 font-bold'
              style={{ backgroundColor: party.color }}
            >
              อันดับ {idx + 1}
            </div>
            <div className='p-6 text-center'>
              <div className='w-32 h-32 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center'>
                {party.logoUrl ? (
                  <Image
                    src={party.logoUrl}
                    alt={party.name}
                    width={80}
                    height={80}
                    className='w-20 h-20 rounded-full object-cover'
                    unoptimized
                  />
                ) : (
                  <User className='w-16 h-16 text-gray-400' />
                )}
              </div>
              <h3
                className='text-2xl font-bold mb-1'
                style={{ color: party.color }}
              >
                {party.name}
              </h3>
              <p className='text-gray-500 mb-4'>{party.leader}</p>
              <div
                className='text-5xl font-bold'
                style={{ color: party.color }}
              >
                {party.seats}
              </div>
              <p className='text-gray-500'>ที่นั่ง ส.ส.</p>
            </div>
          </div>
        ))}
      </section>

      {/* Main Content Grid */}
      <div className='max-w-7xl mx-auto px-4 pb-8 grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Left Column: Party List Votes */}
        <section className='bg-white rounded-xl shadow-lg p-6'>
          <h3 className='text-lg font-bold mb-4'>ผลคะแนน สส. บัญชีรายชื่อ</h3>
          <div className='text-sm text-gray-500 mb-4'>
            ผู้ใช้สิทธิ์ทั้งหมด:{' '}
            <span className='font-bold text-gray-800'>
              {(data?.totalVotes || 34565642).toLocaleString()} คน
            </span>
          </div>

          <div className='space-y-4'>
            {mockPartyListData.map((party) => (
              <div key={party.name}>
                <div className='flex justify-between mb-1'>
                  <span
                    className='font-medium'
                    style={{ color: party.color }}
                  >
                    {party.name}
                  </span>
                  <span className='font-bold'>
                    {party.votes.toLocaleString()}
                  </span>
                </div>
                <div className='h-4 bg-gray-100 rounded-full overflow-hidden'>
                  <div
                    className='h-full rounded-full'
                    style={{
                      width: `${(party.votes / 25000000) * 100}%`,
                      backgroundColor: party.color,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Right Column: MP Table */}
        <div className='lg:col-span-2 bg-white rounded-xl shadow-lg p-6'>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='text-lg font-bold'>
              จำนวน ส.ส. ในสภา (500 ที่นั่ง)
            </h3>
          </div>

          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='border-b-2'>
                  <th className='text-left py-3 px-2'>ลำดับ</th>
                  <th className='text-left py-3 px-2'>พรรค</th>
                  <th className='text-center py-3 px-2'>สส.เขต</th>
                  <th className='text-center py-3 px-2'>บัญชี</th>
                  <th className='text-center py-3 px-2 font-bold bg-gray-50'>
                    รวม
                  </th>
                </tr>
              </thead>
              <tbody>
                {topParties.map((party, idx) => (
                  <tr
                    key={party.id}
                    className='border-b'
                  >
                    <td
                      className='py-3 px-2 font-bold'
                      style={{ color: party.color }}
                    >
                      {idx + 1}
                    </td>
                    <td className='py-3 px-2'>
                      <div className='flex items-center'>
                        <span
                          className='w-3 h-3 rounded-full mr-2'
                          style={{ backgroundColor: party.color }}
                        ></span>
                        {party.name}
                      </div>
                    </td>
                    <td className='py-3 px-2 text-center'>
                      {Math.floor((party.seats || 0) * 0.75)}
                    </td>
                    <td className='py-3 px-2 text-center'>
                      {Math.ceil((party.seats || 0) * 0.25)}
                    </td>
                    <td className='py-3 px-2 text-center font-bold bg-gray-50'>
                      {party.seats}
                    </td>
                  </tr>
                ))}
                <tr className='border-b'>
                  <td className='py-3 px-2 font-bold text-gray-500'>4</td>
                  <td className='py-3 px-2'>
                    <div className='flex items-center'>
                      <span className='w-3 h-3 rounded-full bg-gray-400 mr-2'></span>
                      อื่นๆ
                    </div>
                  </td>
                  <td className='py-3 px-2 text-center'>20</td>
                  <td className='py-3 px-2 text-center'>15</td>
                  <td className='py-3 px-2 text-center font-bold bg-gray-50'>
                    35
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
