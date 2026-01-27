import { useState, useMemo } from 'react'
import { useStore } from '@/store'
import { can } from '@/lib/permissions'
import { DataTable, type ColumnDef, type FilterOption } from '@/components/shared/DataTable'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { useConfirm } from '@/hooks/useConfirm'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Trash2, ArchiveRestore, FileImage, FileText, FileVideo, FileAudio } from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'
import type { MediaFile } from '@/types'

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const typeIcons: Record<string, React.ReactNode> = {
  image: <FileImage size={16} className="text-blue-500" />,
  document: <FileText size={16} className="text-amber-500" />,
  video: <FileVideo size={16} className="text-purple-500" />,
  audio: <FileAudio size={16} className="text-emerald-500" />,
}

export function MediaPage() {
  const user = useStore((s) => s.user)
  const media = useStore((s) => s.media)
  const deleteMedia = useStore((s) => s.deleteMedia)
  const restoreMedia = useStore((s) => s.restoreMedia)
  const bulkDeleteMedia = useStore((s) => s.bulkDeleteMedia)

  const [tab, setTab] = useState<'active' | 'trash'>('active')
  const confirm = useConfirm()

  const canDelete = user ? can(user.role, 'media.delete') : false

  const activeData = useMemo(() => media.filter((m) => !m.deleted), [media])
  const trashData = useMemo(() => media.filter((m) => m.deleted), [media])

  const handleDelete = (id: string) => {
    confirm.confirm({ title: 'Delete File', description: 'Move this file to trash?', onConfirm: () => { deleteMedia(id); toast.success('File deleted') } })
  }

  const columns: ColumnDef<MediaFile>[] = [
    { key: 'name', label: 'File', sortable: true, render: (r) => (
      <div className="flex items-center gap-3">{typeIcons[r.type]}<div><p className="font-medium text-sm">{r.name}</p><p className="text-xs text-muted-foreground">{r.mimeType}</p></div></div>
    )},
    { key: 'type', label: 'Type', sortable: true, render: (r) => <Badge variant="outline">{r.type}</Badge> },
    { key: 'size', label: 'Size', sortable: true, render: (r) => formatBytes(r.size) },
    { key: 'uploadedBy', label: 'Uploaded By', sortable: true },
    { key: 'createdAt', label: 'Date', sortable: true, render: (r) => format(new Date(r.createdAt), 'MMM d, yyyy') },
  ]

  const filters: FilterOption[] = [
    { key: 'type', label: 'Type', options: ['image','document','video','audio'].map((t) => ({ label: t, value: t })) },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold tracking-tight">Media Library</h1><p className="text-muted-foreground">Browse and manage uploaded files</p></div>
      </div>
      <Tabs value={tab} onValueChange={(v) => setTab(v as 'active' | 'trash')}>
        <TabsList><TabsTrigger value="active">Files ({activeData.length})</TabsTrigger><TabsTrigger value="trash">Trash ({trashData.length})</TabsTrigger></TabsList>
      </Tabs>
      <DataTable
        data={tab === 'active' ? activeData : trashData} columns={columns} searchKey="name"
        searchPlaceholder="Search files..." filters={filters} isTrashView={tab === 'trash'}
        onDelete={canDelete ? handleDelete : undefined}
        onRestore={canDelete ? (id) => { restoreMedia(id); toast.success('Restored') } : undefined}
        onBulkDelete={canDelete ? (ids) => confirm.confirm({ title: 'Bulk Delete', description: `Delete ${ids.length} files?`, onConfirm: () => { bulkDeleteMedia(ids); toast.success('Files deleted') } }) : undefined}
        actions={(row) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal size={16} /></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {tab === 'active'
                ? canDelete && <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(row.id)}><Trash2 size={14} className="mr-2" />Delete</DropdownMenuItem>
                : canDelete && <DropdownMenuItem onClick={() => { restoreMedia(row.id); toast.success('Restored') }}><ArchiveRestore size={14} className="mr-2" />Restore</DropdownMenuItem>
              }
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />
      <ConfirmDialog open={confirm.open} title={confirm.title} description={confirm.description} onConfirm={confirm.handleConfirm} onCancel={confirm.handleClose} confirmLabel="Delete" />
    </div>
  )
}
