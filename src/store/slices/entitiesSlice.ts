import type { StateCreator } from 'zustand'
import type {
  User, Product, Order, Ticket, Category, BlogPost,
  MediaFile, Settings, FeatureFlag, SessionEntry,
} from '@/types'
import type { StoreState } from '../index'
import {
  seedUsers, seedProducts, seedOrders, seedTickets,
  seedCategories, seedPosts, seedMedia, seedSettings,
  seedFeatureFlags, seedSessions,
} from '@/data/data'

export interface EntitiesSlice {
  // Data
  users: User[]
  products: Product[]
  orders: Order[]
  tickets: Ticket[]
  categories: Category[]
  posts: BlogPost[]
  media: MediaFile[]
  settings: Settings
  featureFlags: FeatureFlag[]
  sessions: SessionEntry[]

  // Users CRUD
  addUser: (u: Omit<User, 'id' | 'deleted'>) => void
  updateUser: (id: string, data: Partial<User>) => void
  deleteUser: (id: string) => void
  restoreUser: (id: string) => void
  bulkDeleteUsers: (ids: string[]) => void

  // Products CRUD
  addProduct: (p: Omit<Product, 'id' | 'deleted'>) => void
  updateProduct: (id: string, data: Partial<Product>) => void
  deleteProduct: (id: string) => void
  restoreProduct: (id: string) => void
  bulkDeleteProducts: (ids: string[]) => void

  // Orders CRUD
  addOrder: (o: Omit<Order, 'id' | 'deleted'>) => void
  updateOrder: (id: string, data: Partial<Order>) => void
  deleteOrder: (id: string) => void
  restoreOrder: (id: string) => void
  bulkDeleteOrders: (ids: string[]) => void

  // Tickets CRUD
  addTicket: (t: Omit<Ticket, 'id' | 'deleted'>) => void
  updateTicket: (id: string, data: Partial<Ticket>) => void
  deleteTicket: (id: string) => void
  restoreTicket: (id: string) => void
  bulkDeleteTickets: (ids: string[]) => void

  // Categories CRUD
  addCategory: (c: Omit<Category, 'id' | 'deleted'>) => void
  updateCategory: (id: string, data: Partial<Category>) => void
  deleteCategory: (id: string) => void
  restoreCategory: (id: string) => void

  // Posts CRUD
  addPost: (p: Omit<BlogPost, 'id' | 'deleted'>) => void
  updatePost: (id: string, data: Partial<BlogPost>) => void
  deletePost: (id: string) => void
  restorePost: (id: string) => void
  bulkDeletePosts: (ids: string[]) => void

  // Media CRUD
  addMedia: (m: Omit<MediaFile, 'id' | 'deleted'>) => void
  deleteMedia: (id: string) => void
  restoreMedia: (id: string) => void
  bulkDeleteMedia: (ids: string[]) => void

  // Settings
  updateSettings: (data: Partial<Settings>) => void

  // Feature Flags
  toggleFeatureFlag: (id: string) => void

  // Sessions
  terminateSession: (id: string) => void
}

let counter = 100

