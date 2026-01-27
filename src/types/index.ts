// ─── Auth & Roles ───────────────────────────────────────────────
export type Role = 'admin' | 'manager' | 'viewer'

export type Permission =
  | 'users.view'
  | 'users.create'
  | 'users.edit'
  | 'users.delete'
  | 'products.view'
  | 'products.create'
  | 'products.edit'
  | 'products.delete'
  | 'orders.view'
  | 'orders.create'
  | 'orders.edit'
  | 'orders.delete'
  | 'tickets.view'
  | 'tickets.create'
  | 'tickets.edit'
  | 'tickets.delete'
  | 'categories.view'
  | 'categories.create'
  | 'categories.edit'
  | 'categories.delete'
  | 'posts.view'
  | 'posts.create'
  | 'posts.edit'
  | 'posts.delete'
  | 'media.view'
  | 'media.upload'
  | 'media.delete'
  | 'settings.view'
  | 'settings.edit'
  | 'reports.view'
  | 'admin.roles'
  | 'admin.logs'
  | 'admin.features'
  | 'admin.maintenance'
  | 'admin.sessions'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: Role
  avatar: string
}

// ─── Core Entities ──────────────────────────────────────────────
export interface User {
  id: string
  name: string
  email: string
  role: Role
  status: 'active' | 'inactive' | 'suspended'
  avatar: string
  phone: string
  department: string
  joinedAt: string
  lastLogin: string
  deleted: boolean
}

export interface Product {
  id: string
  name: string
  description: string
  category: string
  price: number
  stock: number
  status: 'active' | 'draft' | 'archived'
  sku: string
  image: string
  createdAt: string
  deleted: boolean
}

export interface Order {
  id: string
  customer: string
  customerEmail: string
  items: OrderItem[]
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentStatus: 'paid' | 'unpaid' | 'refunded'
  createdAt: string
  shippingAddress: string
  deleted: boolean
}

export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  price: number
}

export interface Ticket {
  id: string
  subject: string
  description: string
  customer: string
  customerEmail: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  assignee: string
  category: string
  createdAt: string
  updatedAt: string
  deleted: boolean
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  parentId: string | null
  productCount: number
  status: 'active' | 'inactive'
  createdAt: string
  deleted: boolean
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  author: string
  category: string
  tags: string[]
  status: 'draft' | 'published' | 'archived'
  featuredImage: string
  publishedAt: string | null
  createdAt: string
  deleted: boolean
}

export interface MediaFile {
  id: string
  name: string
  type: 'image' | 'document' | 'video' | 'audio'
  mimeType: string
  size: number
  url: string
  uploadedBy: string
  createdAt: string
  deleted: boolean
}

export interface Settings {
  companyName: string
  companyEmail: string
  companyPhone: string
  companyAddress: string
  logo: string
  timezone: string
  dateFormat: string
  currency: string
  language: string
  maintenanceMode: boolean
  registrationEnabled: boolean
  emailNotifications: boolean
}

// ─── Admin Tools ────────────────────────────────────────────────
export interface AuditLog {
  id: string
  userId: string
  userName: string
  action: 'create' | 'update' | 'delete' | 'restore' | 'login' | 'logout' | 'export' | 'bulk_delete'
  entity: string
  entityId: string
  entityName: string
  details: string
  timestamp: string
}

export interface FeatureFlag {
  id: string
  name: string
  key: string
  description: string
  enabled: boolean
  updatedAt: string
}

export interface SessionEntry {
  id: string
  userId: string
  userName: string
  ip: string
  device: string
  browser: string
  location: string
  startedAt: string
  lastActivity: string
  status: 'active' | 'expired'
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  timestamp: string
}

// ─── Reports ────────────────────────────────────────────────────
export interface RevenueDataPoint {
  date: string
  revenue: number
  orders: number
}

export interface UserGrowthDataPoint {
  date: string
  newUsers: number
  totalUsers: number
}

export interface ProductPerformanceData {
  productName: string
  unitsSold: number
  revenue: number
  returns: number
}

export interface TicketSLAData {
  date: string
  resolved: number
  breached: number
  avgResponseTime: number
}

// ─── Role Permissions Map ───────────────────────────────────────
export interface RolePermission {
  role: Role
  permissions: Permission[]
}

// ─── UI State ───────────────────────────────────────────────────
export type Theme = 'light' | 'dark'

export interface SortConfig {
  key: string
  direction: 'asc' | 'desc'
}

export interface PaginationConfig {
  page: number
  pageSize: number
  total: number
}

export interface FilterConfig {
  key: string
  value: string
}
