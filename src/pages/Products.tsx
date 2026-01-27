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
import {
  Sheet, SheetContent, SheetDescription,
  SheetHeader, SheetTitle,
} from '@/components/ui/sheet'
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Plus, MoreHorizontal, Pencil, Trash2, ArchiveRestore } from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'
import type { Product } from '@/types'

type FormData = Omit<Product, 'id' | 'deleted'>

const emptyForm: FormData = {
  name: '', description: '', category: '', price: 0, stock: 0,
  status: 'active', sku: '', image: '/placeholder.svg', createdAt: new Date().toISOString(),
}

export function ProductsPage() {
  const user = useStore((s) => s.user)
  const products = useStore((s) => s.products)
  const categories = useStore((s) => s.categories)
  const addProduct = useStore((s) => s.addProduct)
  const updateProduct = useStore((s) => s.updateProduct)
  const deleteProduct = useStore((s) => s.deleteProduct)
  const restoreProduct = useStore((s) => s.restoreProduct)
  const bulkDeleteProducts = useStore((s) => s.bulkDeleteProducts)

  const [tab, setTab] = useState<'active' | 'trash'>('active')
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Product | null>(null)
  const [form, setForm] = useState<FormData>(emptyForm)
  const confirm = useConfirm()

  const canEdit = user ? can(user.role, 'products.edit') : false
  const canCreate = user ? can(user.role, 'products.create') : false
  const canDelete = user ? can(user.role, 'products.delete') : false

  const activeData = useMemo(() => products.filter((p) => !p.deleted), [products])
  const trashData = useMemo(() => products.filter((p) => p.deleted), [products])

  const openCreate = () => { setEditingItem(null); setForm(emptyForm); setSheetOpen(true) }
  const openEdit = (p: Product) => {
    setEditingItem(p)
    const { id: _id, deleted: _d, ...rest } = p
    setForm(rest)
    setSheetOpen(true)
  }

  const handleSave = () => {
    if (!form.name) { toast.error('Name is required'); return }
    if (editingItem) { updateProduct(editingItem.id, form); toast.success('Product updated') }
    else { addProduct(form); toast.success('Product created') }
    setSheetOpen(false)
  }

  const handleDelete = (id: string) => {
    confirm.confirm({
      title: 'Delete Product',
      description: 'This will move the product to trash.',
      onConfirm: () => { deleteProduct(id); toast.success('Product moved to trash') },
    })
  }

  const columns: ColumnDef<Product>[] = [
    { key: 'name', label: 'Product', sortable: true, render: (r) => (
      <div><p className="font-medium text-sm">{r.name}</p><p className="text-xs text-muted-foreground">{r.sku}</p></div>
    )},
    { key: 'category', label: 'Category', sortable: true },
    { key: 'price', label: 'Price', sortable: true, render: (r) => `$${r.price.toFixed(2)}` },
    { key: 'stock', label: 'Stock', sortable: true, render: (r) => (
      <span className={r.stock === 0 ? 'text-destructive font-medium' : r.stock < 50 ? 'text-amber-600' : ''}>
        {r.stock}
      </span>
    )},
    { key: 'status', label: 'Status', sortable: true, render: (r) => (
      <Badge variant={r.status === 'active' ? 'default' : r.status === 'draft' ? 'secondary' : 'outline'}>{r.status}</Badge>
    )},
    { key: 'createdAt', label: 'Created', sortable: true, render: (r) => format(new Date(r.createdAt), 'MMM d, yyyy') },
  ]

  const filters: FilterOption[] = [
    { key: 'category', label: 'Category', options: [...new Set(products.map((p) => p.category))].map((c) => ({ label: c, value: c })) },
    { key: 'status', label: 'Status', options: [{ label: 'Active', value: 'active' }, { label: 'Draft', value: 'draft' }, { label: 'Archived', value: 'archived' }] },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold tracking-tight">Products</h1><p className="text-muted-foreground">Manage your product catalog</p></div>
        {canCreate && <Button onClick={openCreate}><Plus size={16} className="mr-1.5" />Add Product</Button>}
      </div>
      <Tabs value={tab} onValueChange={(v) => setTab(v as 'active' | 'trash')}>
        <TabsList><TabsTrigger value="active">Active ({activeData.length})</TabsTrigger><TabsTrigger value="trash">Trash ({trashData.length})</TabsTrigger></TabsList>
      </Tabs>
      <DataTable
        data={tab === 'active' ? activeData : trashData}
        columns={columns} searchKey="name" searchPlaceholder="Search products..."
        filters={filters} isTrashView={tab === 'trash'}
        onDelete={canDelete ? handleDelete : undefined}
        onRestore={canDelete ? (id) => { restoreProduct(id); toast.success('Product restored') } : undefined}
        onBulkDelete={canDelete ? (ids) => confirm.confirm({ title: 'Bulk Delete', description: `Delete ${ids.length} products?`, onConfirm: () => { bulkDeleteProducts(ids); toast.success('Products deleted') } }) : undefined}
        actions={(row) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal size={16} /></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {tab === 'active' ? (<>
                {canEdit && <DropdownMenuItem onClick={() => openEdit(row)}><Pencil size={14} className="mr-2" />Edit</DropdownMenuItem>}
                {canDelete && <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(row.id)}><Trash2 size={14} className="mr-2" />Delete</DropdownMenuItem>}
              </>) : (canDelete && <DropdownMenuItem onClick={() => { restoreProduct(row.id); toast.success('Restored') }}><ArchiveRestore size={14} className="mr-2" />Restore</DropdownMenuItem>)}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader><SheetTitle>{editingItem ? 'Edit Product' : 'Create Product'}</SheetTitle><SheetDescription>{editingItem ? 'Update product details' : 'Add a new product'}</SheetDescription></SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2"><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="space-y-2"><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div className="space-y-2"><Label>SKU</Label><Input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Price</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} /></div>
              <div className="space-y-2"><Label>Stock</Label><Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} /></div>
            </div>
            <div className="space-y-2"><Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>{categories.filter((c) => !c.deleted && c.status === 'active').map((c) => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Product['status'] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="draft">Draft</SelectItem><SelectItem value="archived">Archived</SelectItem></SelectContent>
              </Select>
            </div>
            <Button onClick={handleSave} className="mt-2">{editingItem ? 'Save Changes' : 'Create Product'}</Button>
          </div>
        </SheetContent>
      </Sheet>
      <ConfirmDialog open={confirm.open} title={confirm.title} description={confirm.description} onConfirm={confirm.handleConfirm} onCancel={confirm.handleClose} confirmLabel="Delete" />
    </div>
  )
}
