import { useStore } from '@/store'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Bell, Sun, Moon, LogOut, Search, User, X, CheckCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function Topbar() {
  const user = useStore((s) => s.user)
  const theme = useStore((s) => s.theme)
  const toggleTheme = useStore((s) => s.toggleTheme)
  const logout = useStore((s) => s.logout)
  const globalSearch = useStore((s) => s.globalSearch)
  const setGlobalSearch = useStore((s) => s.setGlobalSearch)
  const notifications = useStore((s) => s.notifications)
  const markAsRead = useStore((s) => s.markAsRead)
  const markAllAsRead = useStore((s) => s.markAllAsRead)
  const navigate = useNavigate()

  const unread = notifications.filter((n) => !n.read).length

  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-4 gap-4">
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search across all modules..."
          value={globalSearch}
          onChange={(e) => setGlobalSearch(e.target.value)}
          className="pl-9 h-9"
        />
        {globalSearch && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
            onClick={() => setGlobalSearch('')}
          >
            <X size={14} />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <Button variant="ghost" size="icon" className="h-9 w-9" onClick={toggleTheme}>
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 relative">
              <Bell size={18} />
              {unread > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-[10px] font-bold text-white flex items-center justify-center">
                  {unread}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              Notifications
              {unread > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-xs text-primary"
                  onClick={(e) => {
                    e.preventDefault()
                    markAllAsRead()
                  }}
                >
                  <CheckCheck size={14} className="mr-1" />
                  Mark all read
                </Button>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <ScrollArea className="max-h-72">
              {notifications.length === 0 ? (
                <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                  No notifications
                </div>
              ) : (
                notifications.slice(0, 10).map((n) => (
                  <DropdownMenuItem
                    key={n.id}
                    className={cn('flex flex-col items-start gap-1 py-2', !n.read && 'bg-muted/50')}
                    onClick={() => markAsRead(n.id)}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Badge
                        variant={
                          n.type === 'error' ? 'destructive' :
                          n.type === 'warning' ? 'outline' :
                          'secondary'
                        }
                        className="text-[10px] px-1.5 py-0"
                      >
                        {n.type}
                      </Badge>
                      <span className="text-sm font-medium truncate flex-1">{n.title}</span>
                      {!n.read && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                    </div>
                    <span className="text-xs text-muted-foreground line-clamp-1">{n.message}</span>
                  </DropdownMenuItem>
                ))
              )}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2 h-9">
              <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                <User size={14} />
              </div>
              <span className="hidden sm:inline text-sm">{user?.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>
              <p>{user?.name}</p>
              <p className="text-xs font-normal text-muted-foreground capitalize">{user?.role}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => { logout(); navigate('/login') }}>
              <LogOut size={14} className="mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
