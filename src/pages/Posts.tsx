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
import type { BlogPost } from '@/types'

export function PostsPage() {
  const user = useStore((s) => s.user)
  const posts = useStore((s) => s.posts)
  const addPost = useStore((s) => s.addPost)
  const updatePost = useStore((s) => s.updatePost)
  const deletePost = useStore((s) => s.deletePost)
  const restorePost = useStore((s) => s.restorePost)
  const bulkDeletePosts = useStore((s) => s.bulkDeletePosts)

  const [tab, setTab] = useState<'active' | 'trash'>('active')
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<BlogPost | null>(null)
  const [form, setForm] = useState({ title: '', slug: '', content: '', excerpt: '', author: '', category: '', tags: [] as string[], status: 'draft' as BlogPost['status'], featuredImage: '/placeholder.svg', publishedAt: null as string | null })
  const confirm = useConfirm()

  const canEdit = user ? can(user.role, 'posts.edit') : false
  const canCreate = user ? can(user.role, 'posts.create') : false
  const canDelete = user ? can(user.role, 'posts.delete') : false

  const activeData = useMemo(() => posts.filter((p) => !p.deleted), [posts])
  const trashData = useMemo(() => posts.filter((p) => p.deleted), [posts])

  const openCreate = () => {
    setEditingItem(null)
    setForm({ title: '', slug: '', content: '', excerpt: '', author: user?.name ?? '', category: '', tags: [], status: 'draft', featuredImage: '/placeholder.svg', publishedAt: null })
    setSheetOpen(true)
  }
  const openEdit = (p: BlogPost) => {
    setEditingItem(p)
    setForm({ title: p.title, slug: p.slug, content: p.content, excerpt: p.excerpt, author: p.author, category: p.category, tags: p.tags, status: p.status, featuredImage: p.featuredImage, publishedAt: p.publishedAt })
    setSheetOpen(true)
  }
  const handleSave = () => {
    if (!form.title) { toast.error('Title required'); return }
    const slug = form.slug || form.title.toLowerCase().replace(/\s+/g, '-')
    const pub = form.status === 'published' && !form.publishedAt ? new Date().toISOString() : form.publishedAt
    if (editingItem) { updatePost(editingItem.id, { ...form, slug, publishedAt: pub }); toast.success('Post updated') }
    else { addPost({ ...form, slug, publishedAt: pub, createdAt: new Date().toISOString() } as Omit<BlogPost, 'id' | 'deleted'>); toast.success('Post created') }
    setSheetOpen(false)
  }
  const handleDelete = (id: string) => {
    confirm.confirm({ title: 'Delete Post', description: 'Move to trash?', onConfirm: () => { deletePost(id); toast.success('Post deleted') } })
  }

  const columns: ColumnDef<BlogPost>[] = [
    { key: 'title', label: 'Title', sortable: true, render: (r) => (<div><p className="font-medium text-sm">{r.title}</p><p className="text-xs text-muted-foreground">{r.author}</p></div>) },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'status', label: 'Status', sortable: true, render: (r) => <Badge variant={r.status === 'published' ? 'default' : r.status === 'draft' ? 'secondary' : 'outline'}>{r.status}</Badge> },
    { key: 'tags', label: 'Tags', render: (r) => <div className="flex gap-1 flex-wrap">{r.tags.slice(0, 2).map((t) => <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>)}</div> },
    { key: 'publishedAt', label: 'Published', sortable: true, render: (r) => r.publishedAt ? format(new Date(r.publishedAt), 'MMM d, yyyy') : '-' },
  ]

  const filters: FilterOption[] = [
    { key: 'status', label: 'Status', options: [{ label: 'Published', value: 'published' }, { label: 'Draft', value: 'draft' }, { label: 'Archived', value: 'archived' }] },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold tracking-tight">Blog Posts</h1><p className="text-muted-foreground">Manage content and articles</p></div>
        {canCreate && <Button onClick={openCreate}><Plus size={16} className="mr-1.5" />New Post</Button>}
      </div>
      <Tabs value={tab} onValueChange={(v) => setTab(v as 'active' | 'trash')}>
        <TabsList><TabsTrigger value="active">Active ({activeData.length})</TabsTrigger><TabsTrigger value="trash">Trash ({trashData.length})</TabsTrigger></TabsList>
      </Tabs>
      <DataTable
        data={tab === 'active' ? activeData : trashData} columns={columns} searchKey="title"
        searchPlaceholder="Search posts..." filters={filters} isTrashView={tab === 'trash'}
        onDelete={canDelete ? handleDelete : undefined}
        onRestore={canDelete ? (id) => { restorePost(id); toast.success('Restored') } : undefined}
        onBulkDelete={canDelete ? (ids) => confirm.confirm({ title: 'Bulk Delete', description: `Delete ${ids.length} posts?`, onConfirm: () => { bulkDeletePosts(ids); toast.success('Posts deleted') } }) : undefined}
        actions={(row) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal size={16} /></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {tab === 'active' ? (<>
                {canEdit && <DropdownMenuItem onClick={() => openEdit(row)}><Pencil size={14} className="mr-2" />Edit</DropdownMenuItem>}
                {canDelete && <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(row.id)}><Trash2 size={14} className="mr-2" />Delete</DropdownMenuItem>}
              </>) : (canDelete && <DropdownMenuItem onClick={() => { restorePost(row.id); toast.success('Restored') }}><ArchiveRestore size={14} className="mr-2" />Restore</DropdownMenuItem>)}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{editingItem ? 'Edit Post' : 'New Post'}</SheetTitle>
            <SheetDescription>Manage blog post content</SheetDescription>
          </SheetHeader>
          <SheetBody className="grid gap-4">
            <div className="space-y-2"><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div className="space-y-2"><Label>Slug</Label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated" /></div>
            <div className="space-y-2"><Label>Excerpt</Label><Textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} /></div>
            <div className="space-y-2"><Label>Content</Label><Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={6} /></div>
            <div className="space-y-2"><Label>Author</Label><Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} /></div>
            <div className="space-y-2"><Label>Category</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
            <div className="space-y-2"><Label>Tags (comma-separated)</Label><Input value={form.tags.join(', ')} onChange={(e) => setForm({ ...form, tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })} /></div>
            <div className="space-y-2"><Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as BlogPost['status'] })}>
                <SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="draft">Draft</SelectItem><SelectItem value="published">Published</SelectItem><SelectItem value="archived">Archived</SelectItem></SelectContent>
              </Select>
            </div>
          </SheetBody>
          <SheetFooter>
            <Button onClick={handleSave} className="w-full">{editingItem ? 'Save Changes' : 'Create Post'}</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      <ConfirmDialog open={confirm.open} title={confirm.title} description={confirm.description} onConfirm={confirm.handleConfirm} onCancel={confirm.handleClose} confirmLabel="Delete" />
    </div>
  )
}
