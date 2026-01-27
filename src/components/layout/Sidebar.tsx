import { Link, useLocation } from 'react-router-dom'
import { useStore } from '@/store'
import { can } from '@/lib/permissions'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  LayoutDashboard, Users, Package, ShoppingCart, LifeBuoy,
  FolderTree, FileText, Image, Settings, BarChart3,
  Shield, ScrollText, Flag, Wrench, MonitorSmartphone,
  ChevronsLeft, ChevronsRight, ChevronDown,
  Zap,
} from 'lucide-react'
import { useState } from 'react'
import type { Permission } from '@/types'

interface NavItem {
  label: string
  icon: React.ReactNode
  href?: string
  permission?: Permission
  children?: { label: string; href: string; permission?: Permission }[]
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: <LayoutDashboard size={20} />, href: '/' },
  { label: 'Users', icon: <Users size={20} />, href: '/users', permission: 'users.view' },
  { label: 'Products', icon: <Package size={20} />, href: '/products', permission: 'products.view' },
  { label: 'Orders', icon: <ShoppingCart size={20} />, href: '/orders', permission: 'orders.view' },
  { label: 'Tickets', icon: <LifeBuoy size={20} />, href: '/tickets', permission: 'tickets.view' },
  { label: 'Categories', icon: <FolderTree size={20} />, href: '/categories', permission: 'categories.view' },
  { label: 'Blog Posts', icon: <FileText size={20} />, href: '/posts', permission: 'posts.view' },
  { label: 'Media', icon: <Image size={20} />, href: '/media', permission: 'media.view' },
  {
    label: 'Reports', icon: <BarChart3 size={20} />, permission: 'reports.view',
    children: [
      { label: 'Revenue', href: '/reports/revenue' },
      { label: 'User Growth', href: '/reports/user-growth' },
      { label: 'Products', href: '/reports/products' },
      { label: 'Ticket SLA', href: '/reports/ticket-sla' },
    ],
  },
  {
    label: 'Admin', icon: <Shield size={20} />, permission: 'admin.roles',
    children: [
      { label: 'Roles & Permissions', href: '/admin/roles', permission: 'admin.roles' },
      { label: 'System Logs', href: '/admin/logs', permission: 'admin.logs' },
      { label: 'Feature Flags', href: '/admin/features', permission: 'admin.features' },
      { label: 'Sessions', href: '/admin/sessions', permission: 'admin.sessions' },
    ],
  },
  { label: 'Settings', icon: <Settings size={20} />, href: '/settings', permission: 'settings.view' },
]

export function Sidebar() {
  const { pathname } = useLocation()
  const user = useStore((s) => s.user)
  const collapsed = useStore((s) => s.sidebarCollapsed)
  const setSidebarCollapsed = useStore((s) => s.setSidebarCollapsed)

  if (!user) return null

  return (
    <aside
      className={cn(
        'flex h-screen flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-300',
        collapsed ? 'w-16' : 'w-64',
      )}
    >
      <div className="flex h-14 items-center justify-between border-b px-3">
        {!collapsed && (
          <Link to="/" className="flex items-center gap-2 font-bold text-lg">
            <Zap size={22} className="text-primary" />
            Admin
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto h-8 w-8"
          onClick={() => setSidebarCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
        </Button>
      </div>

      <ScrollArea className="flex-1 py-2">
        <nav className="flex flex-col gap-0.5 px-2">
          {navItems.map((item) => {
            if (item.permission && !can(user.role, item.permission)) return null

            if (item.children) {
              return (
                <CollapsibleNav
                  key={item.label}
                  item={item}
                  pathname={pathname}
                  collapsed={collapsed}
                  userRole={user.role}
                />
              )
            }

            const isActive = item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href!)

            return (
              <Link key={item.label} to={item.href!}>
                <span
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground',
                    collapsed && 'justify-center px-0',
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  {item.icon}
                  {!collapsed && item.label}
                </span>
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      <Separator />
      <div className={cn('p-3', collapsed && 'p-2')}>
        {!collapsed ? (
          <div className="text-xs text-muted-foreground">
            <p className="font-medium text-foreground">{user.name}</p>
            <p className="capitalize">{user.role}</p>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">
              {user.name.charAt(0)}
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}

function CollapsibleNav({
  item, pathname, collapsed, userRole,
}: {
  item: NavItem
  pathname: string
  collapsed: boolean
  userRole: string
}) {
  const isChildActive = item.children?.some((c) => pathname.startsWith(c.href))
  const [open, setOpen] = useState(isChildActive)

  if (collapsed) {
    const first = item.children?.find(
      (c) => !c.permission || can(userRole as 'admin' | 'manager' | 'viewer', c.permission),
    )
    if (!first) return null
    return (
      <Link to={first.href}>
        <span
          className={cn(
            'flex items-center justify-center rounded-md p-2 text-sm transition-colors',
            isChildActive
              ? 'bg-sidebar-accent text-sidebar-accent-foreground'
              : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50',
          )}
          title={item.label}
        >
          {item.icon}
        </span>
      </Link>
    )
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <button
          className={cn(
            'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
            isChildActive
              ? 'bg-sidebar-accent text-sidebar-accent-foreground'
              : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground',
          )}
        >
          {item.icon}
          <span className="flex-1 text-left">{item.label}</span>
          <ChevronDown
            size={14}
            className={cn('transition-transform', open && 'rotate-180')}
          />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="ml-7 flex flex-col gap-0.5 border-l pl-3 py-1">
          {item.children?.map((child) => {
            if (child.permission && !can(userRole as 'admin' | 'manager' | 'viewer', child.permission)) return null
            const active = pathname.startsWith(child.href)
            return (
              <Link key={child.href} to={child.href}>
                <span
                  className={cn(
                    'block rounded-md px-2 py-1.5 text-sm transition-colors',
                    active
                      ? 'font-medium text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground/60 hover:text-sidebar-accent-foreground',
                  )}
                >
                  {child.label}
                </span>
              </Link>
            )
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
