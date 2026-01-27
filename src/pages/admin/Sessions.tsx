import { useStore } from '@/store'
import { DataTable, type ColumnDef, type FilterOption } from '@/components/shared/DataTable'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { toast } from 'sonner'
import type { SessionEntry } from '@/types'

export function SessionsPage() {
  const sessions = useStore((s) => s.sessions)
  const terminateSession = useStore((s) => s.terminateSession)

  const columns: ColumnDef<SessionEntry>[] = [
    { key: 'userName', label: 'User', sortable: true, render: (r) => <span className="font-medium">{r.userName}</span> },
    { key: 'ip', label: 'IP Address', render: (r) => <code className="text-xs">{r.ip}</code> },
    { key: 'device', label: 'Device', sortable: true },
    { key: 'browser', label: 'Browser', sortable: true },
    { key: 'location', label: 'Location', sortable: true },
    {
      key: 'status', label: 'Status', sortable: true,
      render: (r) => <Badge variant={r.status === 'active' ? 'default' : 'secondary'}>{r.status}</Badge>,
    },
    {
      key: 'lastActivity', label: 'Last Activity', sortable: true,
      render: (r) => format(new Date(r.lastActivity), 'MMM d, h:mm a'),
    },
  ]

  const filters: FilterOption[] = [
    { key: 'status', label: 'Status', options: [{ label: 'Active', value: 'active' }, { label: 'Expired', value: 'expired' }] },
  ]

  return (
    <div className="space-y-4">
      <div><h1 className="text-2xl font-bold tracking-tight">Active Sessions</h1><p className="text-muted-foreground">Monitor and manage user sessions</p></div>
      <DataTable
        data={sessions}
        columns={columns}
        searchKey="userName"
        searchPlaceholder="Search sessions..."
        filters={filters}
        actions={(row) =>
          row.status === 'active' ? (
            <Button
              variant="outline"
              size="sm"
              className="text-destructive"
              onClick={() => { terminateSession(row.id); toast.success(`Session for ${row.userName} terminated`) }}
            >
              Terminate
            </Button>
          ) : (
            <span className="text-xs text-muted-foreground">Expired</span>
          )
        }
      />
    </div>
  )
}
