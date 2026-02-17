import api from '@/lib/api'
import { ManageUsersResult, User, ApiUser } from '@/types/user'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

// Hook to fetch Users (Admin)
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await api.get('/admin/users?limit=1000')

      return (data.data || []).map((u: ApiUser) => ({
        ...u,
        citizenId: u.citizenId || u.nationalId || '',
      })) as User[]
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
      const queryParams = new URLSearchParams()
      queryParams.set('page', page.toString())
      queryParams.set('limit', limit.toString())

      if (role && role !== 'all') {
        queryParams.set('role', role)
      }

      const { data } = await api.get(`/admin/users?${queryParams.toString()}`)

      const rawData = data.data || []
      const meta = data.meta || { total: 0, page: 1, limit: 10, totalPages: 1 }

      const users = rawData.map((u: ApiUser) => ({
        id: u.id,
        citizenId: u.citizenId || u.nationalId,
        firstName: u.firstName,
        lastName: u.lastName,
        address: u.address,
        province: u.province,
        district: u.district,
        roles: u.roles,
        createdAt: u.createdAt,
      }))

      return { users, meta }
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
