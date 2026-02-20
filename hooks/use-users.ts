import api from '@/lib/api'
import { ManageUsersResult, User, ApiUser } from '@/types/user'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

// Hook to fetch Users (Admin)
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await api.get('/users?limit=1000')
      const allData = data.users || []

      return allData.map((u: ApiUser) => {
        let roles: string[] = []
        if (Array.isArray(u.roles)) {
          roles = u.roles
            .map((r: unknown) => {
              if (typeof r === 'string') return r
              return (r as { role?: { name?: string } })?.role?.name || ''
            })
            .filter(Boolean)
        }

        return {
          ...u,
          citizenId: u.citizenId || u.nationalId || '',
          roles: roles.length > 0 ? roles : ['ROLE_VOTER'],
        } as User
      })
    },
  })
}

// Hook for Admin Users Page with server-side pagination
export function useManageUsers(params: {
  role?: string | null
  page?: number
  limit?: number
}) {
  const { role, page = 1, limit = 10 } = params

  return useQuery<ManageUsersResult>({
    queryKey: ['manage-users', role, page, limit],
    queryFn: async () => {
      // Fetch all users for client-side pagination
      const { data } = await api.get('/users?limit=1000')

      // Backend returns { message, total, users: [], page, totalPages }
      const allData = data.users || []
      
      // Filter by search text if provided
      let filteredData = allData
      if (role && role.trim()) {
        const search = role.toLowerCase().trim()
        filteredData = allData.filter((u: ApiUser) => {
          const fullName = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase()
          const citizenId = u.citizenId || u.nationalId || ''
          return fullName.includes(search) || citizenId.includes(search)
        })
      }

      // Client-side pagination
      const total = filteredData.length
      const totalPages = Math.ceil(total / limit)
      const start = (page - 1) * limit
      const paginatedData = filteredData.slice(start, start + limit)

      const users = paginatedData.map((u: ApiUser) => {
        // Handle roles from API - may be array of { role: { name } } or array of strings
        let roles: string[] = []
        if (Array.isArray(u.roles)) {
          roles = u.roles
            .map((r: unknown) => {
              if (typeof r === 'string') return r
              return (r as { role?: { name?: string } })?.role?.name || ''
            })
            .filter(Boolean)
        }

        return {
          id: u.id,
          citizenId: u.citizenId || u.nationalId || '',
          firstName: u.firstName,
          lastName: u.lastName,
          address: u.address,
          province: u.province,
          district: u.district,
          roles: roles.length > 0 ? roles : ['ROLE_VOTER'],
          createdAt: u.createdAt,
        }
      })

      return { users, meta: { total, page, limit, totalPages } }
    },
  })
}

export function useUpdateUserRoleMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ userId, role }: { userId: number; role: string }) => {
      await api.patch(`/admin/users/${userId}/role`, { role })
    },
    onSuccess: () => {
      toast.success('อัปเดตสิทธิ์สำเร็จ')
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['manage-users'] })
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] })
    },
    onError: () => toast.error('อัปเดตไม่สำเร็จ'),
  })
}
