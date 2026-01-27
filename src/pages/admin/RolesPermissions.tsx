import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Check, X } from 'lucide-react'
import { rolePermissions } from '@/data/data'
import type { Permission, Role } from '@/types'

const permissionGroups: { label: string; permissions: Permission[] }[] = [
  { label: 'Users', permissions: ['users.view', 'users.create', 'users.edit', 'users.delete'] },
  { label: 'Products', permissions: ['products.view', 'products.create', 'products.edit', 'products.delete'] },
  { label: 'Orders', permissions: ['orders.view', 'orders.create', 'orders.edit', 'orders.delete'] },
  { label: 'Tickets', permissions: ['tickets.view', 'tickets.create', 'tickets.edit', 'tickets.delete'] },
  { label: 'Categories', permissions: ['categories.view', 'categories.create', 'categories.edit', 'categories.delete'] },
  { label: 'Posts', permissions: ['posts.view', 'posts.create', 'posts.edit', 'posts.delete'] },
  { label: 'Media', permissions: ['media.view', 'media.upload', 'media.delete'] },
  { label: 'Settings', permissions: ['settings.view', 'settings.edit'] },
  { label: 'Reports', permissions: ['reports.view'] },
  { label: 'Admin', permissions: ['admin.roles', 'admin.logs', 'admin.features', 'admin.maintenance', 'admin.sessions'] },
]

const roles: Role[] = ['admin', 'manager', 'viewer']

function hasPermission(role: Role, permission: Permission): boolean {
  const rp = rolePermissions.find((r) => r.role === role)
  return rp ? rp.permissions.includes(permission) : false
}

export function RolesPermissionsPage() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold tracking-tight">Roles & Permissions</h1><p className="text-muted-foreground">View the permission matrix for all roles</p></div>

      <div className="grid gap-4 md:grid-cols-3">
        {roles.map((role) => {
          const rp = rolePermissions.find((r) => r.role === role)
          return (
            <Card key={role}>
              <CardHeader>
                <CardTitle className="capitalize">{role}</CardTitle>
                <CardDescription>{rp?.permissions.length ?? 0} permissions granted</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant={role === 'admin' ? 'default' : role === 'manager' ? 'secondary' : 'outline'} className="capitalize">
                  {role === 'admin' ? 'Full Access' : role === 'manager' ? 'Limited Write' : 'Read Only'}
                </Badge>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader><CardTitle>Permission Matrix</CardTitle><CardDescription>Detailed breakdown of permissions by role</CardDescription></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Permission</TableHead>
                {roles.map((r) => <TableHead key={r} className="text-center capitalize">{r}</TableHead>)}
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissionGroups.map((group) => (
                <>
                  <TableRow key={group.label}>
                    <TableCell colSpan={4} className="font-bold bg-muted/50">{group.label}</TableCell>
                  </TableRow>
                  {group.permissions.map((perm) => (
                    <TableRow key={perm}>
                      <TableCell className="pl-6"><code className="text-xs">{perm}</code></TableCell>
                      {roles.map((role) => (
                        <TableCell key={role} className="text-center">
                          {hasPermission(role, perm) ? (
                            <Check size={16} className="inline text-emerald-500" />
                          ) : (
                            <X size={16} className="inline text-muted-foreground/30" />
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
