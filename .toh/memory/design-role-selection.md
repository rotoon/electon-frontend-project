# 📐 Design: Role Selection Portal

## Problem

Users with multiple roles (e.g., EC & Voter) are currently forced into a specific dashboard by hierarchy logic, making it difficult to access other role-specific features.

## Solution

### 1. Conditional Redirect Logic

Update `useLoginMutation` in `hooks/use-auth.ts`:

- **Single Role:** Automatically redirect to the specific dashboard.
  - `ADMIN` -> `/admin/dashboard`
  - `EC` -> `/ec/dashboard`
  - `VOTER` -> `/vote`
- **Multiple Roles:** Redirect to `/portal` (Role Selection Page).

### 2. Portal Page (`/app/portal/page.tsx`)

A dedicated landing page for multi-role users to choose their current context.

**UI Layout:**

- **Header:** "Verified User: [Name]"
- **Content:** Grid of Action Cards based on available roles.

**Card Types:**

- **Admin Console:** (Red/Destructive) -> Manage Users, Settings
- **EC Management:** (Blue/Primary) -> Manage Candidates, Monitor Election
- **Voter Zone:** (Green/Success) -> Cast Vote, View Patterns
- **Candidate Profile:** (Orange/Warning) -> Edit Profile, View Status

### 3. Persistent Access

- Add a **"Switch Role"** button in the top navigation bar for users with >1 roles.

## Implementation Details

### Routing

```typescript
const handleRedirect = (roles: Role[]) => {
  if (roles.length > 1) return router.push('/portal')

  const role = roles[0]
  if (role === 'ROLE_ADMIN') return router.push('/admin/dashboard')
  if (role === 'ROLE_EC') return router.push('/ec/dashboard')
  return router.push('/vote')
}
```
