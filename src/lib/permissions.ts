import type { Role, Permission } from '@/types'
import { rolePermissions } from '@/data/data'

export function can(role: Role, permission: Permission): boolean {
  const rp = rolePermissions.find((r) => r.role === role)
  return rp ? rp.permissions.includes(permission) : false
}

export function canAny(role: Role, permissions: Permission[]): boolean {
  return permissions.some((p) => can(role, p))
}

export function canAll(role: Role, permissions: Permission[]): boolean {
  return permissions.every((p) => can(role, p))
}
