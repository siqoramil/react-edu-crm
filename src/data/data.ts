import type {
  User,
  Product,
  Order,
  Ticket,
  Category,
  BlogPost,
  MediaFile,
  Settings,
  AuditLog,
  FeatureFlag,
  SessionEntry,
  Notification,
  RevenueDataPoint,
  UserGrowthDataPoint,
  ProductPerformanceData,
  TicketSLAData,
  RolePermission,
  Permission,
} from '@/types'

// ─── Role Permission Mapping ────────────────────────────────────
const allPermissions: Permission[] = [
  'users.view','users.create','users.edit','users.delete',
  'products.view','products.create','products.edit','products.delete',
  'orders.view','orders.create','orders.edit','orders.delete',
  'tickets.view','tickets.create','tickets.edit','tickets.delete',
  'categories.view','categories.create','categories.edit','categories.delete',
  'posts.view','posts.create','posts.edit','posts.delete',
  'media.view','media.upload','media.delete',
  'settings.view','settings.edit',
  'reports.view',
  'admin.roles','admin.logs','admin.features','admin.maintenance','admin.sessions',
]

export const rolePermissions: RolePermission[] = [
  { role: 'admin', permissions: [...allPermissions] },
  {
    role: 'manager',
    permissions: [
      'users.view','users.create','users.edit',
      'products.view','products.create','products.edit','products.delete',
      'orders.view','orders.create','orders.edit',
      'tickets.view','tickets.create','tickets.edit',
      'categories.view','categories.create','categories.edit',
      'posts.view','posts.create','posts.edit','posts.delete',
      'media.view','media.upload',
      'settings.view',
      'reports.view',
    ],
  },
  {
    role: 'viewer',
    permissions: [
      'users.view',
      'products.view',
      'orders.view',
      'tickets.view',
      'categories.view',
      'posts.view',
      'media.view',
      'reports.view',
    ],
  },
]

