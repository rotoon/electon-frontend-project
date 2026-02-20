/**
 * API Response Types (camelCase format from backend)
 * These match the raw API response structure before transformation
 */

export interface ApiConstituency {
  id: number
  number: number
  provinceId: number
  isClosed: boolean
  province?: {
    id: number
    name: string
  }
}

export interface ApiCandidate {
  id: number
  fullName: string
  number: number
  imageUrl: string
  party?: ApiPartyInCandidate
}

export interface ApiPartyInCandidate {
  id: number
  name: string
  logoUrl: string
  color: string
  policy?: string
}

export interface ApiParty {
  id: number
  name: string
  logoUrl: string | null
  policy: string | null
  color: string | null
}

export interface ApiError {
  response?: {
    data?: {
      message?: string
    }
  }
  message?: string
}
