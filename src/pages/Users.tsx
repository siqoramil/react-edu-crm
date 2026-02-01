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
import type { User, Role } from '@/types'

type FormData = Omit<User, 'id' | 'deleted' | 'lastLogin'>

const emptyForm: FormData = {
  name: '', email: '', role: 'viewer', status: 'active',
  avatar: '', phone: '', department: '', joinedAt: new Date().toISOString(),
}

export function UsersPage() {
  const user = useStore((s) => s.user)
  const users = useStore((s) => s.users)
  const addUser = useStore((s) => s.addUser)
  const updateUser = useStore((s) => s.updateUser)
  const deleteUser = useStore((s) => s.deleteUser)
  const restoreUser = useStore((s) => s.restoreUser)
  const bulkDeleteUsers = useStore((s) => s.bulkDeleteUsers)

  const [tab, setTab] = useState<'active' | 'trash'>('active')
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [form, setForm] = useState<FormData>(emptyForm)
  const confirm = useConfirm()

  const canEdit = user ? can(user.role, 'users.edit') : false
  const canCreate = user ? can(user.role, 'users.create') : false
  const canDelete = user ? can(user.role, 'users.delete') : false

  const activeData = useMemo(() => users.filter((u) => !u.deleted), [users])
  const trashData = useMemo(() => users.filter((u) => u.deleted), [users])
  const data = tab === 'active' ? activeData : trashData

  const openCreate = () => {
    setEditingUser(null)
    setForm({ ...emptyForm, avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${Date.now()}` })
    setSheetOpen(true)
  }

  const openEdit = (u: User) => {
    setEditingUser(u)
    setForm({
      name: u.name, email: u.email, role: u.role, status: u.status,
      avatar: u.avatar, phone: u.phone, department: u.department,
      joinedAt: u.joinedAt, lastLogin: u.lastLogin,
    } as FormData)
    setSheetOpen(true)
  }

  const handleSave = () => {
    if (!form.name || !form.email) {
      toast.error('Name and email are required')
      return
    }
    if (editingUser) {
      updateUser(editingUser.id, form)
      toast.success('User updated')
    } else {
      addUser({ ...form, lastLogin: new Date().toISOString() } as Omit<User, 'id' | 'deleted'>)
      toast.success('User created')
    }
    setSheetOpen(false)
  }

  const handleDelete = (id: string) => {
    confirm.confirm({
      title: 'Delete User',
      description: 'This will move the user to trash. You can restore them later.',
      onConfirm: () => { deleteUser(id); toast.success('User moved to trash') },
    })
  }

  const columns: ColumnDef<User>[] = [
    {
      key: 'name', label: 'Name', sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <img src={row.avatar} alt="" className="h-8 w-8 rounded-full bg-muted" />
          <div>
            <p className="font-medium text-sm">{row.name}</p>
            <p className="text-xs text-muted-foreground">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role', label: 'Role', sortable: true,
      render: (row) => (
        <Badge variant="outline" className="capitalize">{row.role}</Badge>
      ),
    },
    {
      key: 'status', label: 'Status', sortable: true,
      render: (row) => (
        <Badge
          variant={row.status === 'active' ? 'default' : row.status === 'suspended' ? 'destructive' : 'secondary'}
        >
          {row.status}
        </Badge>
      ),
    },
    { key: 'department', label: 'Department', sortable: true },
    { key: 'phone', label: 'Phone', hidden: true },
    {
      key: 'joinedAt', label: 'Joined', sortable: true,
      render: (row) => format(new Date(row.joinedAt), 'MMM d, yyyy'),
    },
    {
      key: 'lastLogin', label: 'Last Login', sortable: true, hidden: true,
      render: (row) => format(new Date(row.lastLogin), 'MMM d, h:mm a'),
    },
  ]

  const filters: FilterOption[] = [
    {
      key: 'role', label: 'Role',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Manager', value: 'manager' },
        { label: 'Viewer', value: 'viewer' },
      ],
    },
    {
      key: 'status', label: 'Status',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Suspended', value: 'suspended' },
      ],
    },
    {
      key: 'department', label: 'Department',
      options: [...new Set(users.map((u) => u.department))].map((d) => ({ label: d, value: d })),
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">Manage system users and their roles</p>
        </div>
        {canCreate && (
          <Button onClick={openCreate}>
            <Plus size={16} className="mr-1.5" />
            Add User
          </Button>
        )}
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as 'active' | 'trash')}>
        <TabsList>
          <TabsTrigger value="active">Active ({activeData.length})</TabsTrigger>
          <TabsTrigger value="trash">Trash ({trashData.length})</TabsTrigger>
        </TabsList>
      </Tabs>

      <DataTable
        data={data}
        columns={columns}
        searchKey="name"
        searchPlaceholder="Search users..."
        filters={filters}
        isTrashView={tab === 'trash'}
        onDelete={canDelete ? handleDelete : undefined}
        onRestore={canDelete ? (id) => { restoreUser(id); toast.success('User restored') } : undefined}
        onBulkDelete={canDelete ? (ids) => {
          confirm.confirm({
            title: 'Bulk Delete Users',
            description: `This will move ${ids.length} users to trash.`,
            onConfirm: () => { bulkDeleteUsers(ids); toast.success(`${ids.length} users moved to trash`) },
          })
        } : undefined}
        actions={(row) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {tab === 'active' ? (
                <>
                  {canEdit && (
                    <DropdownMenuItem onClick={() => openEdit(row)}>
                      <Pencil size={14} className="mr-2" /> Edit
                    </DropdownMenuItem>
                  )}
                  {canDelete && (
                    <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(row.id)}>
                      <Trash2 size={14} className="mr-2" /> Delete
                    </DropdownMenuItem>
                  )}
                </>
              ) : (
                canDelete && (
                  <DropdownMenuItem onClick={() => { restoreUser(row.id); toast.success('User restored') }}>
                    <ArchiveRestore size={14} className="mr-2" /> Restore
                  </DropdownMenuItem>
                )
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />

      {/* Create/Edit Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{editingUser ? 'Edit User' : 'Create User'}</SheetTitle>
            <SheetDescription>
              {editingUser ? 'Update user information' : 'Add a new user to the system'}
            </SheetDescription>
          </SheetHeader>
          <SheetBody className="grid gap-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Department</Label>
              <Input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as Role })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => setForm({ ...form, status: v as User['status'] })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </SheetBody>
          <SheetFooter>
            <Button onClick={handleSave} className="w-full">
              {editingUser ? 'Save Changes' : 'Create User'}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <ConfirmDialog
        open={confirm.open}
        title={confirm.title}
        description={confirm.description}
        onConfirm={confirm.handleConfirm}
        onCancel={confirm.handleClose}
        confirmLabel="Delete"
      />
    </div>
  )
}