export const createEntitiesSlice: StateCreator<StoreState, [], [], EntitiesSlice> = (set, get) => ({
  users: [...seedUsers],
  products: [...seedProducts],
  orders: [...seedOrders],
  tickets: [...seedTickets],
  categories: [...seedCategories],
  posts: [...seedPosts],
  media: [...seedMedia],
  settings: { ...seedSettings },
  featureFlags: [...seedFeatureFlags],
  sessions: [...seedSessions],

  // ── Users ───────────────────────────────────────────
  addUser: (u) => {
    const id = `u${++counter}`
    set((s) => ({ users: [...s.users, { ...u, id, deleted: false }] }))
    get().addLog({ action: 'create', entity: 'User', entityId: id, entityName: u.name, details: `Created user ${u.name}` })
    get().addNotification({ title: 'User created', message: `${u.name} has been added`, type: 'success' })
  },
  updateUser: (id, data) => {
    set((s) => ({ users: s.users.map((u) => (u.id === id ? { ...u, ...data } : u)) }))
    const user = get().users.find((u) => u.id === id)
    get().addLog({ action: 'update', entity: 'User', entityId: id, entityName: user?.name ?? id, details: `Updated user fields: ${Object.keys(data).join(', ')}` })
  },
  deleteUser: (id) => {
    const user = get().users.find((u) => u.id === id)
    set((s) => ({ users: s.users.map((u) => (u.id === id ? { ...u, deleted: true } : u)) }))
    get().addLog({ action: 'delete', entity: 'User', entityId: id, entityName: user?.name ?? id, details: 'Soft deleted user' })
    get().addNotification({ title: 'User deleted', message: `${user?.name ?? 'User'} moved to trash`, type: 'warning' })
  },
  restoreUser: (id) => {
    set((s) => ({ users: s.users.map((u) => (u.id === id ? { ...u, deleted: false } : u)) }))
    const user = get().users.find((u) => u.id === id)
    get().addLog({ action: 'restore', entity: 'User', entityId: id, entityName: user?.name ?? id, details: 'Restored user from trash' })
  },
  bulkDeleteUsers: (ids) => {
    set((s) => ({ users: s.users.map((u) => (ids.includes(u.id) ? { ...u, deleted: true } : u)) }))
    get().addLog({ action: 'bulk_delete', entity: 'User', entityId: '', entityName: `${ids.length} users`, details: `Bulk deleted ${ids.length} users` })
    get().addNotification({ title: 'Bulk delete', message: `${ids.length} users moved to trash`, type: 'warning' })
  },

  // ── Products ────────────────────────────────────────
  addProduct: (p) => {
    const id = `p${++counter}`
    set((s) => ({ products: [...s.products, { ...p, id, deleted: false }] }))
    get().addLog({ action: 'create', entity: 'Product', entityId: id, entityName: p.name, details: `Created product ${p.name}` })
    get().addNotification({ title: 'Product created', message: `${p.name} added to catalog`, type: 'success' })
  },
  updateProduct: (id, data) => {
    set((s) => ({ products: s.products.map((p) => (p.id === id ? { ...p, ...data } : p)) }))
    const prod = get().products.find((p) => p.id === id)
    get().addLog({ action: 'update', entity: 'Product', entityId: id, entityName: prod?.name ?? id, details: `Updated product fields: ${Object.keys(data).join(', ')}` })
  },
  deleteProduct: (id) => {
    const prod = get().products.find((p) => p.id === id)
    set((s) => ({ products: s.products.map((p) => (p.id === id ? { ...p, deleted: true } : p)) }))
    get().addLog({ action: 'delete', entity: 'Product', entityId: id, entityName: prod?.name ?? id, details: 'Soft deleted product' })
    get().addNotification({ title: 'Product deleted', message: `${prod?.name ?? 'Product'} moved to trash`, type: 'warning' })
  },
  restoreProduct: (id) => {
    set((s) => ({ products: s.products.map((p) => (p.id === id ? { ...p, deleted: false } : p)) }))
    const prod = get().products.find((p) => p.id === id)
    get().addLog({ action: 'restore', entity: 'Product', entityId: id, entityName: prod?.name ?? id, details: 'Restored product from trash' })
  },
  bulkDeleteProducts: (ids) => {
    set((s) => ({ products: s.products.map((p) => (ids.includes(p.id) ? { ...p, deleted: true } : p)) }))
    get().addLog({ action: 'bulk_delete', entity: 'Product', entityId: '', entityName: `${ids.length} products`, details: `Bulk deleted ${ids.length} products` })
  },

  // ── Orders ──────────────────────────────────────────
  addOrder: (o) => {
    const id = `o${++counter}`
    set((s) => ({ orders: [...s.orders, { ...o, id, deleted: false }] }))
    get().addLog({ action: 'create', entity: 'Order', entityId: id, entityName: `Order #${id}`, details: `New order from ${o.customer}` })
    get().addNotification({ title: 'New order', message: `Order #${id} from ${o.customer} ($${o.total.toFixed(2)})`, type: 'info' })
  },
  updateOrder: (id, data) => {
    set((s) => ({ orders: s.orders.map((o) => (o.id === id ? { ...o, ...data } : o)) }))
    get().addLog({ action: 'update', entity: 'Order', entityId: id, entityName: `Order #${id}`, details: `Updated order fields: ${Object.keys(data).join(', ')}` })
  },
  deleteOrder: (id) => {
    set((s) => ({ orders: s.orders.map((o) => (o.id === id ? { ...o, deleted: true } : o)) }))
    get().addLog({ action: 'delete', entity: 'Order', entityId: id, entityName: `Order #${id}`, details: 'Soft deleted order' })
  },
  restoreOrder: (id) => {
    set((s) => ({ orders: s.orders.map((o) => (o.id === id ? { ...o, deleted: false } : o)) }))
    get().addLog({ action: 'restore', entity: 'Order', entityId: id, entityName: `Order #${id}`, details: 'Restored order from trash' })
  },
  bulkDeleteOrders: (ids) => {
    set((s) => ({ orders: s.orders.map((o) => (ids.includes(o.id) ? { ...o, deleted: true } : o)) }))
    get().addLog({ action: 'bulk_delete', entity: 'Order', entityId: '', entityName: `${ids.length} orders`, details: `Bulk deleted ${ids.length} orders` })
  },

  // ── Tickets ─────────────────────────────────────────
  addTicket: (t) => {
    const id = `t${++counter}`
    set((s) => ({ tickets: [...s.tickets, { ...t, id, deleted: false }] }))
    get().addLog({ action: 'create', entity: 'Ticket', entityId: id, entityName: t.subject, details: `New ticket: ${t.subject}` })
    get().addNotification({ title: 'Ticket created', message: t.subject, type: 'info' })
  },
  updateTicket: (id, data) => {
    set((s) => ({ tickets: s.tickets.map((t) => (t.id === id ? { ...t, ...data } : t)) }))
    const ticket = get().tickets.find((t) => t.id === id)
    get().addLog({ action: 'update', entity: 'Ticket', entityId: id, entityName: ticket?.subject ?? id, details: `Updated ticket fields: ${Object.keys(data).join(', ')}` })
  },
  deleteTicket: (id) => {
    const ticket = get().tickets.find((t) => t.id === id)
    set((s) => ({ tickets: s.tickets.map((t) => (t.id === id ? { ...t, deleted: true } : t)) }))
    get().addLog({ action: 'delete', entity: 'Ticket', entityId: id, entityName: ticket?.subject ?? id, details: 'Soft deleted ticket' })
  },
  restoreTicket: (id) => {
    set((s) => ({ tickets: s.tickets.map((t) => (t.id === id ? { ...t, deleted: false } : t)) }))
    get().addLog({ action: 'restore', entity: 'Ticket', entityId: id, entityName: '', details: 'Restored ticket from trash' })
  },
  bulkDeleteTickets: (ids) => {
    set((s) => ({ tickets: s.tickets.map((t) => (ids.includes(t.id) ? { ...t, deleted: true } : t)) }))
    get().addLog({ action: 'bulk_delete', entity: 'Ticket', entityId: '', entityName: `${ids.length} tickets`, details: `Bulk deleted ${ids.length} tickets` })
  },

  // ── Categories ──────────────────────────────────────
  addCategory: (c) => {
    const id = `c${++counter}`
    set((s) => ({ categories: [...s.categories, { ...c, id, deleted: false }] }))
    get().addLog({ action: 'create', entity: 'Category', entityId: id, entityName: c.name, details: `Created category ${c.name}` })
  },
  updateCategory: (id, data) => {
    set((s) => ({ categories: s.categories.map((c) => (c.id === id ? { ...c, ...data } : c)) }))
    get().addLog({ action: 'update', entity: 'Category', entityId: id, entityName: '', details: `Updated category` })
  },
  deleteCategory: (id) => {
    set((s) => ({ categories: s.categories.map((c) => (c.id === id ? { ...c, deleted: true } : c)) }))
    get().addLog({ action: 'delete', entity: 'Category', entityId: id, entityName: '', details: 'Soft deleted category' })
  },
  restoreCategory: (id) => {
    set((s) => ({ categories: s.categories.map((c) => (c.id === id ? { ...c, deleted: false } : c)) }))
    get().addLog({ action: 'restore', entity: 'Category', entityId: id, entityName: '', details: 'Restored category' })
  },

  // ── Posts ────────────────────────────────────────────
  addPost: (p) => {
    const id = `bp${++counter}`
    set((s) => ({ posts: [...s.posts, { ...p, id, deleted: false }] }))
    get().addLog({ action: 'create', entity: 'Post', entityId: id, entityName: p.title, details: `Created post ${p.title}` })
  },
  updatePost: (id, data) => {
    set((s) => ({ posts: s.posts.map((p) => (p.id === id ? { ...p, ...data } : p)) }))
    get().addLog({ action: 'update', entity: 'Post', entityId: id, entityName: '', details: 'Updated post' })
  },
  deletePost: (id) => {
    set((s) => ({ posts: s.posts.map((p) => (p.id === id ? { ...p, deleted: true } : p)) }))
    get().addLog({ action: 'delete', entity: 'Post', entityId: id, entityName: '', details: 'Soft deleted post' })
  },
  restorePost: (id) => {
    set((s) => ({ posts: s.posts.map((p) => (p.id === id ? { ...p, deleted: false } : p)) }))
    get().addLog({ action: 'restore', entity: 'Post', entityId: id, entityName: '', details: 'Restored post' })
  },
  bulkDeletePosts: (ids) => {
    set((s) => ({ posts: s.posts.map((p) => (ids.includes(p.id) ? { ...p, deleted: true } : p)) }))
    get().addLog({ action: 'bulk_delete', entity: 'Post', entityId: '', entityName: `${ids.length} posts`, details: `Bulk deleted ${ids.length} posts` })
  },

  // ── Media ───────────────────────────────────────────
  addMedia: (m) => {
    const id = `m${++counter}`
    set((s) => ({ media: [...s.media, { ...m, id, deleted: false }] }))
    get().addLog({ action: 'create', entity: 'Media', entityId: id, entityName: m.name, details: `Uploaded ${m.name}` })
  },
  deleteMedia: (id) => {
    set((s) => ({ media: s.media.map((m) => (m.id === id ? { ...m, deleted: true } : m)) }))
    get().addLog({ action: 'delete', entity: 'Media', entityId: id, entityName: '', details: 'Soft deleted media file' })
  },
  restoreMedia: (id) => {
    set((s) => ({ media: s.media.map((m) => (m.id === id ? { ...m, deleted: false } : m)) }))
    get().addLog({ action: 'restore', entity: 'Media', entityId: id, entityName: '', details: 'Restored media file' })
  },
  bulkDeleteMedia: (ids) => {
    set((s) => ({ media: s.media.map((m) => (ids.includes(m.id) ? { ...m, deleted: true } : m)) }))
    get().addLog({ action: 'bulk_delete', entity: 'Media', entityId: '', entityName: `${ids.length} files`, details: `Bulk deleted ${ids.length} media files` })
  },

  // ── Settings ────────────────────────────────────────
  updateSettings: (data) => {
    set((s) => ({ settings: { ...s.settings, ...data } }))
    get().addLog({ action: 'update', entity: 'Settings', entityId: 'settings', entityName: 'Company Settings', details: `Updated: ${Object.keys(data).join(', ')}` })
    get().addNotification({ title: 'Settings updated', message: 'Company settings have been saved', type: 'success' })
  },

  // ── Feature Flags ───────────────────────────────────
  toggleFeatureFlag: (id) => {
    set((s) => ({
      featureFlags: s.featureFlags.map((f) =>
        f.id === id ? { ...f, enabled: !f.enabled, updatedAt: new Date().toISOString() } : f,
      ),
    }))
    const flag = get().featureFlags.find((f) => f.id === id)
    get().addLog({ action: 'update', entity: 'FeatureFlag', entityId: id, entityName: flag?.name ?? '', details: `Toggled ${flag?.name} to ${flag?.enabled ? 'enabled' : 'disabled'}` })
  },

  // ── Sessions ────────────────────────────────────────
  terminateSession: (id) => {
    set((s) => ({
      sessions: s.sessions.map((ses) =>
        ses.id === id ? { ...ses, status: 'expired' as const } : ses,
      ),
    }))
    get().addLog({ action: 'update', entity: 'Session', entityId: id, entityName: '', details: 'Terminated session' })
  },
})
