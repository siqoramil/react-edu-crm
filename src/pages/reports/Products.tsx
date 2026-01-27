import { useStore } from '@/store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export function ProductsReport() {
  const data = useStore((s) => s.productPerformance)
  const totalUnits = data.reduce((s, d) => s + d.unitsSold, 0)
  const totalRev = data.reduce((s, d) => s + d.revenue, 0)
  const totalReturns = data.reduce((s, d) => s + d.returns, 0)

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold tracking-tight">Product Performance</h1><p className="text-muted-foreground">Sales and return metrics by product</p></div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Total Units Sold</p><p className="text-2xl font-bold mt-1">{totalUnits.toLocaleString()}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Total Revenue</p><p className="text-2xl font-bold mt-1">${totalRev.toLocaleString()}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Return Rate</p><p className="text-2xl font-bold mt-1">{((totalReturns / totalUnits) * 100).toFixed(1)}%</p></CardContent></Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Revenue by Product</CardTitle><CardDescription>Top performing products by revenue</CardDescription></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={[...data].sort((a, b) => b.revenue - a.revenue)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis type="number" fontSize={11} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
              <YAxis dataKey="productName" type="category" fontSize={11} width={140} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))' }} formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']} />
              <Bar dataKey="revenue" fill="hsl(var(--chart-3))" radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Detailed Breakdown</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Product</TableHead><TableHead className="text-right">Units Sold</TableHead><TableHead className="text-right">Revenue</TableHead><TableHead className="text-right">Returns</TableHead><TableHead className="text-right">Return Rate</TableHead></TableRow></TableHeader>
            <TableBody>
              {data.map((d) => (
                <TableRow key={d.productName}>
                  <TableCell className="font-medium">{d.productName}</TableCell>
                  <TableCell className="text-right">{d.unitsSold}</TableCell>
                  <TableCell className="text-right">${d.revenue.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{d.returns}</TableCell>
                  <TableCell className="text-right">{((d.returns / d.unitsSold) * 100).toFixed(1)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
