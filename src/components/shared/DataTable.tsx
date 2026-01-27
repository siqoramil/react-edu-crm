import { useState, useMemo, useCallback } from 'react'
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  ArrowUpDown, ArrowUp, ArrowDown, Search,
  Columns3, Trash2, Download, MoreHorizontal,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  ArchiveRestore,
} from 'lucide-react'
import { EmptyState } from './EmptyState'

// ─── Types ────────────────────────────────────────────────────
export interface ColumnDef<T> {
  key: string
  label: string
  sortable?: boolean
  hidden?: boolean
  render?: (row: T) => React.ReactNode
  className?: string
}

export interface FilterOption {
  key: string
  label: string
  options: { label: string; value: string }[]
}

interface Props<T extends { id: string }> {
  data: T[]
  columns: ColumnDef<T>[]
  searchKey?: keyof T
  searchPlaceholder?: string
  filters?: FilterOption[]
  onEdit?: (row: T) => void
  onDelete?: (id: string) => void
  onRestore?: (id: string) => void
  onBulkDelete?: (ids: string[]) => void
  onExportCSV?: (ids: string[]) => void
  actions?: (row: T) => React.ReactNode
  loading?: boolean
  showTrash?: boolean
  isTrashView?: boolean
  pageSize?: number
}

export function DataTable<T extends { id: string }>({
  data,
  columns: columnsProp,
  searchKey,
  searchPlaceholder = 'Search...',
  filters = [],
  onDelete,
  onRestore,
  onBulkDelete,
  onExportCSV,
  actions,
  loading = false,
  isTrashView = false,
  pageSize: defaultPageSize = 10,
}: Props<T>) {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(defaultPageSize)
  const [hiddenCols, setHiddenCols] = useState<Set<string>>(
    new Set(columnsProp.filter((c) => c.hidden).map((c) => c.key)),
  )
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})

  // Visible columns
  const columns = useMemo(
    () => columnsProp.filter((c) => !hiddenCols.has(c.key)),
    [columnsProp, hiddenCols],
  )

  // Filter + search + sort
  const processedData = useMemo(() => {
    let result = [...data]

    // Search
    if (search && searchKey) {
      const q = search.toLowerCase()
      result = result.filter((row) => {
        const val = row[searchKey]
        return typeof val === 'string' && val.toLowerCase().includes(q)
      })
    }

    // Filters
    for (const [key, value] of Object.entries(activeFilters)) {
      if (value && value !== '__all__') {
        result = result.filter((row) => {
          const v = (row as Record<string, unknown>)[key]
          return String(v) === value
        })
      }
    }

    // Sort
    if (sortKey) {
      result.sort((a, b) => {
        const aVal = (a as Record<string, unknown>)[sortKey]
        const bVal = (b as Record<string, unknown>)[sortKey]
        if (aVal == null) return 1
        if (bVal == null) return -1
        const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
        return sortDir === 'asc' ? cmp : -cmp
      })
    }

    return result
  }, [data, search, searchKey, activeFilters, sortKey, sortDir])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(processedData.length / pageSize))
  const paginatedData = useMemo(
    () => processedData.slice((page - 1) * pageSize, page * pageSize),
    [processedData, page, pageSize],
  )

  // Handlers
  const handleSort = useCallback(
    (key: string) => {
      if (sortKey === key) {
        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
      } else {
        setSortKey(key)
        setSortDir('asc')
      }
    },
    [sortKey],
  )

  const toggleSelect = useCallback(
    (id: string) => {
      setSelectedIds((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
      )
    },
    [],
  )

  const toggleSelectAll = useCallback(() => {
    if (selectedIds.length === paginatedData.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(paginatedData.map((r) => r.id))
    }
  }, [selectedIds.length, paginatedData])

  const handleExportCSV = useCallback(() => {
    const ids = selectedIds.length > 0 ? selectedIds : processedData.map((r) => r.id)
    if (onExportCSV) {
      onExportCSV(ids)
      return
    }
    // Default CSV export
    const exportData = selectedIds.length > 0
      ? processedData.filter((r) => selectedIds.includes(r.id))
      : processedData
    const headers = columnsProp.map((c) => c.label).join(',')
    const rows = exportData.map((row) =>
      columnsProp
        .map((c) => {
          const val = (row as Record<string, unknown>)[c.key]
          return typeof val === 'string' && val.includes(',') ? `"${val}"` : String(val ?? '')
        })
        .join(','),
    )
    const csv = [headers, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'export.csv'
    a.click()
    URL.revokeObjectURL(url)
  }, [selectedIds, processedData, columnsProp, onExportCSV])

  const toggleColumn = useCallback((key: string) => {
    setHiddenCols((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }, [])

  // Loading skeleton
  if (loading) {
    return (
      <div className="space-y-3">
        <div className="flex gap-2">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-9 w-32" />
        </div>
        <div className="rounded-md border">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 border-b last:border-0">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        {searchKey && (
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className="pl-8 h-9 w-64"
            />
          </div>
        )}

        {filters.map((filter) => (
          <Select
            key={filter.key}
            value={activeFilters[filter.key] ?? '__all__'}
            onValueChange={(v) => {
              setActiveFilters((prev) => ({ ...prev, [filter.key]: v }))
              setPage(1)
            }}
          >
            <SelectTrigger className="h-9 w-36">
              <SelectValue placeholder={filter.label} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">All {filter.label}</SelectItem>
              {filter.options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}

        <div className="ml-auto flex items-center gap-2">
          {/* Column visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <Columns3 size={14} className="mr-1.5" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {columnsProp.map((col) => (
                <DropdownMenuCheckboxItem
                  key={col.key}
                  checked={!hiddenCols.has(col.key)}
                  onCheckedChange={() => toggleColumn(col.key)}
                >
                  {col.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Export CSV */}
          <Button variant="outline" size="sm" className="h-9" onClick={handleExportCSV}>
            <Download size={14} className="mr-1.5" />
            Export
          </Button>
        </div>
      </div>

      {/* Bulk actions bar */}
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-3 rounded-md bg-muted px-4 py-2">
          <Badge variant="secondary">{selectedIds.length} selected</Badge>
          {isTrashView && onRestore && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => { selectedIds.forEach((id) => onRestore(id)); setSelectedIds([]) }}
            >
              <ArchiveRestore size={14} className="mr-1.5" />
              Restore
            </Button>
          )}
          {onBulkDelete && !isTrashView && (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => { onBulkDelete(selectedIds); setSelectedIds([]) }}
            >
              <Trash2 size={14} className="mr-1.5" />
              Delete Selected
            </Button>
          )}
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox
                  checked={
                    paginatedData.length > 0 &&
                    selectedIds.length === paginatedData.length
                  }
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              {columns.map((col) => (
                <TableHead key={col.key} className={col.className}>
                  {col.sortable ? (
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort(col.key)}
                    >
                      {col.label}
                      {sortKey === col.key ? (
                        sortDir === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                      ) : (
                        <ArrowUpDown size={14} className="opacity-40" />
                      )}
                    </button>
                  ) : (
                    col.label
                  )}
                </TableHead>
              ))}
              {(actions || onDelete || onRestore) && (
                <TableHead className="w-16 text-right">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 2}>
                  <EmptyState
                    title={search ? 'No results found' : 'No data'}
                    description={search ? 'Try adjusting your search or filters.' : undefined}
                  />
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row) => (
                <TableRow
                  key={row.id}
                  className={selectedIds.includes(row.id) ? 'bg-muted/50' : ''}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(row.id)}
                      onCheckedChange={() => toggleSelect(row.id)}
                    />
                  </TableCell>
                  {columns.map((col) => (
                    <TableCell key={col.key} className={col.className}>
                      {col.render
                        ? col.render(row)
                        : String((row as Record<string, unknown>)[col.key] ?? '')}
                    </TableCell>
                  ))}
                  {(actions || onDelete || onRestore) && (
                    <TableCell className="text-right">
                      {actions ? (
                        actions(row)
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {isTrashView && onRestore ? (
                              <DropdownMenuItem onClick={() => onRestore(row.id)}>
                                <ArchiveRestore size={14} className="mr-2" />
                                Restore
                              </DropdownMenuItem>
                            ) : (
                              onDelete && (
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => onDelete(row.id)}
                                >
                                  <Trash2 size={14} className="mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              )
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {processedData.length} total{' '}
          {selectedIds.length > 0 && `(${selectedIds.length} selected)`}
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={String(pageSize)}
            onValueChange={(v) => { setPageSize(Number(v)); setPage(1) }}
          >
            <SelectTrigger className="h-8 w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 50].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <span className="text-sm text-muted-foreground mx-2">
            Page {page} of {totalPages}
          </span>

          <Button
            variant="outline" size="icon" className="h-8 w-8"
            disabled={page <= 1} onClick={() => setPage(1)}
          >
            <ChevronsLeft size={14} />
          </Button>
          <Button
            variant="outline" size="icon" className="h-8 w-8"
            disabled={page <= 1} onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft size={14} />
          </Button>
          <Button
            variant="outline" size="icon" className="h-8 w-8"
            disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}
          >
            <ChevronRight size={14} />
          </Button>
          <Button
            variant="outline" size="icon" className="h-8 w-8"
            disabled={page >= totalPages} onClick={() => setPage(totalPages)}
          >
            <ChevronsRight size={14} />
          </Button>
        </div>
      </div>
    </div>
  )
}
