'use client'

import { useDashboardStats } from '@/hooks/use-dashboard'
import { Button } from '@/components/ui/button'
import { Vote, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState, useRef } from 'react'
import { cn } from '@/lib/utils'
import { LeftSidebar } from '@/components/LeftSidebar'

export default function Home() {
  const { data, isLoading: loading } = useDashboardStats()

  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const [activeZIndex, setActiveZIndex] = useState<number | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = (idx: number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setHoveredIdx(idx)
    setActiveZIndex(idx)
  }

  const handleMouseLeave = (idx: number) => {
    setHoveredIdx(null)
    timeoutRef.current = setTimeout(() => {
      setActiveZIndex((prev) => (prev === idx ? null : prev))
    }, 500)
  }

  // Get Top Parties
  const topParties = useMemo(
    () =>
      data?.partyStats?.toSorted((a, b) => b.seats - a.seats) ?? [
        {
          id: 1,
          name: 'พลังประชาชน',
          leader: 'อนุทิน ชาญวิริ',
          seats: 193,
          color: '#2d2e83', // Bhumjaithai blue
          logoUrl: '',
        },
        {
          id: 2,
          name: 'ประชาชน',
          leader: 'ณัฐพล ร่วมประเสริ',
          seats: 118,
          color: '#f04e23', // Move Forward orange
          logoUrl: '',
        },
        {
          id: 3,
          name: 'เพื่อไทย',
          leader: 'เศรษฐา ทวีสิน',
          seats: 74,
          color: '#e10019', // Pheu Thai red
          logoUrl: '',
        },
        {
          id: 4,
          name: 'รวมไทยสร้างชาติ',
          leader: 'พีระพันธุ์',
          seats: 36,
          color: '#2D328F',
          logoUrl: '',
        },
        {
          id: 5,
          name: 'ประชาธิปัตย์',
          leader: 'เฉลิมชัย',
          seats: 25,
          color: '#00AEEF',
          logoUrl: '',
        },
      ],
    [data?.partyStats],
  )

  const top3 = topParties.slice(0, 3)

  return (
    <div className='flex flex-col lg:flex-row min-h-screen bg-[#121212] text-white font-sans overflow-hidden'>
      {/* Left Sidebar (~20%) */}
      <LeftSidebar />
      {/* Center Hero Section (~50%) */}
      <main className='flex-1 relative overflow-hidden flex flex-col items-center justify-center p-8 min-h-[500px] bg-[#151515]'>
        {/* Subtle radial background effect */}
        <div
          className='absolute inset-0 opacity-[0.03] pointer-events-none'
          style={{
            backgroundImage:
              'radial-gradient(circle, #ffffff 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Top Gradient Blur */}
        <div className='absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#c5a059]/5 to-transparent pointer-events-none' />

        <div className='relative w-full max-w-3xl flex items-center justify-center h-[450px] mt-10 lg:mt-0'>
          {loading ? (
            <div className='flex items-center justify-center h-full'>
              <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#c5a059]'></div>
            </div>
          ) : (
            <div className='flex items-end justify-center w-full relative h-[380px]'>
              {/* 2nd Place (Left) */}
              {top3[1] && (
                <div
                  className={cn(
                    'absolute left-[5%] md:left-1/2 md:-translate-x-[135%] bottom-0 w-[200px] md:w-[240px] transform -rotate-8 origin-bottom-right transition-all duration-500 ease-out hover:-translate-y-4 hover:scale-105 animate-in fade-in slide-in-from-right-20',
                    activeZIndex === 1 ? 'z-50' : 'z-10',
                  )}
                  style={{
                    animationDuration: '800ms',
                    animationDelay: '400ms',
                    animationFillMode: 'both',
                  }}
                  onMouseEnter={() => handleMouseEnter(1)}
                  onMouseLeave={() => handleMouseLeave(1)}
                >
                  <HeroCard
                    party={top3[1]}
                    rank={2}
                  />
                </div>
              )}

              {/* 1st Place (Center) */}
              {top3[0] && (
                <div
                  className={cn(
                    'absolute left-1/2 -translate-x-1/2 bottom-8 w-[240px] md:w-[280px] transform transition-all duration-500 ease-out hover:-translate-y-4 hover:scale-105 animate-in fade-in slide-in-from-bottom-24',
                    activeZIndex === 0 ? 'z-50' : 'z-30',
                  )}
                  style={{
                    animationDuration: '600ms',
                    animationFillMode: 'both',
                  }}
                  onMouseEnter={() => handleMouseEnter(0)}
                  onMouseLeave={() => handleMouseLeave(0)}
                >
                  <HeroCard
                    party={top3[0]}
                    rank={1}
                  />
                </div>
              )}

              {/* 3rd Place (Right) */}
              {top3[2] && (
                <div
                  className={cn(
                    'absolute right-[5%] md:left-1/2 md:translate-x-[35%] bottom-0 w-[200px] md:w-[240px] transform rotate-8 origin-bottom-left transition-all duration-500 ease-out hover:-translate-y-4 hover:scale-105 animate-in fade-in slide-in-from-left-20',
                    activeZIndex === 2 ? 'z-50' : 'z-20',
                  )}
                  style={{
                    animationDuration: '800ms',
                    animationDelay: '600ms',
                    animationFillMode: 'both',
                  }}
                  onMouseEnter={() => handleMouseEnter(2)}
                  onMouseLeave={() => handleMouseLeave(2)}
                >
                  <HeroCard
                    party={top3[2]}
                    rank={3}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className='absolute bottom-8 z-40 flex justify-center w-full'>
          <Button
            asChild
            size='lg'
            className='font-bold bg-[#c5a059] hover:bg-[#b08d48] text-black rounded-xl px-8 h-12 shadow-lg shadow-[#c5a059]/20 transition-all'
          >
            <Link href='/vote'>เข้าสู่ระบบลงคะแนน / จัดการ</Link>
          </Button>
        </div>
      </main>

      {/* Right Sidebar Results (~30%) */}
      <aside className='w-full lg:w-[420px] bg-[#1a1a1a] p-6 lg:p-8 flex flex-col h-auto lg:h-screen overflow-y-auto border-t lg:border-l border-white/5 relative z-20 shadow-2xl'>
        <div className='mb-6 sticky top-0 bg-[#1a1a1a] pt-2 pb-4 z-10 border-b border-white/10'>
          <div className='flex items-center justify-between'>
            <div>
              <h2 className='text-xl font-black text-white'>ผลคะแนน สส.เขต</h2>
              <p className='text-sm text-white/50 mt-1'>
                จัดอันดับตามจำนวนที่นั่งอย่างไม่เป็นทางการ
              </p>
            </div>
            <div className='bg-[#c5a059]/10 text-[#c5a059] px-3 py-1 rounded-full text-xs font-bold border border-[#c5a059]/20'>
              LIVE
            </div>
          </div>
        </div>

        <div className='flex-1 overflow-y-auto no-scrollbar space-y-2 pb-10'>
          <div className='flex text-[11px] font-bold text-white/40 uppercase pb-2 px-1'>
            <div className='w-8 text-center'>#</div>
            <div className='flex-1 px-3'>พรรค</div>
            <div className='w-16 text-center'>สส.เขต</div>
          </div>

          {loading ? (
            <div className='space-y-3 mt-4'>
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className='h-14 bg-white/5 animate-pulse rounded-xl'
                ></div>
              ))}
            </div>
          ) : (
            topParties.map((party, idx) => (
              <div
                key={party.id}
                className={cn(
                  'flex items-center py-3 border border-white/5 transition-all hover:bg-white/5 rounded-xl px-2 group',
                  idx === 0 ? 'bg-white/[0.04] shadow-lg' : 'bg-[#151515]',
                )}
                style={
                  idx === 0
                    ? {
                        borderBottomWidth: '2px',
                        borderBottomColor: party.color,
                      }
                    : {}
                }
              >
                <div className='w-8 flex justify-center'>
                  <div className='w-6 h-6 rounded-full bg-black/40 flex items-center justify-center text-[10px] font-bold text-white/60 group-hover:text-white transition-colors'>
                    {idx + 1}
                  </div>
                </div>
                <div className='flex-1 px-3 flex items-center space-x-3 overflow-hidden'>
                  {party.logoUrl ? (
                    <Image
                      src={party.logoUrl}
                      alt={party.name}
                      width={28}
                      height={28}
                      className='w-7 h-7 rounded-full object-cover bg-white shrink-0'
                      unoptimized
                    />
                  ) : (
                    <div
                      className='w-7 h-7 rounded-full shrink-0 flex items-center justify-center shadow-sm'
                      style={{ backgroundColor: party.color }}
                    >
                      <span className='text-[9px] font-bold text-white'>
                        {party.name[0]}
                      </span>
                    </div>
                  )}
                  <span className='font-bold text-sm text-white/90 truncate'>
                    {party.name}
                  </span>
                </div>
                <div className='w-16 text-center shrink-0'>
                  <span
                    className='font-black text-xl'
                    style={{ color: party.color }}
                  >
                    {party.seats}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>
    </div>
  )
}

function HeroCard({ party, rank }: { party: any; rank: number }) {
  return (
    <div className='bg-[#1e1e1e] rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col h-full group'>
      {/* Top Banner */}
      <div
        className='h-12 bg-white/5 flex items-center justify-between px-4 border-b border-white/5 transition-colors group-hover:bg-white/10'
        style={{ borderTop: `4px solid ${party.color}` }}
      >
        <div className='flex items-center space-x-2'>
          {party.logoUrl ? (
            <Image
              src={party.logoUrl}
              alt={party.name}
              width={28}
              height={28}
              className='w-7 h-7 rounded-full object-cover bg-white shadow-sm'
              unoptimized
            />
          ) : (
            <div
              className='w-7 h-7 rounded-full shrink-0 flex items-center justify-center shadow-sm'
              style={{ backgroundColor: party.color }}
            >
              <span className='text-[10px] font-bold text-white'>
                {party.name[0]}
              </span>
            </div>
          )}
          <span className='text-sm font-bold text-white truncate max-w-[120px]'>
            {party.name}
          </span>
        </div>
      </div>

      {/* Candidate Image Placeholder */}
      <div className='flex-1 relative bg-gradient-to-t from-black/90 via-black/40 to-black/10 flex flex-col justify-end aspect-[5/4]'>
        {/* Subtle pattern background */}
        <div
          className='absolute inset-0 opacity-20'
          style={{ backgroundColor: party.color }}
        ></div>

        {/* Placeholder Silhouette */}
        <div className='absolute inset-0 flex items-end justify-center pb-8 z-0'>
          <User className='w-32 h-32 text-white/10' />
        </div>

        {/* Leader Name */}
        <div className='relative w-full text-center z-10 pb-4 px-2'>
          <div className='inline-block bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10'>
            <span className='text-xs font-bold text-white/90 drop-shadow-md'>
              {party.leader}
            </span>
          </div>
        </div>
      </div>

      {/* Seat Count (ThaiPBS style light block) */}
      <div className='bg-[#fdf3e7] p-5 text-center flex flex-col items-center justify-center relative overflow-hidden transition-colors group-hover:bg-white'>
        <div className='absolute top-0 right-0 w-24 h-24 bg-black/[0.03] rounded-bl-[100px] -mr-8 -mt-8'></div>
        <span className='text-[11px] font-bold text-[#1a110a]/50 uppercase tracking-widest mb-1 relative z-10'>
          สส.เขต
        </span>
        <span className='text-6xl font-black text-[#1a110a] leading-none tracking-tighter relative z-10'>
          {party.seats}
        </span>
      </div>
    </div>
  )
}
