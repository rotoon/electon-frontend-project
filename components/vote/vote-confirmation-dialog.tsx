import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Candidate } from '@/types/candidate'
import { User } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

interface VoteConfirmationDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  selectedCandidate: number | null
  candidates?: Candidate[]
  isPending: boolean
  onConfirm: () => void
}

export function VoteConfirmationDialog({
  isOpen,
  onOpenChange,
  selectedCandidate,
  candidates,
  isPending,
  onConfirm,
}: VoteConfirmationDialogProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={onOpenChange}
    >
      <DialogContent className='max-w-md w-full rounded-2xl border-0 shadow-2xl bg-white/95 backdrop-blur-xl sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle className='text-center text-2xl font-bold'>
            ยืนยันการลงคะแนน
          </DialogTitle>
          <DialogDescription className='text-center text-slate-500'>
            กรุณาตรวจสอบข้อมูลก่อนยืนยันสิทธิของท่าน
          </DialogDescription>
        </DialogHeader>

        {selectedCandidate &&
          (() => {
            const candidate = candidates?.find(
              (c) => c.id === selectedCandidate,
            )
            const partyColor = candidate?.party?.color || 'var(--primary)'

            if (!candidate) return null

            return (
              <div
                className='bg-slate-50 p-4 sm:p-6 rounded-xl flex flex-col sm:flex-row items-center gap-4 sm:gap-6 border border-slate-100 relative overflow-hidden mt-4'
                style={
                  {
                    '--party-color': partyColor,
                  } as React.CSSProperties
                }
              >
                <div className='absolute left-0 top-0 sm:h-full w-full h-1.5 sm:w-1.5 bg-[var(--party-color)] sm:top-0' />

                <div className='w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-xl overflow-hidden shadow-lg border-2 border-white bg-slate-200 mt-2 sm:mt-0'>
                  {candidate.image_url ? (
                    <Image
                      src={candidate.image_url}
                      alt={candidate.full_name}
                      width={128}
                      height={128}
                      className='w-full h-full object-cover'
                      unoptimized={candidate.image_url.startsWith('http')}
                    />
                  ) : (
                    <div className='w-full h-full flex items-center justify-center text-slate-400'>
                      <User className='w-10 h-10 sm:w-12 sm:h-12' />
                    </div>
                  )}
                </div>

                <div className='flex flex-col items-center sm:items-start text-center sm:text-left min-w-0 flex-1'>
                  <div
                    className='text-4xl sm:text-5xl font-black text-[var(--party-color)] mb-1 drop-shadow-sm leading-none'
                    style={{ fontFamily: 'var(--font-kanit)' }}
                  >
                    เบอร์ #{candidate.candidate_number}
                  </div>

                  <h3 className='text-lg sm:text-2xl font-bold text-slate-800 leading-tight line-clamp-2'>
                    {candidate.full_name}
                  </h3>
                  <div className='inline-flex items-center mt-2 px-3 py-1 rounded-lg bg-white text-sm sm:text-md font-medium text-slate-600 gap-2 shadow-sm max-w-full'>
                    {candidate.party?.logo_url && (
                      <div className='w-6 h-6 sm:w-8 sm:h-8 relative rounded-lg overflow-hidden shrink-0'>
                        <Image
                          src={candidate.party.logo_url}
                          alt={candidate.party.name}
                          fill
                          className='object-cover'
                          unoptimized={candidate.party.logo_url.startsWith(
                            'http',
                          )}
                        />
                      </div>
                    )}
                    <span className='truncate'>
                      {candidate.party?.name || 'อิสระ'}
                    </span>
                  </div>
                </div>
              </div>
            )
          })()}

        <DialogFooter className='grid grid-cols-2 gap-3 sm:space-x-0 mt-2'>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            className='w-full h-12 text-base rounded-xl hover:bg-slate-50 hover:text-slate-900 border-slate-200'
          >
            ยกเลิก
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isPending}
            className='w-full h-12 text-base rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 transition-all font-bold text-white'
            style={
              selectedCandidate
                ? ({
                    backgroundColor: candidates?.find(
                      (c) => c.id === selectedCandidate,
                    )?.party?.color,
                  } as React.CSSProperties)
                : {}
            }
          >
            {isPending ? (
              <>
                <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2' />
                กำลังบันทึก...
              </>
            ) : (
              'ยืนยันลงคะแนน'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
