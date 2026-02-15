import React from 'react'

interface PollStatusBadgeProps {
  isOpen?: boolean
}

export function PollStatusBadge({ isOpen }: PollStatusBadgeProps) {
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
