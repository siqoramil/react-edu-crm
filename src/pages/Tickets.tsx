import { useState, useMemo } from 'react'
import { useStore } from '@/store'
import { can } from '@/lib/permissions'
import { DataTable, type ColumnDef, type FilterOption } from '@/components/shared/DataTable'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { useConfirm } from '@/hooks/useConfirm'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetBody, SheetFooter, SheetTitle } from '@/components/ui/sheet'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Plus, MoreHorizontal, Pencil, Trash2, ArchiveRestore } from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'
import type { Ticket } from '@/types'

export function TicketsPage() {
  const user = useStore((s) => s.user)
  const tickets = useStore((s) => s.tickets)
  const addTicket = useStore((s) => s.addTicket)
  const updateTicket = useStore((s) => s.updateTicket)
  const deleteTicket = useStore((s) => s.deleteTicket)
  const restoreTicket = useStore((s) => s.restoreTicket)
  const bulkDeleteTickets = useStore((s) => s.bulkDeleteTickets)

  const [tab, setTab] = useState<'active' | 'trash'>('active')
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Ticket | null>(null)
  const [form, setForm] = useState({ subject: '', description: '', customer: '', customerEmail: '', priority: 'medium' as Ticket['priority'], status: 'open' as Ticket['status'], assignee: '', category: '' })
  const confirm = useConfirm()

  const canEdit = user ? can(user.role, 'tickets.edit') : false
  const canCreate = user ? can(user.role, 'tickets.create') : false
  const canDelete = user ? can(user.role, 'tickets.delete') : false

  const activeData = useMemo(() => tickets.filter((t) => !t.deleted), [tickets])
  const trashData = useMemo(() => tickets.filter((t) => t.deleted), [tickets])

  const openCreate = () => {
    setEditingItem(null)
    setForm({ subject: '', description: '', customer: '', customerEmail: '', priority: 'medium', status: 'open', assignee: '', category: '' })
    setSheetOpen(true)
  }
  const openEdit = (t: Ticket) => {
    setEditingItem(t)
    setForm({ subject: t.subject, description: t.description, customer: t.customer, customerEmail: t.customerEmail, priority: t.priority, status: t.status, assignee: t.assignee, category: t.category })
    setSheetOpen(true)
  }
  const handleSave = () => {
    if (!form.subject) { toast.error('Subject required'); return }
    const now = new Date().toISOString()
    if (editingItem) { updateTicket(editingItem.id, { ...form, updatedAt: now }); toast.success('Ticket updated') }
    else { addTicket({ ...form, createdAt: now, updatedAt: now } as Omit<Ticket, 'id' | 'deleted'>); toast.success('Ticket created') }
    setSheetOpen(false)
  }
  const handleDelete = (id: string) => {
    confirm.confirm({ title: 'Delete Ticket', description: 'Move this ticket to trash?', onConfirm: () => { deleteTicket(id); toast.success('Ticket moved to trash') } })
  }

  const priorityColor = (p: Ticket['priority']) => {
    switch (p) { case 'critical': return 'destructive'; case 'high': return 'destructive'; case 'medium': return 'outline'; default: return 'secondary' }
  }

  const columns: ColumnDef<Ticket>[] = [
    { key: 'subject', label: 'Subject', sortable: true, render: (r) => (<div><p className="font-medium text-sm">{r.subject}</p><p className="text-xs text-muted-foreground">{r.customer}</p></div>) },
    { key: 'priority', label: 'Priority', sortable: true, render: (r) => <Badge variant={priorityColor(r.priority)}>{r.priority}</Badge> },
    { key: 'status', label: 'Status', sortable: true, render: (r) => <Badge variant={r.status === 'resolved' || r.status === 'closed' ? 'default' : 'secondary'}>{r.status.replace('_', ' ')}</Badge> },
    { key: 'assignee', label: 'Assignee', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'createdAt', label: 'Created', sortable: true, render: (r) => format(new Date(r.createdAt), 'MMM d, yyyy') },
  ]

  const filters: FilterOption[] = [
    { key: 'priority', label: 'Priority', options: ['low','medium','high','critical'].map((s) => ({ label: s, value: s })) },
    { key: 'status', label: 'Status', options: ['open','in_progress','resolved','closed'].map((s) => ({ label: s.replace('_', ' '), value: s })) },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold tracking-tight">Tickets</h1><p className="text-muted-foreground">Manage support tickets</p></div>
        {canCreate && <Button onClick={openCreate}><Plus size={16} className="mr-1.5" />New Ticket</Button>}
      </div>
      <Tabs value={tab} onValueChange={(v) => setTab(v as 'active' | 'trash')}>
        <TabsList><TabsTrigger value="active">Active ({activeData.length})</TabsTrigger><TabsTrigger value="trash">Trash ({trashData.length})</TabsTrigger></TabsList>
      </Tabs>
      <DataTable
        data={tab === 'active' ? activeData : trashData} columns={columns} searchKey="subject"
        searchPlaceholder="Search tickets..." filters={filters} isTrashView={tab === 'trash'}
        onDelete={canDelete ? handleDelete : undefined}
        onRestore={canDelete ? (id) => { restoreTicket(id); toast.success('Restored') } : undefined}
        onBulkDelete={canDelete ? (ids) => confirm.confirm({ title: 'Bulk Delete', description: `Delete ${ids.length} tickets?`, onConfirm: () => { bulkDeleteTickets(ids); toast.success('Deleted') } }) : undefined}
        actions={(row) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal size={16} /></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {tab === 'active' ? (<>
                {canEdit && <DropdownMenuItem onClick={() => openEdit(row)}><Pencil size={14} className="mr-2" />Edit</DropdownMenuItem>}
                {canDelete && <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(row.id)}><Trash2 size={14} className="mr-2" />Delete</DropdownMenuItem>}
              </>) : (canDelete && <DropdownMenuItem onClick={() => { restoreTicket(row.id); toast.success('Restored') }}><ArchiveRestore size={14} className="mr-2" />Restore</DropdownMenuItem>)}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{editingItem ? 'Edit Ticket' : 'New Ticket'}</SheetTitle>
            <SheetDescription>Manage ticket details</SheetDescription>
          </SheetHeader>
          <SheetBody className="grid gap-4">
            <div className="space-y-2"><Label>Subject</Label><Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} /></div>
            <div className="space-y-2"><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div className="space-y-2"><Label>Customer</Label><Input value={form.customer} onChange={(e) => setForm({ ...form, customer: e.target.value })} /></div>
            <div className="space-y-2"><Label>Customer Email</Label><Input value={form.customerEmail} onChange={(e) => setForm({ ...form, customerEmail: e.target.value })} /></div>
            <div className="space-y-2"><Label>Assignee</Label><Input value={form.assignee} onChange={(e) => setForm({ ...form, assignee: e.target.value })} /></div>
            <div className="space-y-2"><Label>Category</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
            <div className="space-y-2"><Label>Priority</Label><Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v as Ticket['priority'] })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{['low','medium','high','critical'].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2"><Label>Status</Label><Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Ticket['status'] })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{['open','in_progress','resolved','closed'].map((s) => <SelectItem key={s} value={s}>{s.replace('_', ' ')}</SelectItem>)}</SelectContent></Select></div>
          </SheetBody>
          <SheetFooter>
            <Button onClick={handleSave} className="w-full">{editingItem ? 'Save Changes' : 'Create Ticket'}</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      <ConfirmDialog open={confirm.open} title={confirm.title} description={confirm.description} onConfirm={confirm.handleConfirm} onCancel={confirm.handleClose} confirmLabel="Delete" />
    </div>
  )
}
