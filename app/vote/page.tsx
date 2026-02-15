'use client'

import VoterLayout from '@/components/shared/voter-layout'
import { Button } from '@/components/ui/button'
import { useCandidates } from '@/hooks/use-candidates'
import { useConstituencyStatus } from '@/hooks/use-constituencies'
import { useMyVote, useVoteMutation } from '@/hooks/use-vote'
import { useAuthStore } from '@/store/useAuthStore'
import { Building2, CheckCircle2, MapPin, User, Vote } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Candidate } from '@/types/candidate'
import { useEffect, useState } from 'react'

import { toast } from 'sonner'

export default function VotePage() {
  const { user, isAuthenticated } = useAuthStore()
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(
    null,
  )

  // Queries
  const constituencyId = user?.constituency?.id

  const { data: constituency, isLoading: loadingConst } =
    useConstituencyStatus(constituencyId)
  const { data: candidates, isLoading: loadingCand } = useCandidates(
    constituencyId?.toString(),
  )
  const { data: currentVote, isLoading: loadingVote } = useMyVote(user?.id)

  // Mutation
  const voteMutation = useVoteMutation()

  // Derived state
  const pollOpen = constituency?.is_poll_open
  const isLoading = loadingConst || loadingCand || loadingVote
  const canSubmit = pollOpen && selectedCandidate && !voteMutation.isPending

  // Vote button text
  const getButtonText = () => {
    if (voteMutation.isPending) return 'กำลังบันทึก…'
    return currentVote ? 'เปลี่ยนคะแนนโหวต' : 'ยืนยันการลงคะแนน'
  }

  // Handlers
  const handleVote = () => {
    if (!pollOpen) return toast.error('หีบเลือกตั้งปิดแล้ว ไม่สามารถลงคะแนนได้')
    if (!selectedCandidate) return toast.error('กรุณาเลือกผู้สมัคร')
    if (!constituencyId || !user?.id) return

    voteMutation.mutate({
      userId: user.id,
      candidateId: selectedCandidate,
      constituencyId: constituencyId,
      isUpdate: !!currentVote,
    })
  }

  const handleSelectCandidate = (candidateId: number) => {
    if (pollOpen) setSelectedCandidate(candidateId)
  }

  // Pre-select candidate if user has voted - narrowed dependency to specific value
  const currentCandidateId = currentVote?.candidate_id
  useEffect(() => {
    if (currentCandidateId) {
      setSelectedCandidate(currentCandidateId)
    }
  }, [currentCandidateId])
  // Render: Loading
  if (isLoading) {
    return (
      <VoterLayout>
        <div className='flex h-[50vh] items-center justify-center'>
          <div className='animate-spin motion-reduce:animate-none rounded-full h-12 w-12 border-b-2 border-primary' />
        </div>
      </VoterLayout>
    )
  }

  // Render: Not authenticated
  if (!isAuthenticated || !user) {
    return (
      <VoterLayout>
        <div className='text-center py-20'>
          <h1 className='text-2xl  mb-4'>กรุณาเข้าสู่ระบบเพื่อใช้สิทธิ</h1>
          <Button asChild>
            <Link href='/auth'>เข้าสู่ระบบ</Link>
          </Button>
        </div>
      </VoterLayout>
    )
  }

  // Find voted candidate info
  const votedCandidate = candidates?.find(
    (c) => c.id === currentVote?.candidate_id,
  )

  return (
    <VoterLayout>
      <div className='space-y-8'>
        {/* Header */}
        {/* Header - Enriched District Info */}
        {isAuthenticated && (
          <div className='bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 mb-8'>
            <div className='flex flex-col md:flex-row justify-between md:items-start gap-4'>
              <div>
                <h1 className='text-2xl font-bold text-slate-800 mb-4'>
                  คูหาเลือกตั้งออนไลน์
                </h1>
                <div className='flex flex-wrap gap-x-6 gap-y-3 text-slate-600'>
                  <div className='flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100'>
                    <MapPin className='w-4 h-4 text-primary' />
                    <span className='text-sm font-medium'>
                      จังหวัด{user.province?.name}
                    </span>
                  </div>
                  <div className='flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100'>
                    <Building2 className='w-4 h-4 text-primary' />
                    <span className='text-sm font-medium'>
                      อำเภอ{user.district?.name}
                    </span>
                  </div>
                  <div className='flex items-center gap-2 bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10'>
                    <Vote className='w-4 h-4 text-primary' />
                    <span className='text-sm font-bold text-primary'>
                      เขตเลือกตั้งที่ {user.constituency?.number}
                    </span>
                  </div>
                </div>
              </div>
              <div className='mt-2 md:mt-0'>
                <PollStatusBadge isOpen={pollOpen} />
              </div>
            </div>
          </div>
        )}

        {/* Vote confirmation info */}
        {currentVote && votedCandidate && (
          <div className='bg-primary/10 border border-primary/20 p-4 rounded-lg flex items-center text-primary'>
            <CheckCircle2
              className='w-5 h-5 mr-3 flex-shrink-0'
              aria-hidden='true'
            />
            <span>
              คุณได้ลงคะแนนให้{' '}
              <strong>หมายเลข {votedCandidate.candidate_number}</strong> แล้ว
              {pollOpen && ' (สามารถเปลี่ยนได้)'}
            </span>
          </div>
        )}

        {/* Candidates Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {candidates?.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              isSelected={selectedCandidate === candidate.id}
              isDisabled={!pollOpen}
              onSelect={() => handleSelectCandidate(candidate.id)}
            />
          ))}
        </div>

        {/* Mobile Action Footer */}
        <div className='fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-center shadow-lg md:hidden z-20'>
          <Button
            size='lg'
            className='w-full max-w-sm text-lg shadow-xl'
            onClick={handleVote}
            disabled={!canSubmit}
          >
            {getButtonText()}
          </Button>
        </div>

        {/* Desktop Action Button */}
        <div className='hidden md:flex justify-end pb-10'>
          <Button
            size='lg'
            className='text-lg px-12 py-6 shadow-xl'
            onClick={handleVote}
            disabled={!canSubmit}
          >
            {getButtonText()}
          </Button>
        </div>
      </div>
    </VoterLayout>
  )
}

