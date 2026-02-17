import { useAuthStore } from '@/store/useAuthStore'
import { Role } from '@/types/auth'

export function usePermission() {
  const user = useAuthStore((state) => state.user)
  const roles = (user?.roles as Role[]) || []

  const hasRole = (role: Role) => {
    return roles.includes(role)
  }

  const hasAnyRole = (requiredRoles: Role[]) => {
    return requiredRoles.some((role) => roles.includes(role))
  }

  const hasAllRoles = (requiredRoles: Role[]) => {
    return requiredRoles.every((role) => roles.includes(role))
  }

  const isAdmin = hasRole('ROLE_ADMIN')
  const isEC = hasRole('ROLE_EC')
  const isVoter = hasRole('ROLE_VOTER')

  return {
    roles,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    isAdmin,
    isEC,
    isVoter,
  }
}
