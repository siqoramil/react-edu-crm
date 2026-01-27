import { useStore } from '@/store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { format } from 'date-fns'
import { toast } from 'sonner'

export function FeatureFlagsPage() {
  const featureFlags = useStore((s) => s.featureFlags)
  const toggleFeatureFlag = useStore((s) => s.toggleFeatureFlag)

  const handleToggle = (id: string, name: string) => {
    toggleFeatureFlag(id)
    const flag = featureFlags.find((f) => f.id === id)
    const newState = flag ? !flag.enabled : false
    toast.success(`${name} ${newState ? 'enabled' : 'disabled'}`)
  }

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold tracking-tight">Feature Flags</h1><p className="text-muted-foreground">Enable or disable features across the platform</p></div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Total Flags</p>
            <p className="text-2xl font-bold mt-1">{featureFlags.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Active Flags</p>
            <p className="text-2xl font-bold mt-1">{featureFlags.filter((f) => f.enabled).length}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Feature Flags</CardTitle>
          <CardDescription>Toggle features on or off. Changes take effect immediately.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-0">
          {featureFlags.map((flag, idx) => (
            <div key={flag.id}>
              {idx > 0 && <Separator />}
              <div className="flex items-center justify-between py-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{flag.name}</p>
                    <Badge variant={flag.enabled ? 'default' : 'secondary'} className="text-[10px]">
                      {flag.enabled ? 'ON' : 'OFF'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{flag.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Key: <code className="bg-muted px-1 rounded">{flag.key}</code> | Updated: {format(new Date(flag.updatedAt), 'MMM d, yyyy')}
                  </p>
                </div>
                <Switch
                  checked={flag.enabled}
                  onCheckedChange={() => handleToggle(flag.id, flag.name)}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
