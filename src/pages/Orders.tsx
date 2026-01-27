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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle,
} from '@/components/ui/sheet'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Plus, MoreHorizontal, Pencil, Trash2, ArchiveRestore } from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'
import type { Order } from '@/types'

export function OrdersPage() {
  const user = useStore((s) => s.user)
  const orders = useStore((s) => s.orders)
  const addOrder = useStore((s) => s.addOrder)
  const updateOrder = useStore((s) => s.updateOrder)
  const deleteOrder = useStore((s) => s.deleteOrder)
  const restoreOrder = useStore((s) => s.restoreOrder)
  const bulkDeleteOrders = useStore((s) => s.bulkDeleteOrders)

  const [tab, setTab] = useState<'active' | 'trash'>('active')
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Order | null>(null)
  const [form, setForm] = useState({ customer: '', customerEmail: '', total: 0, status: 'pending' as Order['status'], paymentStatus: 'unpaid' as Order['paymentStatus'], shippingAddress: '' })
  const confirm = useConfirm()

  const canEdit = user ? can(user.role, 'orders.edit') : false
  const canCreate = user ? can(user.role, 'orders.create') : false
  const canDelete = user ? can(user.role, 'orders.delete') : false

  const activeData = useMemo(() => orders.filter((o) => !o.deleted), [orders])
  const trashData = useMemo(() => orders.filter((o) => o.deleted), [orders])

  const openCreate = () => {
    setEditingItem(null)
    setForm({ customer: '', customerEmail: '', total: 0, status: 'pending', paymentStatus: 'unpaid', shippingAddress: '' })
    setSheetOpen(true)
  }
  const openEdit = (o: Order) => {
    setEditingItem(o)
    setForm({ customer: o.customer, customerEmail: o.customerEmail, total: o.total, status: o.status, paymentStatus: o.paymentStatus, shippingAddress: o.shippingAddress })
    setSheetOpen(true)
  }
  const handleSave = () => {
    if (!form.customer) { toast.error('Customer name required'); return }
    if (editingItem) { updateOrder(editingItem.id, form); toast.success('Order updated') }
    else { addOrder({ ...form, items: [], createdAt: new Date().toISOString() } as Omit<Order, 'id' | 'deleted'>); toast.success('Order created') }
    setSheetOpen(false)
  }
  const handleDelete = (id: string) => {
    confirm.confirm({ title: 'Delete Order', description: 'Move this order to trash?', onConfirm: () => { deleteOrder(id); toast.success('Order moved to trash') } })
  }

  const statusColor = (s: Order['status']) => {
    switch (s) {
      case 'delivered': return 'default'
      case 'cancelled': return 'destructive'
      case 'shipped': return 'outline'
      default: return 'secondary'
    }
  }

  const columns: ColumnDef<Order>[] = [
    { key: 'id', label: 'Order ID', sortable: true, render: (r) => <span className="font-mono text-sm">#{r.id}</span> },
    { key: 'customer', label: 'Customer', sortable: true, render: (r) => (<div><p className="font-medium text-sm">{r.customer}</p><p className="text-xs text-muted-foreground">{r.customerEmail}</p></div>) },
    { key: 'total', label: 'Total', sortable: true, render: (r) => <span className="font-medium">${r.total.toFixed(2)}</span> },
    { key: 'status', label: 'Status', sortable: true, render: (r) => <Badge variant={statusColor(r.status)}>{r.status}</Badge> },
    { key: 'paymentStatus', label: 'Payment', sortable: true, render: (r) => <Badge variant={r.paymentStatus === 'paid' ? 'default' : r.paymentStatus === 'refunded' ? 'outline' : 'secondary'}>{r.paymentStatus}</Badge> },
    { key: 'createdAt', label: 'Date', sortable: true, render: (r) => format(new Date(r.createdAt), 'MMM d, yyyy') },
  ]

  const filters: FilterOption[] = [
    { key: 'status', label: 'Status', options: ['pending','processing','shipped','delivered','cancelled'].map((s) => ({ label: s, value: s })) },
    { key: 'paymentStatus', label: 'Payment', options: ['paid','unpaid','refunded'].map((s) => ({ label: s, value: s })) },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold tracking-tight">Orders</h1><p className="text-muted-foreground">Track and manage orders</p></div>
        {canCreate && <Button onClick={openCreate}><Plus size={16} className="mr-1.5" />Add Order</Button>}
      </div>
      <Tabs value={tab} onValueChange={(v) => setTab(v as 'active' | 'trash')}>
        <TabsList><TabsTrigger value="active">Active ({activeData.length})</TabsTrigger><TabsTrigger value="trash">Trash ({trashData.length})</TabsTrigger></TabsList>
      </Tabs>
      <DataTable
        data={tab === 'active' ? activeData : trashData} columns={columns} searchKey="customer"
        searchPlaceholder="Search orders..." filters={filters} isTrashView={tab === 'trash'}
        onDelete={canDelete ? handleDelete : undefined}
        onRestore={canDelete ? (id) => { restoreOrder(id); toast.success('Restored') } : undefined}
        onBulkDelete={canDelete ? (ids) => confirm.confirm({ title: 'Bulk Delete', description: `Delete ${ids.length} orders?`, onConfirm: () => { bulkDeleteOrders(ids); toast.success('Orders deleted') } }) : undefined}
        actions={(row) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal size={16} /></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {tab === 'active' ? (<>
                {canEdit && <DropdownMenuItem onClick={() => openEdit(row)}><Pencil size={14} className="mr-2" />Edit</DropdownMenuItem>}
                {canDelete && <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(row.id)}><Trash2 size={14} className="mr-2" />Delete</DropdownMenuItem>}
              </>) : (canDelete && <DropdownMenuItem onClick={() => { restoreOrder(row.id); toast.success('Restored') }}><ArchiveRestore size={14} className="mr-2" />Restore</DropdownMenuItem>)}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="overflow-y-auto"><SheetHeader><SheetTitle>{editingItem ? 'Edit Order' : 'Create Order'}</SheetTitle><SheetDescription>Manage order details</SheetDescription></SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2"><Label>Customer Name</Label><Input value={form.customer} onChange={(e) => setForm({ ...form, customer: e.target.value })} /></div>
            <div className="space-y-2"><Label>Customer Email</Label><Input type="email" value={form.customerEmail} onChange={(e) => setForm({ ...form, customerEmail: e.target.value })} /></div>
            <div className="space-y-2"><Label>Total</Label><Input type="number" value={form.total} onChange={(e) => setForm({ ...form, total: Number(e.target.value) })} /></div>
            <div className="space-y-2"><Label>Shipping Address</Label><Input value={form.shippingAddress} onChange={(e) => setForm({ ...form, shippingAddress: e.target.value })} /></div>
            <div className="space-y-2"><Label>Status</Label><Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Order['status'] })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{['pending','processing','shipped','delivered','cancelled'].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2"><Label>Payment</Label><Select value={form.paymentStatus} onValueChange={(v) => setForm({ ...form, paymentStatus: v as Order['paymentStatus'] })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{['paid','unpaid','refunded'].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
            <Button onClick={handleSave} className="mt-2">{editingItem ? 'Save Changes' : 'Create Order'}</Button>
          </div>
        </SheetContent>
      </Sheet>
      <ConfirmDialog open={confirm.open} title={confirm.title} description={confirm.description} onConfirm={confirm.handleConfirm} onCancel={confirm.handleClose} confirmLabel="Delete" />
    </div>
  )
}
