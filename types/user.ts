import { Constituency, District, Province } from './location'

export interface User {
  id: number
  citizenId: string
  firstName: string
  lastName: string
  address: string
  province: Province
  district: District
  constituency: Constituency
  roles: string[]
  createdAt: string
}

export interface ManageUsersResult {
  users: User[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface ApiUser {
  id: number
  citizenId?: string
  nationalId?: string
  firstName: string
  lastName: string
  address: string
  province: { id: number; name: string }
  district: { id: number; name: string }
  roles: string[]
  createdAt: string
}
