import { useState, useMemo } from 'react'
import { useStore } from '@/store'
import { can } from '@/lib/permissions'
import { DataTable, type ColumnDef } from '@/components/shared/DataTable'
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
import { toast } from 'sonner'
import type { Category } from '@/types'

export function CategoriesPage() {
  const user = useStore((s) => s.user)
  const categories = useStore((s) => s.categories)
  const addCategory = useStore((s) => s.addCategory)
  const updateCategory = useStore((s) => s.updateCategory)
  const deleteCategory = useStore((s) => s.deleteCategory)
  const restoreCategory = useStore((s) => s.restoreCategory)

  const [tab, setTab] = useState<'active' | 'trash'>('active')
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Category | null>(null)
  const [form, setForm] = useState({ name: '', slug: '', description: '', parentId: null as string | null, productCount: 0, status: 'active' as Category['status'] })
  const confirm = useConfirm()

  const canEdit = user ? can(user.role, 'categories.edit') : false
  const canCreate = user ? can(user.role, 'categories.create') : false
  const canDelete = user ? can(user.role, 'categories.delete') : false

  const activeData = useMemo(() => categories.filter((c) => !c.deleted), [categories])
  const trashData = useMemo(() => categories.filter((c) => c.deleted), [categories])

  const openCreate = () => { setEditingItem(null); setForm({ name: '', slug: '', description: '', parentId: null, productCount: 0, status: 'active' }); setSheetOpen(true) }
  const openEdit = (c: Category) => { setEditingItem(c); setForm({ name: c.name, slug: c.slug, description: c.description, parentId: c.parentId, productCount: c.productCount, status: c.status }); setSheetOpen(true) }
  const handleSave = () => {
    if (!form.name) { toast.error('Name required'); return }
    const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, '-')
    if (editingItem) { updateCategory(editingItem.id, { ...form, slug }); toast.success('Category updated') }
    else { addCategory({ ...form, slug, createdAt: new Date().toISOString() } as Omit<Category, 'id' | 'deleted'>); toast.success('Category created') }
    setSheetOpen(false)
  }
  const handleDelete = (id: string) => {
    confirm.confirm({ title: 'Delete Category', description: 'Move this category to trash?', onConfirm: () => { deleteCategory(id); toast.success('Category deleted') } })
  }

  const columns: ColumnDef<Category>[] = [
    { key: 'name', label: 'Name', sortable: true, render: (r) => <span className="font-medium">{r.name}</span> },
    { key: 'slug', label: 'Slug', render: (r) => <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{r.slug}</code> },
    { key: 'description', label: 'Description' },
    { key: 'productCount', label: 'Products', sortable: true },
    { key: 'status', label: 'Status', sortable: true, render: (r) => <Badge variant={r.status === 'active' ? 'default' : 'secondary'}>{r.status}</Badge> },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold tracking-tight">Categories</h1><p className="text-muted-foreground">Manage product categories</p></div>
        {canCreate && <Button onClick={openCreate}><Plus size={16} className="mr-1.5" />Add Category</Button>}
      </div>
      <Tabs value={tab} onValueChange={(v) => setTab(v as 'active' | 'trash')}>
        <TabsList><TabsTrigger value="active">Active ({activeData.length})</TabsTrigger><TabsTrigger value="trash">Trash ({trashData.length})</TabsTrigger></TabsList>
      </Tabs>
      <DataTable
        data={tab === 'active' ? activeData : trashData} columns={columns} searchKey="name"
        searchPlaceholder="Search categories..." isTrashView={tab === 'trash'}
        onDelete={canDelete ? handleDelete : undefined}
        onRestore={canDelete ? (id) => { restoreCategory(id); toast.success('Restored') } : undefined}
        actions={(row) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal size={16} /></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {tab === 'active' ? (<>
                {canEdit && <DropdownMenuItem onClick={() => openEdit(row)}><Pencil size={14} className="mr-2" />Edit</DropdownMenuItem>}
                {canDelete && <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(row.id)}><Trash2 size={14} className="mr-2" />Delete</DropdownMenuItem>}
              </>) : (canDelete && <DropdownMenuItem onClick={() => { restoreCategory(row.id); toast.success('Restored') }}><ArchiveRestore size={14} className="mr-2" />Restore</DropdownMenuItem>)}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{editingItem ? 'Edit Category' : 'New Category'}</SheetTitle>
            <SheetDescription>Manage category details</SheetDescription>
          </SheetHeader>
          <SheetBody className="grid gap-4">
            <div className="space-y-2"><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="space-y-2"><Label>Slug</Label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated from name" /></div>
            <div className="space-y-2"><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div className="space-y-2"><Label>Parent Category</Label>
              <Select value={form.parentId ?? '__none__'} onValueChange={(v) => setForm({ ...form, parentId: v === '__none__' ? null : v })}>
                <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
                <SelectContent><SelectItem value="__none__">None (Top-level)</SelectItem>{activeData.filter((c) => c.id !== editingItem?.id).map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Category['status'] })}>
                <SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem></SelectContent>
              </Select>
            </div>
          </SheetBody>
          <SheetFooter>
            <Button onClick={handleSave} className="w-full">{editingItem ? 'Save Changes' : 'Create Category'}</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      <ConfirmDialog open={confirm.open} title={confirm.title} description={confirm.description} onConfirm={confirm.handleConfirm} onCancel={confirm.handleClose} confirmLabel="Delete" />
    </div>
  )
}