// === Sub Components ===

interface PollStatusBadgeProps {
  isOpen?: boolean
}

function PollStatusBadge({ isOpen }: PollStatusBadgeProps) {
  if (isOpen) {
    return (
      <span className='px-4 py-2 rounded-full bg-green-100 text-green-700  flex items-center'>
        <span className='w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse motion-reduce:animate-none' />
        หีบเปิดอยู่
      </span>
    )
  }
  return (
    <span className='px-4 py-2 rounded-full bg-red-100 text-red-700  flex items-center'>
      <span className='w-2 h-2 bg-red-500 rounded-full mr-2' />
      หีบปิดแล้ว
    </span>
  )
}

interface CandidateCardProps {
  candidate: Candidate
  isSelected: boolean
  isDisabled: boolean
  onSelect: () => void
}

function CandidateCard({
  candidate,
  isSelected,
  isDisabled,
  onSelect,
}: CandidateCardProps) {
  const partyColor = candidate.party?.color || 'var(--primary)' // Default to system primary
  const partyName = candidate.party?.name || 'ผู้สมัครอิสระ'
  const partyLogo = candidate.party?.logo_url

  return (
    <div
      className={`group relative flex flex-col rounded-xl overflow-hidden cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] transform will-change-transform
        ${isDisabled ? 'opacity-60 grayscale cursor-not-allowed scale-100' : 'hover:-translate-y-2 hover:shadow-2xl active:scale-[0.98]'}
        ${isSelected ? 'shadow-[0_20px_40px_rgba(0,0,0,0.12)] ring-4 ring-offset-4 ring-offset-white ring-[color:var(--party-color)]' : 'shadow-[0_8px_24px_rgba(0,0,0,0.06)] border border-white/50'}
        bg-white/90 backdrop-blur-3xl
      `}
      style={
        {
          '--party-color': partyColor,
        } as React.CSSProperties
      }
      onClick={!isDisabled ? onSelect : undefined}
      role='button'
      tabIndex={isDisabled ? -1 : 0}
      onKeyDown={(e) => !isDisabled && e.key === 'Enter' && onSelect()}
    >
      {/* Hero Image Section */}
      <div className='relative aspect-[4/3] overflow-hidden bg-slate-100'>
        {candidate.image_url ? (
          <Image
            src={candidate.image_url}
            alt={candidate.full_name}
            width={400}
            height={300}
            className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
            unoptimized
          />
        ) : (
          <div className='w-full h-full flex items-center justify-center bg-slate-100 text-slate-300'>
            <User className='w-20 h-20' />
          </div>
        )}

        {/* Gradient Overlay */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent' />

        {/* Top-Right Number Badge */}
        <div
          className='absolute top-0 right-0 px-4 py-2 rounded-bl-2xl font-black text-2xl text-white shadow-lg z-10'
          style={{ backgroundColor: partyColor }}
        >
          เบอร์ #{candidate.candidate_number}
        </div>

        {/* Bottom Content (Inside Image) */}
        <div className='absolute bottom-0 left-0 right-0 p-4 text-white z-10'>
          <h3 className='text-lg  leading-tight drop-shadow-md line-clamp-2'>
            {candidate.full_name}
          </h3>
        </div>

        {/* Selection Checkmark */}
        {isSelected && (
          <div
            className='absolute top-0 left-0 bg-primary/90 text-white px-4 py-2 text-xl  rounded-br-xl shadow-sm animate-in zoom-in spin-in-180 duration-300'
            // style={{ color: partyColor }}
          >
            <CheckCircle2
              className='w-6 h-6'
              strokeWidth={3}
            />
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className='p-4 flex-1 flex flex-col space-y-3'>
        {/* Party Info */}
        <div className='flex items-center space-x-4'>
          <div className='w-16 h-16 rounded-[18px] bg-white shadow-sm flex items-center justify-center overflow-hidden shrink-0 border'>
            {partyLogo ? (
              <Image
                src={partyLogo}
                alt={partyName}
                width={64}
                height={64}
                className='w-full h-full object-cover'
                unoptimized
              />
            ) : (
              <div
                className='w-full h-full rounded-[14px]'
                style={{ backgroundColor: partyColor, opacity: 0.2 }}
              />
            )}
          </div>
          <div className='min-w-0'>
            <p className='text-xs  uppercase tracking-widest mb-1'>
              สังกัดพรรค
            </p>
            <p
              className='text-xl font-black truncate transition-colors'
              style={{ color: partyColor }}
            >
              {partyName}
            </p>
          </div>
        </div>

        {/* Policy (if available) - Improved typography */}
        {candidate.party?.policy ? (
          <div className='pt-2 mt-auto'>
            <div className='bg-slate-50 p-3 rounded-lg border'>
              <p className='text-sm font-medium italic line-clamp-2 leading-relaxed'>
                &quot;{candidate.party.policy}&quot;
              </p>
            </div>
          </div>
        ) : (
          <div className='pt-2 mt-auto opacity-0'>
            {' '}
            {/* Spacer */}
            <div className='p-3'></div>
          </div>
        )}
      </div>
    </div>
  )
}
