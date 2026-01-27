import { useStore } from '@/store'
import { DataTable, type ColumnDef, type FilterOption } from '@/components/shared/DataTable'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import type { AuditLog } from '@/types'

const actionColors: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  create: 'default', update: 'secondary', delete: 'destructive',
  restore: 'outline', login: 'default', logout: 'outline',
  export: 'secondary', bulk_delete: 'destructive',
}

export function SystemLogsPage() {
  const logs = useStore((s) => s.auditLogs)

  const columns: ColumnDef<AuditLog>[] = [
    {
      key: 'timestamp', label: 'Time', sortable: true,
      render: (r) => format(new Date(r.timestamp), 'MMM d, h:mm:ss a'),
    },
    { key: 'userName', label: 'User', sortable: true, render: (r) => <span className="font-medium">{r.userName}</span> },
    {
      key: 'action', label: 'Action', sortable: true,
      render: (r) => <Badge variant={actionColors[r.action] ?? 'secondary'}>{r.action}</Badge>,
    },
    { key: 'entity', label: 'Entity', sortable: true },
    { key: 'entityName', label: 'Name', sortable: true },
    { key: 'details', label: 'Details' },
  ]

  const filters: FilterOption[] = [
    {
      key: 'action', label: 'Action',
      options: ['create', 'update', 'delete', 'restore', 'login', 'logout', 'export', 'bulk_delete'].map((a) => ({ label: a, value: a })),
    },
    {
      key: 'entity', label: 'Entity',
      options: [...new Set(logs.map((l) => l.entity))].map((e) => ({ label: e, value: e })),
    },
  ]

  return (
    <div className="space-y-4">
      <div><h1 className="text-2xl font-bold tracking-tight">System Logs</h1><p className="text-muted-foreground">Audit trail of all system actions</p></div>
      <DataTable
        data={logs}
        columns={columns}
        searchKey="userName"
        searchPlaceholder="Search by user..."
        filters={filters}
        pageSize={20}
      />
    </div>
  )
}
