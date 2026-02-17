'use client'

import { Button } from '@/components/ui/button'
import { CandidateCard } from '@/components/vote/candidate-card'
import { PollStatusBadge } from '@/components/vote/poll-status-badge'
import { VoteConfirmationDialog } from '@/components/vote/vote-confirmation-dialog'
import { useCandidates } from '@/hooks/use-candidates'
import { useConstituencyStatus } from '@/hooks/use-constituencies'
import { useMyVote, useVoteMutation } from '@/hooks/use-vote'
import { useAuthStore } from '@/store/useAuthStore'
import { Building2, CheckCircle2, MapPin, Vote } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function VotePage() {
  const { user, isAuthenticated } = useAuthStore()
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(
    null,
  )
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

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

    setIsConfirmOpen(true)
  }

  const confirmVote = () => {
    if (!selectedCandidate || !constituencyId || !user?.id) return

    voteMutation.mutate(
      {
        userId: user.id,
        candidateId: selectedCandidate,
        constituencyId: constituencyId,
        isUpdate: !!currentVote,
      },
      {
        onSuccess: () => {
          setIsConfirmOpen(false)
        },
      },
    )
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
      <div className='flex h-[50vh] items-center justify-center'>
        <div className='animate-spin motion-reduce:animate-none rounded-full h-12 w-12 border-b-2 border-primary' />
      </div>
    )
  }

  // Render: Not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className='text-center py-20'>
        <h1 className='text-2xl  mb-4'>กรุณาเข้าสู่ระบบเพื่อใช้สิทธิ</h1>
        <Button asChild>
          <Link href='/auth'>เข้าสู่ระบบ</Link>
        </Button>
      </div>
    )
  }

  // Find voted candidate info
  const votedCandidate = candidates?.find(
    (c) => c.id === currentVote?.candidate_id,
  )

  return (
    <div className='space-y-6 md:space-y-8 pb-20 md:pb-0'>
      {/* Header */}
      {/* Header - Enriched District Info */}
      {isAuthenticated && (
        <div className='bg-white p-4 md:p-6 rounded-[20px] md:rounded-[24px] shadow-sm border border-slate-100 mb-6 md:mb-8'>
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
      )}

      {/* Vote confirmation info */}
      {currentVote && votedCandidate && (
        <div className='bg-primary/10 border border-primary/20 p-4 rounded-lg flex items-start md:items-center text-primary animate-in fade-in slide-in-from-top-4 duration-500'>
          <CheckCircle2
            className='w-5 h-5 mr-3 flex-shrink-0 mt-0.5 md:mt-0'
            aria-hidden='true'
          />
          <span className='text-sm md:text-base'>
            คุณได้ลงคะแนนให้{' '}
            <strong className='font-bold underline decoration-primary/30 underline-offset-4'>
              หมายเลข {votedCandidate.candidate_number}
            </strong>{' '}
            แล้ว
            {pollOpen && ' (สามารถเปลี่ยนได้)'}
          </span>
        </div>
      )}

      {/* Candidates Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'>
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
      <div className='fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-200 p-4 pb-6 flex justify-center shadow-[0_-4px_20px_rgba(0,0,0,0.05)] md:hidden z-30 safe-area-bottom'>
        <Button
          size='lg'
          className='w-full max-w-sm text-lg shadow-xl h-14 rounded-2xl font-bold'
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
          className='text-lg px-12 py-6 shadow-xl h-16 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95'
          onClick={handleVote}
          disabled={!canSubmit}
        >
          {getButtonText()}
        </Button>
      </div>

      {/* Confirmation Dialog */}
      <VoteConfirmationDialog
        isOpen={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        selectedCandidate={selectedCandidate}
        candidates={candidates}
        isPending={voteMutation.isPending}
        onConfirm={confirmVote}
      />
    </div>
  )
}
