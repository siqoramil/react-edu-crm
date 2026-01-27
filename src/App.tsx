import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { Layout } from '@/components/layout/Layout'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { LoginPage } from '@/pages/Login'
import { DashboardPage } from '@/pages/Dashboard'
import { UsersPage } from '@/pages/Users'
import { ProductsPage } from '@/pages/Products'
import { OrdersPage } from '@/pages/Orders'
import { TicketsPage } from '@/pages/Tickets'
import { CategoriesPage } from '@/pages/Categories'
import { PostsPage } from '@/pages/Posts'
import { MediaPage } from '@/pages/Media'
import { SettingsPage } from '@/pages/Settings'
import { RevenueReport } from '@/pages/reports/Revenue'
import { UserGrowthReport } from '@/pages/reports/UserGrowth'
import { ProductsReport } from '@/pages/reports/Products'
import { TicketSLAReport } from '@/pages/reports/TicketSLA'
import { RolesPermissionsPage } from '@/pages/admin/RolesPermissions'
import { SystemLogsPage } from '@/pages/admin/SystemLogs'
import { FeatureFlagsPage } from '@/pages/admin/FeatureFlags'
import { SessionsPage } from '@/pages/admin/Sessions'
import { useStore } from '@/store'

export default function App() {
  const isAuthenticated = useStore((s) => s.isAuthenticated)

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="users" element={<ProtectedRoute permission="users.view"><UsersPage /></ProtectedRoute>} />
          <Route path="products" element={<ProtectedRoute permission="products.view"><ProductsPage /></ProtectedRoute>} />
          <Route path="orders" element={<ProtectedRoute permission="orders.view"><OrdersPage /></ProtectedRoute>} />
          <Route path="tickets" element={<ProtectedRoute permission="tickets.view"><TicketsPage /></ProtectedRoute>} />
          <Route path="categories" element={<ProtectedRoute permission="categories.view"><CategoriesPage /></ProtectedRoute>} />
          <Route path="posts" element={<ProtectedRoute permission="posts.view"><PostsPage /></ProtectedRoute>} />
          <Route path="media" element={<ProtectedRoute permission="media.view"><MediaPage /></ProtectedRoute>} />
          <Route path="settings" element={<ProtectedRoute permission="settings.view"><SettingsPage /></ProtectedRoute>} />
          <Route path="reports/revenue" element={<ProtectedRoute permission="reports.view"><RevenueReport /></ProtectedRoute>} />
          <Route path="reports/user-growth" element={<ProtectedRoute permission="reports.view"><UserGrowthReport /></ProtectedRoute>} />
          <Route path="reports/products" element={<ProtectedRoute permission="reports.view"><ProductsReport /></ProtectedRoute>} />
          <Route path="reports/ticket-sla" element={<ProtectedRoute permission="reports.view"><TicketSLAReport /></ProtectedRoute>} />
          <Route path="admin/roles" element={<ProtectedRoute permission="admin.roles"><RolesPermissionsPage /></ProtectedRoute>} />
          <Route path="admin/logs" element={<ProtectedRoute permission="admin.logs"><SystemLogsPage /></ProtectedRoute>} />
          <Route path="admin/features" element={<ProtectedRoute permission="admin.features"><FeatureFlagsPage /></ProtectedRoute>} />
          <Route path="admin/sessions" element={<ProtectedRoute permission="admin.sessions"><SessionsPage /></ProtectedRoute>} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster richColors position="top-right" />
    </BrowserRouter>
  )
}
