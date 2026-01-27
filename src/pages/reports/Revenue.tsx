import { useStore } from '@/store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { format } from 'date-fns'

export function RevenueReport() {
  const data = useStore((s) => s.revenueData)
  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0)
  const totalOrders = data.reduce((sum, d) => sum + d.orders, 0)
  const avgDaily = totalRevenue / data.length

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold tracking-tight">Revenue Report</h1><p className="text-muted-foreground">Daily revenue analytics for April 2025</p></div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Total Revenue</p><p className="text-2xl font-bold mt-1">${totalRevenue.toLocaleString()}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Total Orders</p><p className="text-2xl font-bold mt-1">{totalOrders}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Avg. Daily Revenue</p><p className="text-2xl font-bold mt-1">${avgDaily.toFixed(0)}</p></CardContent></Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Daily Revenue</CardTitle><CardDescription>Revenue by day</CardDescription></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" fontSize={11} tickFormatter={(v: string) => format(new Date(v), 'MMM d')} />
              <YAxis fontSize={11} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))' }} formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']} />
              <Bar dataKey="revenue" fill="hsl(var(--chart-1))" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
