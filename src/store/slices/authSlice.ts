import type { StateCreator } from 'zustand'
import type { AuthUser, Role } from '@/types'
import type { StoreState } from '../index'

export interface AuthSlice {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (email: string, _password: string) => boolean
  logout: () => void
  setRole: (role: Role) => void
}

const fakeUsers: AuthUser[] = [
  { id: 'u1', name: 'Alice Johnson', email: 'admin@acme.com', role: 'admin', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Alice' },
  { id: 'u2', name: 'Bob Martinez', email: 'manager@acme.com', role: 'manager', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Bob' },
  { id: 'u3', name: 'Carol White', email: 'viewer@acme.com', role: 'viewer', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Carol' },
]

export const createAuthSlice: StateCreator<StoreState, [], [], AuthSlice> = (set, get) => ({
  user: null,
  isAuthenticated: false,

  login: (email: string) => {
    const found = fakeUsers.find((u) => u.email === email)
    if (found) {
      set({ user: found, isAuthenticated: true })
      get().addLog({
        action: 'login',
        entity: 'Auth',
        entityId: found.id,
        entityName: found.name,
        details: `Logged in as ${found.role}`,
      })
      return true
    }
    return false
  },

  logout: () => {
    const user = get().user
    if (user) {
      get().addLog({
        action: 'logout',
        entity: 'Auth',
        entityId: user.id,
        entityName: user.name,
        details: 'Logged out',
      })
    }
    set({ user: null, isAuthenticated: false })
  },

  setRole: (role: Role) => {
    const user = get().user
    if (user) {
      set({ user: { ...user, role } })
    }
  },
})
