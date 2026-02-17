import { PaginationMeta } from './common'

export interface Candidate {
  id: number
  full_name: string
  candidate_number: number
  national_id?: string
  image_url: string
  party?: {
    id: number
    name: string
    logo_url: string
    color: string
    policy?: string
  } | null
}

export interface ManageCandidatesResult {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  candidates: any[]
  meta: PaginationMeta
}

export interface ApiManageCandidate {
  id: number
  firstName: string
  lastName: string
  candidateNumber: number
  imageUrl: string
  personalPolicy: string
  nationalId: string
  constituencyId: number
  party?: { id: number; name: string; logoUrl: string }
  constituency?: {
    id: number
    province: string
    zoneNumber: number
    isPollOpen: boolean
  }
}

export interface CreateCandidatePayload {
  first_name: string
  last_name: string
  candidate_number: number
  party_id: number
  constituency_id: number
  image_url: string
  personal_policy: string
  national_id: string
}
