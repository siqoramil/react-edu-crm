import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
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
  SheetHeader, SheetBody, SheetFooter, SheetTitle,
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
  const { t } = useTranslation()
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
    if (!form.name) { toast.error(t('products.nameRequired')); return }
    if (editingItem) { updateProduct(editingItem.id, form); toast.success(t('products.updated')) }
    else { addProduct(form); toast.success(t('products.created')) }
    setSheetOpen(false)
  }

  const handleDelete = (id: string) => {
    confirm.confirm({
      title: t('products.deleteProduct'),
      description: t('products.deleteConfirm'),
      onConfirm: () => { deleteProduct(id); toast.success(t('products.movedToTrash')) },
    })
  }

  const columns: ColumnDef<Product>[] = [
    { key: 'name', label: t('products.product'), sortable: true, render: (r) => (
      <div><p className="font-medium text-sm">{r.name}</p><p className="text-xs text-muted-foreground">{r.sku}</p></div>
    )},
    { key: 'category', label: t('products.category'), sortable: true },
    { key: 'price', label: t('products.price'), sortable: true, render: (r) => `$${r.price.toFixed(2)}` },
    { key: 'stock', label: t('products.stock'), sortable: true, render: (r) => (
      <span className={r.stock === 0 ? 'text-destructive font-medium' : r.stock < 50 ? 'text-amber-600' : ''}>
        {r.stock}
      </span>
    )},
    { key: 'status', label: t('common.status'), sortable: true, render: (r) => (
      <Badge variant={r.status === 'active' ? 'default' : r.status === 'draft' ? 'secondary' : 'outline'}>
        {r.status === 'active' ? t('common.active') : r.status === 'draft' ? t('products.draft') : t('products.archived')}
      </Badge>
    )},
    { key: 'createdAt', label: t('tickets.created'), sortable: true, render: (r) => format(new Date(r.createdAt), 'MMM d, yyyy') },
  ]

  const filters: FilterOption[] = [
    { key: 'category', label: t('products.category'), options: [...new Set(products.map((p) => p.category))].map((c) => ({ label: c, value: c })) },
    { key: 'status', label: t('common.status'), options: [{ label: t('common.active'), value: 'active' }, { label: t('products.draft'), value: 'draft' }, { label: t('products.archived'), value: 'archived' }] },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold tracking-tight">{t('products.title')}</h1><p className="text-muted-foreground">{t('products.subtitle')}</p></div>
        {canCreate && <Button onClick={openCreate}><Plus size={16} className="mr-1.5" />{t('products.addProduct')}</Button>}
      </div>
      <Tabs value={tab} onValueChange={(v) => setTab(v as 'active' | 'trash')}>
        <TabsList><TabsTrigger value="active">{t('table.active')} ({activeData.length})</TabsTrigger><TabsTrigger value="trash">{t('table.trash')} ({trashData.length})</TabsTrigger></TabsList>
      </Tabs>
      <DataTable
        data={tab === 'active' ? activeData : trashData}
        columns={columns} searchKey="name" searchPlaceholder={t('table.searchPlaceholder')}
        filters={filters} isTrashView={tab === 'trash'}
        onDelete={canDelete ? handleDelete : undefined}
        onRestore={canDelete ? (id) => { restoreProduct(id); toast.success(t('products.restored')) } : undefined}
        onBulkDelete={canDelete ? (ids) => confirm.confirm({ title: t('confirm.bulkDelete'), description: t('confirm.bulkDeleteDesc', { count: ids.length }), onConfirm: () => { bulkDeleteProducts(ids); toast.success(t('products.movedToTrash')) } }) : undefined}
        actions={(row) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal size={16} /></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {tab === 'active' ? (<>
                {canEdit && <DropdownMenuItem onClick={() => openEdit(row)}><Pencil size={14} className="mr-2" />{t('common.edit')}</DropdownMenuItem>}
                {canDelete && <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(row.id)}><Trash2 size={14} className="mr-2" />{t('common.delete')}</DropdownMenuItem>}
              </>) : (canDelete && <DropdownMenuItem onClick={() => { restoreProduct(row.id); toast.success(t('products.restored')) }}><ArchiveRestore size={14} className="mr-2" />{t('common.restore')}</DropdownMenuItem>)}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{editingItem ? t('products.editProduct') : t('products.createProduct')}</SheetTitle>
            <SheetDescription>{editingItem ? t('products.updateDetails') : t('products.addNew')}</SheetDescription>
          </SheetHeader>
          <SheetBody className="grid gap-4">
            <div className="space-y-2"><Label>{t('common.name')}</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="space-y-2"><Label>{t('common.description')}</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div className="space-y-2"><Label>{t('products.sku')}</Label><Input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>{t('products.price')}</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} /></div>
              <div className="space-y-2"><Label>{t('products.stock')}</Label><Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} /></div>
            </div>
            <div className="space-y-2"><Label>{t('products.category')}</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue placeholder={t('products.selectCategory')} /></SelectTrigger>
                <SelectContent>{categories.filter((c) => !c.deleted && c.status === 'active').map((c) => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>{t('common.status')}</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Product['status'] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="active">{t('common.active')}</SelectItem><SelectItem value="draft">{t('products.draft')}</SelectItem><SelectItem value="archived">{t('products.archived')}</SelectItem></SelectContent>
              </Select>
            </div>
          </SheetBody>
          <SheetFooter>
            <Button onClick={handleSave} className="w-full">{editingItem ? t('common.saveChanges') : t('products.createProduct')}</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      <ConfirmDialog open={confirm.open} title={confirm.title} description={confirm.description} onConfirm={confirm.handleConfirm} onCancel={confirm.handleClose} confirmLabel={t('common.delete')} />
    </div>
  )
}
