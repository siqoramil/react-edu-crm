import { Navigate } from 'react-router-dom'
import { useStore } from '@/store'
import { can } from '@/lib/permissions'
import type { Permission } from '@/types'

interface Props {
  children: React.ReactNode
  permission?: Permission
}

export function ProtectedRoute({ children, permission }: Props) {
  const isAuthenticated = useStore((s) => s.isAuthenticated)
  const user = useStore((s) => s.user)

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  if (permission && !can(user.role, permission)) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">You do not have permission to view this page.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