// ─── Users ──────────────────────────────────────────────────────
export const seedUsers: User[] = [
  { id: 'u1', name: 'Alice Johnson', email: 'alice@acme.com', role: 'admin', status: 'active', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Alice', phone: '+1-555-0101', department: 'Engineering', joinedAt: '2023-01-15T08:00:00Z', lastLogin: '2025-05-10T14:30:00Z', deleted: false },
  { id: 'u2', name: 'Bob Martinez', email: 'bob@acme.com', role: 'manager', status: 'active', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Bob', phone: '+1-555-0102', department: 'Sales', joinedAt: '2023-03-22T08:00:00Z', lastLogin: '2025-05-09T10:15:00Z', deleted: false },
  { id: 'u3', name: 'Carol White', email: 'carol@acme.com', role: 'viewer', status: 'active', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Carol', phone: '+1-555-0103', department: 'Marketing', joinedAt: '2023-06-10T08:00:00Z', lastLogin: '2025-05-08T16:45:00Z', deleted: false },
  { id: 'u4', name: 'David Chen', email: 'david@acme.com', role: 'manager', status: 'inactive', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=David', phone: '+1-555-0104', department: 'Support', joinedAt: '2023-07-01T08:00:00Z', lastLogin: '2025-04-20T09:00:00Z', deleted: false },
  { id: 'u5', name: 'Eva Rodriguez', email: 'eva@acme.com', role: 'admin', status: 'active', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Eva', phone: '+1-555-0105', department: 'Engineering', joinedAt: '2023-02-14T08:00:00Z', lastLogin: '2025-05-10T11:30:00Z', deleted: false },
  { id: 'u6', name: 'Frank Lee', email: 'frank@acme.com', role: 'viewer', status: 'suspended', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Frank', phone: '+1-555-0106', department: 'Finance', joinedAt: '2024-01-20T08:00:00Z', lastLogin: '2025-03-15T08:00:00Z', deleted: false },
  { id: 'u7', name: 'Grace Kim', email: 'grace@acme.com', role: 'manager', status: 'active', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Grace', phone: '+1-555-0107', department: 'HR', joinedAt: '2023-09-05T08:00:00Z', lastLogin: '2025-05-10T13:00:00Z', deleted: false },
  { id: 'u8', name: 'Henry Patel', email: 'henry@acme.com', role: 'viewer', status: 'active', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Henry', phone: '+1-555-0108', department: 'Sales', joinedAt: '2024-03-12T08:00:00Z', lastLogin: '2025-05-07T15:30:00Z', deleted: false },
  { id: 'u9', name: 'Ivy Nguyen', email: 'ivy@acme.com', role: 'manager', status: 'active', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Ivy', phone: '+1-555-0109', department: 'Marketing', joinedAt: '2024-05-20T08:00:00Z', lastLogin: '2025-05-09T17:00:00Z', deleted: false },
  { id: 'u10', name: 'Jack Thompson', email: 'jack@acme.com', role: 'viewer', status: 'inactive', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Jack', phone: '+1-555-0110', department: 'Engineering', joinedAt: '2024-07-15T08:00:00Z', lastLogin: '2025-04-28T12:00:00Z', deleted: false },
  { id: 'u11', name: 'Karen Davis', email: 'karen@acme.com', role: 'admin', status: 'active', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Karen', phone: '+1-555-0111', department: 'Engineering', joinedAt: '2022-11-01T08:00:00Z', lastLogin: '2025-05-10T09:00:00Z', deleted: false },
  { id: 'u12', name: 'Leo Brown', email: 'leo@acme.com', role: 'viewer', status: 'active', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Leo', phone: '+1-555-0112', department: 'Support', joinedAt: '2024-09-01T08:00:00Z', lastLogin: '2025-05-06T14:00:00Z', deleted: false },
]

// ─── Products ───────────────────────────────────────────────────
export const seedProducts: Product[] = [
  { id: 'p1', name: 'Pro Wireless Headphones', description: 'Noise-cancelling Bluetooth headphones with 30h battery life', category: 'Electronics', price: 199.99, stock: 150, status: 'active', sku: 'EL-HP-001', image: '/placeholder.svg', createdAt: '2024-01-10T08:00:00Z', deleted: false },
  { id: 'p2', name: 'Ergonomic Office Chair', description: 'Adjustable lumbar support with mesh back', category: 'Furniture', price: 449.00, stock: 42, status: 'active', sku: 'FN-CH-001', image: '/placeholder.svg', createdAt: '2024-02-15T08:00:00Z', deleted: false },
  { id: 'p3', name: 'Ultra Slim Laptop 15"', description: '15-inch display, 16GB RAM, 512GB SSD', category: 'Electronics', price: 1299.00, stock: 78, status: 'active', sku: 'EL-LP-001', image: '/placeholder.svg', createdAt: '2024-03-01T08:00:00Z', deleted: false },
  { id: 'p4', name: 'Organic Green Tea', description: 'Premium Japanese matcha powder, 100g', category: 'Food & Beverage', price: 24.99, stock: 320, status: 'active', sku: 'FB-GT-001', image: '/placeholder.svg', createdAt: '2024-01-20T08:00:00Z', deleted: false },
  { id: 'p5', name: 'Running Shoes V2', description: 'Lightweight training shoes with cushioned sole', category: 'Apparel', price: 129.99, stock: 200, status: 'active', sku: 'AP-SH-001', image: '/placeholder.svg', createdAt: '2024-04-05T08:00:00Z', deleted: false },
  { id: 'p6', name: '4K Webcam', description: 'Ultra HD webcam with built-in microphone', category: 'Electronics', price: 89.99, stock: 0, status: 'draft', sku: 'EL-WC-001', image: '/placeholder.svg', createdAt: '2024-05-10T08:00:00Z', deleted: false },
  { id: 'p7', name: 'Standing Desk Converter', description: 'Height-adjustable desk riser for any workspace', category: 'Furniture', price: 299.00, stock: 65, status: 'active', sku: 'FN-DS-001', image: '/placeholder.svg', createdAt: '2024-02-28T08:00:00Z', deleted: false },
  { id: 'p8', name: 'Smart Water Bottle', description: 'Temperature display, 750ml insulated bottle', category: 'Accessories', price: 34.99, stock: 180, status: 'active', sku: 'AC-WB-001', image: '/placeholder.svg', createdAt: '2024-06-01T08:00:00Z', deleted: false },
  { id: 'p9', name: 'Mechanical Keyboard', description: 'Cherry MX switches, RGB backlit, full-size', category: 'Electronics', price: 159.99, stock: 95, status: 'active', sku: 'EL-KB-001', image: '/placeholder.svg', createdAt: '2024-03-15T08:00:00Z', deleted: false },
  { id: 'p10', name: 'Leather Messenger Bag', description: 'Genuine leather, fits 14" laptop', category: 'Accessories', price: 189.00, stock: 55, status: 'archived', sku: 'AC-BG-001', image: '/placeholder.svg', createdAt: '2023-12-01T08:00:00Z', deleted: false },
  { id: 'p11', name: 'Yoga Mat Pro', description: 'Non-slip, eco-friendly, 6mm thickness', category: 'Sports', price: 49.99, stock: 140, status: 'active', sku: 'SP-YM-001', image: '/placeholder.svg', createdAt: '2024-07-10T08:00:00Z', deleted: false },
  { id: 'p12', name: 'Bluetooth Speaker Mini', description: 'Portable waterproof speaker, 12h battery', category: 'Electronics', price: 59.99, stock: 210, status: 'active', sku: 'EL-SP-001', image: '/placeholder.svg', createdAt: '2024-08-20T08:00:00Z', deleted: false },
]

// ─── Orders ─────────────────────────────────────────────────────
export const seedOrders: Order[] = [
  { id: 'o1', customer: 'John Smith', customerEmail: 'john@example.com', items: [{ productId: 'p1', productName: 'Pro Wireless Headphones', quantity: 1, price: 199.99 }, { productId: 'p8', productName: 'Smart Water Bottle', quantity: 2, price: 34.99 }], total: 269.97, status: 'delivered', paymentStatus: 'paid', createdAt: '2025-05-01T10:00:00Z', shippingAddress: '123 Main St, New York, NY 10001', deleted: false },
  { id: 'o2', customer: 'Sarah Williams', customerEmail: 'sarah@example.com', items: [{ productId: 'p3', productName: 'Ultra Slim Laptop 15"', quantity: 1, price: 1299.00 }], total: 1299.00, status: 'shipped', paymentStatus: 'paid', createdAt: '2025-05-03T14:30:00Z', shippingAddress: '456 Oak Ave, Los Angeles, CA 90001', deleted: false },
  { id: 'o3', customer: 'Mike Johnson', customerEmail: 'mike@example.com', items: [{ productId: 'p2', productName: 'Ergonomic Office Chair', quantity: 1, price: 449.00 }, { productId: 'p7', productName: 'Standing Desk Converter', quantity: 1, price: 299.00 }], total: 748.00, status: 'processing', paymentStatus: 'paid', createdAt: '2025-05-05T09:15:00Z', shippingAddress: '789 Pine Rd, Chicago, IL 60601', deleted: false },
  { id: 'o4', customer: 'Emily Davis', customerEmail: 'emily@example.com', items: [{ productId: 'p5', productName: 'Running Shoes V2', quantity: 1, price: 129.99 }], total: 129.99, status: 'pending', paymentStatus: 'unpaid', createdAt: '2025-05-07T16:00:00Z', shippingAddress: '321 Elm St, Houston, TX 77001', deleted: false },
  { id: 'o5', customer: 'Alex Turner', customerEmail: 'alex@example.com', items: [{ productId: 'p9', productName: 'Mechanical Keyboard', quantity: 1, price: 159.99 }, { productId: 'p6', productName: '4K Webcam', quantity: 1, price: 89.99 }], total: 249.98, status: 'cancelled', paymentStatus: 'refunded', createdAt: '2025-04-28T11:00:00Z', shippingAddress: '654 Maple Dr, Phoenix, AZ 85001', deleted: false },
  { id: 'o6', customer: 'Lisa Wang', customerEmail: 'lisa@example.com', items: [{ productId: 'p4', productName: 'Organic Green Tea', quantity: 5, price: 24.99 }], total: 124.95, status: 'delivered', paymentStatus: 'paid', createdAt: '2025-04-25T08:45:00Z', shippingAddress: '987 Cedar Ln, San Francisco, CA 94101', deleted: false },
  { id: 'o7', customer: 'Tom Harris', customerEmail: 'tom@example.com', items: [{ productId: 'p11', productName: 'Yoga Mat Pro', quantity: 2, price: 49.99 }, { productId: 'p12', productName: 'Bluetooth Speaker Mini', quantity: 1, price: 59.99 }], total: 159.97, status: 'shipped', paymentStatus: 'paid', createdAt: '2025-05-06T13:20:00Z', shippingAddress: '147 Birch Blvd, Seattle, WA 98101', deleted: false },
  { id: 'o8', customer: 'Nina Patel', customerEmail: 'nina@example.com', items: [{ productId: 'p10', productName: 'Leather Messenger Bag', quantity: 1, price: 189.00 }], total: 189.00, status: 'processing', paymentStatus: 'paid', createdAt: '2025-05-08T10:30:00Z', shippingAddress: '258 Walnut Way, Denver, CO 80201', deleted: false },
  { id: 'o9', customer: 'Chris Lee', customerEmail: 'chris@example.com', items: [{ productId: 'p1', productName: 'Pro Wireless Headphones', quantity: 2, price: 199.99 }], total: 399.98, status: 'pending', paymentStatus: 'unpaid', createdAt: '2025-05-09T15:00:00Z', shippingAddress: '369 Aspen Ct, Boston, MA 02101', deleted: false },
  { id: 'o10', customer: 'Rachel Green', customerEmail: 'rachel@example.com', items: [{ productId: 'p3', productName: 'Ultra Slim Laptop 15"', quantity: 1, price: 1299.00 }, { productId: 'p9', productName: 'Mechanical Keyboard', quantity: 1, price: 159.99 }], total: 1458.99, status: 'delivered', paymentStatus: 'paid', createdAt: '2025-04-20T12:00:00Z', shippingAddress: '741 Spruce St, Austin, TX 73301', deleted: false },
]

// ─── Tickets ────────────────────────────────────────────────────
export const seedTickets: Ticket[] = [
  { id: 't1', subject: 'Cannot login to account', description: 'Getting 403 error when trying to login with correct credentials', customer: 'John Smith', customerEmail: 'john@example.com', priority: 'high', status: 'open', assignee: 'Alice Johnson', category: 'Authentication', createdAt: '2025-05-10T08:00:00Z', updatedAt: '2025-05-10T08:00:00Z', deleted: false },
  { id: 't2', subject: 'Order not received', description: 'Order #o1 marked as delivered but never arrived', customer: 'Sarah Williams', customerEmail: 'sarah@example.com', priority: 'medium', status: 'in_progress', assignee: 'Bob Martinez', category: 'Shipping', createdAt: '2025-05-09T14:00:00Z', updatedAt: '2025-05-10T09:00:00Z', deleted: false },
  { id: 't3', subject: 'Refund request', description: 'Requesting refund for damaged product', customer: 'Mike Johnson', customerEmail: 'mike@example.com', priority: 'high', status: 'open', assignee: 'Grace Kim', category: 'Billing', createdAt: '2025-05-08T11:30:00Z', updatedAt: '2025-05-08T11:30:00Z', deleted: false },
  { id: 't4', subject: 'Product page broken', description: 'Product images not loading on mobile devices', customer: 'Emily Davis', customerEmail: 'emily@example.com', priority: 'critical', status: 'in_progress', assignee: 'Alice Johnson', category: 'Bug Report', createdAt: '2025-05-07T09:00:00Z', updatedAt: '2025-05-09T16:00:00Z', deleted: false },
  { id: 't5', subject: 'Feature request: Dark mode', description: 'Would love to have a dark mode option for the dashboard', customer: 'Alex Turner', customerEmail: 'alex@example.com', priority: 'low', status: 'closed', assignee: 'Eva Rodriguez', category: 'Feature Request', createdAt: '2025-04-25T10:00:00Z', updatedAt: '2025-05-05T14:00:00Z', deleted: false },
  { id: 't6', subject: 'Payment failed', description: 'Credit card keeps getting declined, bank says no issue on their end', customer: 'Lisa Wang', customerEmail: 'lisa@example.com', priority: 'high', status: 'open', assignee: 'Bob Martinez', category: 'Billing', createdAt: '2025-05-10T07:30:00Z', updatedAt: '2025-05-10T07:30:00Z', deleted: false },
  { id: 't7', subject: 'Wrong item shipped', description: 'Received headphones instead of keyboard', customer: 'Tom Harris', customerEmail: 'tom@example.com', priority: 'medium', status: 'resolved', assignee: 'Grace Kim', category: 'Shipping', createdAt: '2025-05-03T16:00:00Z', updatedAt: '2025-05-08T10:00:00Z', deleted: false },
  { id: 't8', subject: 'Account security concern', description: 'Noticed suspicious login attempt from unknown IP', customer: 'Nina Patel', customerEmail: 'nina@example.com', priority: 'critical', status: 'in_progress', assignee: 'Alice Johnson', category: 'Security', createdAt: '2025-05-09T22:00:00Z', updatedAt: '2025-05-10T08:30:00Z', deleted: false },
  { id: 't9', subject: 'Bulk order inquiry', description: 'Need pricing for 500+ units of Yoga Mat Pro', customer: 'Chris Lee', customerEmail: 'chris@example.com', priority: 'low', status: 'open', assignee: 'Ivy Nguyen', category: 'Sales', createdAt: '2025-05-06T13:00:00Z', updatedAt: '2025-05-06T13:00:00Z', deleted: false },
  { id: 't10', subject: 'API documentation outdated', description: 'REST API docs show deprecated endpoints', customer: 'Rachel Green', customerEmail: 'rachel@example.com', priority: 'medium', status: 'resolved', assignee: 'Eva Rodriguez', category: 'Documentation', createdAt: '2025-04-30T11:00:00Z', updatedAt: '2025-05-07T15:00:00Z', deleted: false },
]

// ─── Categories ─────────────────────────────────────────────────
export const seedCategories: Category[] = [
  { id: 'c1', name: 'Electronics', slug: 'electronics', description: 'Electronic devices and gadgets', parentId: null, productCount: 5, status: 'active', createdAt: '2023-01-01T00:00:00Z', deleted: false },
  { id: 'c2', name: 'Furniture', slug: 'furniture', description: 'Office and home furniture', parentId: null, productCount: 2, status: 'active', createdAt: '2023-01-01T00:00:00Z', deleted: false },
  { id: 'c3', name: 'Apparel', slug: 'apparel', description: 'Clothing and footwear', parentId: null, productCount: 1, status: 'active', createdAt: '2023-01-01T00:00:00Z', deleted: false },
  { id: 'c4', name: 'Food & Beverage', slug: 'food-beverage', description: 'Food items and drinks', parentId: null, productCount: 1, status: 'active', createdAt: '2023-01-15T00:00:00Z', deleted: false },
  { id: 'c5', name: 'Accessories', slug: 'accessories', description: 'Bags, bottles, and more', parentId: null, productCount: 2, status: 'active', createdAt: '2023-02-01T00:00:00Z', deleted: false },
  { id: 'c6', name: 'Sports', slug: 'sports', description: 'Sports and fitness equipment', parentId: null, productCount: 1, status: 'active', createdAt: '2023-03-01T00:00:00Z', deleted: false },
  { id: 'c7', name: 'Audio', slug: 'audio', description: 'Headphones, speakers, microphones', parentId: 'c1', productCount: 2, status: 'active', createdAt: '2023-04-01T00:00:00Z', deleted: false },
  { id: 'c8', name: 'Computers', slug: 'computers', description: 'Laptops and accessories', parentId: 'c1', productCount: 3, status: 'active', createdAt: '2023-04-01T00:00:00Z', deleted: false },
  { id: 'c9', name: 'Archived Category', slug: 'archived', description: 'No longer used', parentId: null, productCount: 0, status: 'inactive', createdAt: '2023-01-01T00:00:00Z', deleted: false },
]

// ─── Blog Posts ──────────────────────────────────────────────────
export const seedPosts: BlogPost[] = [
  { id: 'bp1', title: 'Top 10 Remote Work Tips', slug: 'top-10-remote-work-tips', content: 'Working from home effectively requires discipline and the right setup...', excerpt: 'Boost your productivity with these proven remote work strategies.', author: 'Alice Johnson', category: 'Productivity', tags: ['remote-work', 'tips', 'productivity'], status: 'published', featuredImage: '/placeholder.svg', publishedAt: '2025-04-15T10:00:00Z', createdAt: '2025-04-10T08:00:00Z', deleted: false },
  { id: 'bp2', title: 'New Product Launch: Ultra Slim Laptop', slug: 'new-product-ultra-slim-laptop', content: 'We are thrilled to announce our latest addition to the electronics lineup...', excerpt: 'Discover the features of our newest laptop model.', author: 'Bob Martinez', category: 'Product News', tags: ['product-launch', 'electronics', 'laptop'], status: 'published', featuredImage: '/placeholder.svg', publishedAt: '2025-03-20T10:00:00Z', createdAt: '2025-03-18T08:00:00Z', deleted: false },
  { id: 'bp3', title: 'How to Build a Great Support Team', slug: 'build-great-support-team', content: 'Customer support is the backbone of any successful business...', excerpt: 'Learn the key principles of building an effective support team.', author: 'Grace Kim', category: 'Business', tags: ['support', 'team', 'business'], status: 'published', featuredImage: '/placeholder.svg', publishedAt: '2025-02-28T10:00:00Z', createdAt: '2025-02-25T08:00:00Z', deleted: false },
  { id: 'bp4', title: 'Summer Sale Preview', slug: 'summer-sale-preview', content: 'Get ready for our biggest sale of the year...', excerpt: 'Sneak peek at upcoming summer deals and discounts.', author: 'Ivy Nguyen', category: 'Promotions', tags: ['sale', 'deals', 'summer'], status: 'draft', featuredImage: '/placeholder.svg', publishedAt: null, createdAt: '2025-05-08T08:00:00Z', deleted: false },
  { id: 'bp5', title: 'Security Best Practices 2025', slug: 'security-best-practices-2025', content: 'Protecting your online accounts has never been more important...', excerpt: 'Essential security measures for personal and business accounts.', author: 'Eva Rodriguez', category: 'Security', tags: ['security', 'best-practices', '2025'], status: 'published', featuredImage: '/placeholder.svg', publishedAt: '2025-01-10T10:00:00Z', createdAt: '2025-01-05T08:00:00Z', deleted: false },
  { id: 'bp6', title: 'Q1 2025 Company Update', slug: 'q1-2025-company-update', content: 'This quarter has been our most productive yet...', excerpt: 'Review of our Q1 achievements and goals.', author: 'Alice Johnson', category: 'Company', tags: ['quarterly-update', 'company', '2025'], status: 'published', featuredImage: '/placeholder.svg', publishedAt: '2025-04-01T10:00:00Z', createdAt: '2025-03-28T08:00:00Z', deleted: false },
  { id: 'bp7', title: 'Sustainability in E-Commerce', slug: 'sustainability-ecommerce', content: 'How we are reducing our carbon footprint...', excerpt: 'Our commitment to sustainable business practices.', author: 'Carol White', category: 'Sustainability', tags: ['sustainability', 'green', 'ecommerce'], status: 'archived', featuredImage: '/placeholder.svg', publishedAt: '2024-12-15T10:00:00Z', createdAt: '2024-12-10T08:00:00Z', deleted: false },
]

// ─── Media Files ─────────────────────────────────────────────────
export const seedMedia: MediaFile[] = [
  { id: 'm1', name: 'hero-banner.jpg', type: 'image', mimeType: 'image/jpeg', size: 2400000, url: '/uploads/hero-banner.jpg', uploadedBy: 'Alice Johnson', createdAt: '2025-04-01T10:00:00Z', deleted: false },
  { id: 'm2', name: 'product-catalog.pdf', type: 'document', mimeType: 'application/pdf', size: 5600000, url: '/uploads/product-catalog.pdf', uploadedBy: 'Bob Martinez', createdAt: '2025-03-15T10:00:00Z', deleted: false },
  { id: 'm3', name: 'promo-video.mp4', type: 'video', mimeType: 'video/mp4', size: 45000000, url: '/uploads/promo-video.mp4', uploadedBy: 'Ivy Nguyen', createdAt: '2025-04-20T10:00:00Z', deleted: false },
  { id: 'm4', name: 'logo-dark.png', type: 'image', mimeType: 'image/png', size: 150000, url: '/uploads/logo-dark.png', uploadedBy: 'Eva Rodriguez', createdAt: '2025-01-05T10:00:00Z', deleted: false },
  { id: 'm5', name: 'quarterly-report.pdf', type: 'document', mimeType: 'application/pdf', size: 3200000, url: '/uploads/quarterly-report.pdf', uploadedBy: 'Grace Kim', createdAt: '2025-04-05T10:00:00Z', deleted: false },
  { id: 'm6', name: 'team-photo.jpg', type: 'image', mimeType: 'image/jpeg', size: 1800000, url: '/uploads/team-photo.jpg', uploadedBy: 'Carol White', createdAt: '2025-02-14T10:00:00Z', deleted: false },
  { id: 'm7', name: 'podcast-ep1.mp3', type: 'audio', mimeType: 'audio/mpeg', size: 28000000, url: '/uploads/podcast-ep1.mp3', uploadedBy: 'Alice Johnson', createdAt: '2025-05-01T10:00:00Z', deleted: false },
  { id: 'm8', name: 'invoice-template.pdf', type: 'document', mimeType: 'application/pdf', size: 420000, url: '/uploads/invoice-template.pdf', uploadedBy: 'Henry Patel', createdAt: '2025-03-20T10:00:00Z', deleted: false },
  { id: 'm9', name: 'banner-sale.png', type: 'image', mimeType: 'image/png', size: 890000, url: '/uploads/banner-sale.png', uploadedBy: 'Ivy Nguyen', createdAt: '2025-05-05T10:00:00Z', deleted: false },
]

// ─── Settings ───────────────────────────────────────────────────
export const seedSettings: Settings = {
  companyName: 'Acme Corp',
  companyEmail: 'contact@acme.com',
  companyPhone: '+1-555-000-0000',
  companyAddress: '100 Innovation Drive, San Francisco, CA 94105',
  logo: '/logo.svg',
  timezone: 'America/Los_Angeles',
  dateFormat: 'MM/DD/YYYY',
  currency: 'USD',
  language: 'en',
  maintenanceMode: false,
  registrationEnabled: true,
  emailNotifications: true,
}

// ─── Audit Logs ─────────────────────────────────────────────────
export const seedAuditLogs: AuditLog[] = [
  { id: 'al1', userId: 'u1', userName: 'Alice Johnson', action: 'create', entity: 'Product', entityId: 'p12', entityName: 'Bluetooth Speaker Mini', details: 'Created new product', timestamp: '2025-05-10T10:00:00Z' },
  { id: 'al2', userId: 'u2', userName: 'Bob Martinez', action: 'update', entity: 'Order', entityId: 'o3', entityName: 'Order #o3', details: 'Changed status to processing', timestamp: '2025-05-10T09:30:00Z' },
  { id: 'al3', userId: 'u1', userName: 'Alice Johnson', action: 'delete', entity: 'User', entityId: 'u-old', entityName: 'Deleted User', details: 'Soft deleted user account', timestamp: '2025-05-09T16:00:00Z' },
  { id: 'al4', userId: 'u5', userName: 'Eva Rodriguez', action: 'update', entity: 'Ticket', entityId: 't5', entityName: 'Feature request: Dark mode', details: 'Resolved and closed ticket', timestamp: '2025-05-05T14:00:00Z' },
  { id: 'al5', userId: 'u7', userName: 'Grace Kim', action: 'create', entity: 'User', entityId: 'u12', entityName: 'Leo Brown', details: 'Created new user account', timestamp: '2025-05-04T11:00:00Z' },
  { id: 'al6', userId: 'u1', userName: 'Alice Johnson', action: 'login', entity: 'Auth', entityId: 'u1', entityName: 'Alice Johnson', details: 'Logged in from 192.168.1.1', timestamp: '2025-05-10T08:00:00Z' },
  { id: 'al7', userId: 'u2', userName: 'Bob Martinez', action: 'export', entity: 'Order', entityId: '', entityName: 'Orders CSV', details: 'Exported 10 orders to CSV', timestamp: '2025-05-09T15:00:00Z' },
  { id: 'al8', userId: 'u9', userName: 'Ivy Nguyen', action: 'create', entity: 'Post', entityId: 'bp4', entityName: 'Summer Sale Preview', details: 'Created draft blog post', timestamp: '2025-05-08T08:00:00Z' },
  { id: 'al9', userId: 'u1', userName: 'Alice Johnson', action: 'update', entity: 'Settings', entityId: 'settings', entityName: 'Company Settings', details: 'Updated company address', timestamp: '2025-05-07T12:00:00Z' },
  { id: 'al10', userId: 'u5', userName: 'Eva Rodriguez', action: 'restore', entity: 'Product', entityId: 'p-restored', entityName: 'Restored Product', details: 'Restored product from trash', timestamp: '2025-05-06T10:00:00Z' },
]

// ─── Feature Flags ──────────────────────────────────────────────
export const seedFeatureFlags: FeatureFlag[] = [
  { id: 'ff1', name: 'New Dashboard', key: 'new_dashboard', description: 'Enable the redesigned dashboard layout', enabled: true, updatedAt: '2025-05-01T10:00:00Z' },
  { id: 'ff2', name: 'AI Chat Support', key: 'ai_chat_support', description: 'Enable AI-powered chat widget for customer support', enabled: false, updatedAt: '2025-04-20T10:00:00Z' },
  { id: 'ff3', name: 'Multi-Currency', key: 'multi_currency', description: 'Allow users to view prices in multiple currencies', enabled: true, updatedAt: '2025-04-15T10:00:00Z' },
  { id: 'ff4', name: 'Advanced Analytics', key: 'advanced_analytics', description: 'Enable advanced analytics and reporting features', enabled: true, updatedAt: '2025-03-10T10:00:00Z' },
  { id: 'ff5', name: 'Bulk Import', key: 'bulk_import', description: 'Allow CSV/Excel bulk import for products and users', enabled: false, updatedAt: '2025-05-05T10:00:00Z' },
  { id: 'ff6', name: 'Two-Factor Auth', key: 'two_factor_auth', description: 'Require two-factor authentication for all admin users', enabled: true, updatedAt: '2025-02-28T10:00:00Z' },
  { id: 'ff7', name: 'Dark Mode', key: 'dark_mode', description: 'Enable dark mode toggle in user preferences', enabled: true, updatedAt: '2025-05-09T10:00:00Z' },
  { id: 'ff8', name: 'Email Templates', key: 'email_templates', description: 'Customizable email templates for notifications', enabled: false, updatedAt: '2025-04-25T10:00:00Z' },
]

// ─── Sessions ───────────────────────────────────────────────────
export const seedSessions: SessionEntry[] = [
  { id: 's1', userId: 'u1', userName: 'Alice Johnson', ip: '192.168.1.101', device: 'Desktop', browser: 'Chrome 124', location: 'San Francisco, CA', startedAt: '2025-05-10T08:00:00Z', lastActivity: '2025-05-10T14:30:00Z', status: 'active' },
  { id: 's2', userId: 'u2', userName: 'Bob Martinez', ip: '10.0.0.55', device: 'Laptop', browser: 'Firefox 126', location: 'New York, NY', startedAt: '2025-05-10T09:15:00Z', lastActivity: '2025-05-10T13:45:00Z', status: 'active' },
  { id: 's3', userId: 'u5', userName: 'Eva Rodriguez', ip: '172.16.0.22', device: 'Desktop', browser: 'Safari 17', location: 'Austin, TX', startedAt: '2025-05-10T07:30:00Z', lastActivity: '2025-05-10T12:00:00Z', status: 'active' },
  { id: 's4', userId: 'u7', userName: 'Grace Kim', ip: '192.168.2.44', device: 'Tablet', browser: 'Chrome 124', location: 'Seattle, WA', startedAt: '2025-05-09T16:00:00Z', lastActivity: '2025-05-09T18:30:00Z', status: 'expired' },
  { id: 's5', userId: 'u3', userName: 'Carol White', ip: '10.0.1.89', device: 'Mobile', browser: 'Safari Mobile', location: 'Chicago, IL', startedAt: '2025-05-10T10:00:00Z', lastActivity: '2025-05-10T11:15:00Z', status: 'active' },
  { id: 's6', userId: 'u9', userName: 'Ivy Nguyen', ip: '172.16.1.33', device: 'Desktop', browser: 'Edge 124', location: 'Denver, CO', startedAt: '2025-05-09T08:00:00Z', lastActivity: '2025-05-09T17:00:00Z', status: 'expired' },
]

// ─── Notifications ──────────────────────────────────────────────
export const seedNotifications: Notification[] = [
  { id: 'n1', title: 'New order received', message: 'Order #o9 from Chris Lee ($399.98)', type: 'info', read: false, timestamp: '2025-05-10T15:00:00Z' },
  { id: 'n2', title: 'Critical ticket opened', message: 'Ticket: Account security concern from Nina Patel', type: 'error', read: false, timestamp: '2025-05-09T22:00:00Z' },
  { id: 'n3', title: 'Product low stock', message: 'Ergonomic Office Chair has only 42 units left', type: 'warning', read: false, timestamp: '2025-05-09T14:00:00Z' },
  { id: 'n4', title: 'Ticket resolved', message: 'Wrong item shipped - resolved by Grace Kim', type: 'success', read: true, timestamp: '2025-05-08T10:00:00Z' },
  { id: 'n5', title: 'New user registered', message: 'Leo Brown joined the platform', type: 'info', read: true, timestamp: '2025-05-04T11:00:00Z' },
]

// ─── Revenue Report Data ────────────────────────────────────────
export const seedRevenueData: RevenueDataPoint[] = [
  { date: '2025-04-01', revenue: 4520, orders: 12 },
  { date: '2025-04-02', revenue: 3180, orders: 8 },
  { date: '2025-04-03', revenue: 5670, orders: 15 },
  { date: '2025-04-04', revenue: 2890, orders: 7 },
  { date: '2025-04-05', revenue: 6230, orders: 18 },
  { date: '2025-04-06', revenue: 1950, orders: 5 },
  { date: '2025-04-07', revenue: 7100, orders: 22 },
  { date: '2025-04-08', revenue: 4810, orders: 13 },
  { date: '2025-04-09', revenue: 5390, orders: 16 },
  { date: '2025-04-10', revenue: 3720, orders: 9 },
  { date: '2025-04-11', revenue: 6890, orders: 20 },
  { date: '2025-04-12', revenue: 4150, orders: 11 },
  { date: '2025-04-13', revenue: 5560, orders: 14 },
  { date: '2025-04-14', revenue: 8200, orders: 25 },
  { date: '2025-04-15', revenue: 3410, orders: 10 },
  { date: '2025-04-16', revenue: 6700, orders: 19 },
  { date: '2025-04-17', revenue: 4980, orders: 13 },
  { date: '2025-04-18', revenue: 7350, orders: 21 },
  { date: '2025-04-19', revenue: 2560, orders: 6 },
  { date: '2025-04-20', revenue: 5840, orders: 17 },
  { date: '2025-04-21', revenue: 3950, orders: 11 },
  { date: '2025-04-22', revenue: 6100, orders: 16 },
  { date: '2025-04-23', revenue: 4430, orders: 12 },
  { date: '2025-04-24', revenue: 7820, orders: 23 },
  { date: '2025-04-25', revenue: 5280, orders: 15 },
  { date: '2025-04-26', revenue: 3640, orders: 9 },
  { date: '2025-04-27', revenue: 6510, orders: 18 },
  { date: '2025-04-28', revenue: 4760, orders: 14 },
  { date: '2025-04-29', revenue: 8500, orders: 26 },
  { date: '2025-04-30', revenue: 5120, orders: 15 },
]

// ─── User Growth Report Data ────────────────────────────────────
export const seedUserGrowthData: UserGrowthDataPoint[] = [
  { date: '2024-07', newUsers: 45, totalUsers: 320 },
  { date: '2024-08', newUsers: 52, totalUsers: 372 },
  { date: '2024-09', newUsers: 38, totalUsers: 410 },
  { date: '2024-10', newUsers: 61, totalUsers: 471 },
  { date: '2024-11', newUsers: 73, totalUsers: 544 },
  { date: '2024-12', newUsers: 48, totalUsers: 592 },
  { date: '2025-01', newUsers: 85, totalUsers: 677 },
  { date: '2025-02', newUsers: 67, totalUsers: 744 },
  { date: '2025-03', newUsers: 92, totalUsers: 836 },
  { date: '2025-04', newUsers: 78, totalUsers: 914 },
  { date: '2025-05', newUsers: 56, totalUsers: 970 },
]

// ─── Product Performance ────────────────────────────────────────
export const seedProductPerformance: ProductPerformanceData[] = [
  { productName: 'Ultra Slim Laptop', unitsSold: 245, revenue: 318255, returns: 8 },
  { productName: 'Pro Wireless Headphones', unitsSold: 520, revenue: 103948, returns: 12 },
  { productName: 'Ergonomic Office Chair', unitsSold: 180, revenue: 80820, returns: 5 },
  { productName: 'Mechanical Keyboard', unitsSold: 310, revenue: 49597, returns: 7 },
  { productName: 'Running Shoes V2', unitsSold: 420, revenue: 54596, returns: 15 },
  { productName: 'Standing Desk Converter', unitsSold: 95, revenue: 28405, returns: 2 },
  { productName: 'Smart Water Bottle', unitsSold: 680, revenue: 23793, returns: 3 },
  { productName: 'Bluetooth Speaker Mini', unitsSold: 390, revenue: 23396, returns: 9 },
]

// ─── Ticket SLA Data ────────────────────────────────────────────
export const seedTicketSLAData: TicketSLAData[] = [
  { date: '2025-04-W1', resolved: 28, breached: 3, avgResponseTime: 4.2 },
  { date: '2025-04-W2', resolved: 35, breached: 2, avgResponseTime: 3.8 },
  { date: '2025-04-W3', resolved: 22, breached: 5, avgResponseTime: 5.1 },
  { date: '2025-04-W4', resolved: 41, breached: 1, avgResponseTime: 3.2 },
  { date: '2025-05-W1', resolved: 30, breached: 4, avgResponseTime: 4.5 },
  { date: '2025-05-W2', resolved: 18, breached: 2, avgResponseTime: 3.9 },
]

// ─── Dashboard KPI Helpers ──────────────────────────────────────
export const dashboardKPIs = {
  totalUsers: seedUsers.length,
  totalProducts: seedProducts.length,
  totalOrders: seedOrders.length,
  totalRevenue: seedOrders.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + o.total, 0),
  openTickets: seedTickets.filter(t => t.status === 'open' || t.status === 'in_progress').length,
}
