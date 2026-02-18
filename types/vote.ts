export interface Vote {
  id: string
  candidate_id: number
  user_id: string
}

export interface ResultCandidate {
  id: number
  first_name: string
  last_name: string
  candidate_number: number
  image_url: string
  personal_policy: string
  party: {
    id: number
    name: string
    logo_url: string | null
    color: string
  } | null
}

export interface ResultItem {
  candidate: ResultCandidate
  voteCount: number
  rank: number
}

export interface ConstituencyResultData {
  pollOpen: boolean
  results: ResultItem[]
  totalVotes: number
}

export interface ApiCandidateResult {
  candidateId: number
  voteCount: number
  candidateName: string | null
  candidateNumber: number
  partyId: number
  partyName: string
  partyColor: string
  imageUrl: string
}
