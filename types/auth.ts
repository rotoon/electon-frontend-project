import { Constituency, District, Province } from './location'

export type Role = 'ROLE_ADMIN' | 'ROLE_EC' | 'ROLE_VOTER'

export interface RegisterUserInput {
  citizenId: string
  password: string
  firstName: string
  lastName: string
  address: string
  provinceId: number
  districtId: number
}

export interface LoginUserInput {
  citizenId: string
  password: string
}

export interface AuthResponse {
  accessToken: string
}

// User role relation based on docs
export interface UserRoleRelation {
  role: {
    id: number
    name: string
  }
}

export interface RegisterResponse {
  id: number
  citizenId: string
  firstName: string
  lastName: string
  address: string
  province: Province
  district: District
  roles: UserRoleRelation[]
  createdAt: string
}

// Me response roles are string[] in docs
export interface MeResponse {
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
