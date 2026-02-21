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
      // Server-side pagination and filtering
      const { data } = await api.get('/users', {
        params: {
          page,
          limit,
          search: role && role.trim() ? role.trim() : undefined,
        },
      })

      // Backend returns { message, total, users: [], page, totalPages }
      const usersData = data.users || []

      const users = usersData.map((u: ApiUser) => {
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

      return {
        users,
        meta: {
          total: data.total || 0,
          page: data.page || page,
          limit: data.limit || limit,
          totalPages: data.totalPages || 0,
        },
      }
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
