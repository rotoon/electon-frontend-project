import { Badge } from '@/components/ui/badge'

interface RoleBadgeProps {
  role: string
}

export function RoleBadge({ role }: RoleBadgeProps) {
  const getRoleConfig = (role: string) => {
    switch (role) {
      case 'ROLE_ADMIN':
        return { label: 'Admin', variant: 'destructive' as const }
      case 'ROLE_EC':
        return {
          label: 'EC Member',
          variant: 'default' as const,
          className: 'bg-blue-600 hover:bg-blue-700',
        }
      case 'ROLE_VOTER':
        return { label: 'Voter', variant: 'outline' as const }
      default:
        return { label: role, variant: 'outline' as const }
    }
  }

  const config = getRoleConfig(role)

  return (
    <Badge
      variant={config.variant}
      className={config.className}
    >
      {config.label}
    </Badge>
  )
}

export function RoleBadgeList({ roles }: { roles: string[] }) {
  if (!roles || roles.length === 0) return null

  return (
    <div className='flex flex-wrap gap-1'>
      {roles.map((role) => (
        <RoleBadge
          key={role}
          role={role}
        />
      ))}
    </div>
  )
}
