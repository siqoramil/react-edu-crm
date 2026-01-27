import { useNavigate } from 'react-router-dom'
import { useStore } from '@/store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Users, Package, ShoppingCart, DollarSign, LifeBuoy,
  Plus, ArrowUpRight, ArrowDownRight,
  Clock,
} from 'lucide-react'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { format } from 'date-fns'

export function DashboardPage() {
  const navigate = useNavigate()
  const users = useStore((s) => s.users)
  const products = useStore((s) => s.products)
  const orders = useStore((s) => s.orders)
  const tickets = useStore((s) => s.tickets)
  const auditLogs = useStore((s) => s.auditLogs)
  const revenueData = useStore((s) => s.revenueData)

  const activeUsers = users.filter((u) => !u.deleted && u.status === 'active').length
  const activeProducts = products.filter((p) => !p.deleted && p.status === 'active').length
  const totalRevenue = orders
    .filter((o) => !o.deleted && o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.total, 0)
  const openTickets = tickets.filter(
    (t) => !t.deleted && (t.status === 'open' || t.status === 'in_progress'),
  ).length
  const recentOrders = orders.filter((o) => !o.deleted).slice(0, 5)
  const openTicketsList = tickets
    .filter((t) => !t.deleted && t.status !== 'closed' && t.status !== 'resolved')
    .slice(0, 5)

  const kpis = [
    { label: 'Active Users', value: activeUsers, icon: <Users size={20} />, change: '+12%', up: true, color: 'text-blue-600' },
    { label: 'Products', value: activeProducts, icon: <Package size={20} />, change: '+3%', up: true, color: 'text-emerald-600' },
    { label: 'Total Orders', value: orders.filter((o) => !o.deleted).length, icon: <ShoppingCart size={20} />, change: '+8%', up: true, color: 'text-violet-600' },
    { label: 'Revenue', value: `$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, icon: <DollarSign size={20} />, change: '+15%', up: true, color: 'text-amber-600' },
    { label: 'Open Tickets', value: openTickets, icon: <LifeBuoy size={20} />, change: '-5%', up: false, color: 'text-rose-600' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your business metrics</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => navigate('/users')}>
            <Plus size={14} className="mr-1" /> Add User
          </Button>
          <Button size="sm" variant="outline" onClick={() => navigate('/products')}>
            <Plus size={14} className="mr-1" /> Add Product
          </Button>
          <Button size="sm" variant="outline" onClick={() => navigate('/orders')}>
            <Plus size={14} className="mr-1" /> Add Order
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className={kpi.color}>{kpi.icon}</span>
                <span className={`flex items-center text-xs font-medium ${kpi.up ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {kpi.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {kpi.change}
                </span>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold">{kpi.value}</p>
                <p className="text-xs text-muted-foreground">{kpi.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Revenue Overview</CardTitle>
            <CardDescription>Daily revenue for the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={revenueData.slice(-14)}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
                  fontSize={12}
                  tickFormatter={(v: string) => format(new Date(v), 'MMM d')}
                  className="fill-muted-foreground"
                />
                <YAxis fontSize={12} className="fill-muted-foreground" />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', background: 'hsl(var(--popover))' }}
                  labelFormatter={(v) => format(new Date(String(v)), 'MMM d, yyyy')}
                  formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Orders Trend</CardTitle>
            <CardDescription>Daily orders count</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={revenueData.slice(-14)}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
                  fontSize={12}
                  tickFormatter={(v: string) => format(new Date(v), 'MMM d')}
                  className="fill-muted-foreground"
                />
                <YAxis fontSize={12} className="fill-muted-foreground" />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', background: 'hsl(var(--popover))' }}
                  labelFormatter={(v) => format(new Date(String(v)), 'MMM d, yyyy')}
                />
                <Line type="monotone" dataKey="orders" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-72">
              <div className="space-y-0 px-6">
                {auditLogs.slice(0, 8).map((log) => (
                  <div key={log.id} className="flex items-start gap-3 py-3 border-b last:border-0">
                    <div className="mt-0.5">
                      <Clock size={14} className="text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-medium">{log.userName}</span>{' '}
                        <span className="text-muted-foreground">{log.details}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {format(new Date(log.timestamp), 'MMM d, h:mm a')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Latest Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Latest Orders</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/orders')}>
              View All
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-72">
              <div className="px-6 space-y-0">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div>
                      <p className="text-sm font-medium">{order.customer}</p>
                      <p className="text-xs text-muted-foreground">#{order.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">${order.total.toFixed(2)}</p>
                      <Badge
                        variant={
                          order.status === 'delivered' ? 'default' :
                          order.status === 'cancelled' ? 'destructive' :
                          'secondary'
                        }
                        className="text-[10px]"
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Open Tickets */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Open Tickets</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/tickets')}>
              View All
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-72">
              <div className="px-6 space-y-0">
                {openTicketsList.map((ticket) => (
                  <div key={ticket.id} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div className="min-w-0 flex-1 mr-3">
                      <p className="text-sm font-medium truncate">{ticket.subject}</p>
                      <p className="text-xs text-muted-foreground">{ticket.customer}</p>
                    </div>
                    <Badge
                      variant={
                        ticket.priority === 'critical' ? 'destructive' :
                        ticket.priority === 'high' ? 'destructive' :
                        'outline'
                      }
                      className="text-[10px] shrink-0"
                    >
                      {ticket.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
