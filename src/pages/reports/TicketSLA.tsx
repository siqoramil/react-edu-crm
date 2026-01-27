import { useStore } from '@/store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'

export function TicketSLAReport() {
  const data = useStore((s) => s.ticketSLAData)
  const totalResolved = data.reduce((s, d) => s + d.resolved, 0)
  const totalBreached = data.reduce((s, d) => s + d.breached, 0)
  const avgResponse = data.reduce((s, d) => s + d.avgResponseTime, 0) / data.length

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold tracking-tight">Ticket SLA Performance</h1><p className="text-muted-foreground">Support team performance metrics</p></div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Total Resolved</p><p className="text-2xl font-bold mt-1">{totalResolved}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">SLA Breached</p><p className="text-2xl font-bold mt-1 text-destructive">{totalBreached}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Avg. Response (hrs)</p><p className="text-2xl font-bold mt-1">{avgResponse.toFixed(1)}h</p></CardContent></Card>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Resolved vs Breached</CardTitle><CardDescription>Weekly SLA compliance</CardDescription></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))' }} />
                <Legend />
                <Bar dataKey="resolved" fill="hsl(var(--chart-2))" name="Resolved" radius={[3, 3, 0, 0]} />
                <Bar dataKey="breached" fill="hsl(var(--destructive))" name="Breached" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Response Time Trend</CardTitle><CardDescription>Average response time in hours</CardDescription></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))' }} />
                <Line type="monotone" dataKey="avgResponseTime" stroke="hsl(var(--chart-4))" strokeWidth={2} name="Avg Response (hrs)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Weekly Breakdown</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Period</TableHead><TableHead className="text-right">Resolved</TableHead><TableHead className="text-right">Breached</TableHead><TableHead className="text-right">Compliance</TableHead><TableHead className="text-right">Avg Response</TableHead></TableRow></TableHeader>
            <TableBody>
              {data.map((d) => (
                <TableRow key={d.date}>
                  <TableCell className="font-medium">{d.date}</TableCell>
                  <TableCell className="text-right">{d.resolved}</TableCell>
                  <TableCell className="text-right">{d.breached}</TableCell>
                  <TableCell className="text-right">{((d.resolved / (d.resolved + d.breached)) * 100).toFixed(0)}%</TableCell>
                  <TableCell className="text-right">{d.avgResponseTime}h</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
