import { useStore } from '@/store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'

export function UserGrowthReport() {
  const data = useStore((s) => s.userGrowthData)
  const latest = data[data.length - 1]

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold tracking-tight">User Growth Report</h1><p className="text-muted-foreground">Monthly user acquisition and total users</p></div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Total Users</p><p className="text-2xl font-bold mt-1">{latest?.totalUsers ?? 0}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">New This Month</p><p className="text-2xl font-bold mt-1">{latest?.newUsers ?? 0}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Avg. Monthly Growth</p><p className="text-2xl font-bold mt-1">{(data.reduce((s, d) => s + d.newUsers, 0) / data.length).toFixed(0)}</p></CardContent></Card>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Total Users Over Time</CardTitle><CardDescription>Cumulative user count</CardDescription></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))' }} />
                <Line type="monotone" dataKey="totalUsers" stroke="hsl(var(--chart-1))" strokeWidth={2} name="Total Users" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>New Users Per Month</CardTitle><CardDescription>Monthly signups</CardDescription></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))' }} />
                <Legend />
                <Bar dataKey="newUsers" fill="hsl(var(--chart-2))" radius={[3, 3, 0, 0]} name="New Users" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
