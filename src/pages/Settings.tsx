import { useState } from 'react'
import { useStore } from '@/store'
import { can } from '@/lib/permissions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

export function SettingsPage() {
  const user = useStore((s) => s.user)
  const settings = useStore((s) => s.settings)
  const updateSettings = useStore((s) => s.updateSettings)
  const [form, setForm] = useState({ ...settings })

  const canEdit = user ? can(user.role, 'settings.edit') : false

  const handleSave = () => {
    updateSettings(form)
    toast.success('Settings saved successfully')
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage company preferences and configuration</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>Basic company details used across the system</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Company Name</Label><Input disabled={!canEdit} value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} /></div>
            <div className="space-y-2"><Label>Email</Label><Input disabled={!canEdit} value={form.companyEmail} onChange={(e) => setForm({ ...form, companyEmail: e.target.value })} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Phone</Label><Input disabled={!canEdit} value={form.companyPhone} onChange={(e) => setForm({ ...form, companyPhone: e.target.value })} /></div>
            <div className="space-y-2"><Label>Address</Label><Input disabled={!canEdit} value={form.companyAddress} onChange={(e) => setForm({ ...form, companyAddress: e.target.value })} /></div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Localization and display settings</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2"><Label>Timezone</Label>
              <Select disabled={!canEdit} value={form.timezone} onValueChange={(v) => setForm({ ...form, timezone: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['America/New_York','America/Chicago','America/Denver','America/Los_Angeles','Europe/London','Europe/Berlin','Asia/Tokyo'].map((tz) => <SelectItem key={tz} value={tz}>{tz}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Currency</Label>
              <Select disabled={!canEdit} value={form.currency} onValueChange={(v) => setForm({ ...form, currency: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{['USD','EUR','GBP','JPY'].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Date Format</Label>
              <Select disabled={!canEdit} value={form.dateFormat} onValueChange={(v) => setForm({ ...form, dateFormat: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{['MM/DD/YYYY','DD/MM/YYYY','YYYY-MM-DD'].map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Toggles</CardTitle>
          <CardDescription>Enable or disable system features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div><Label>Maintenance Mode</Label><p className="text-sm text-muted-foreground">Take the site offline for maintenance</p></div>
            <Switch disabled={!canEdit} checked={form.maintenanceMode} onCheckedChange={(v) => setForm({ ...form, maintenanceMode: v })} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div><Label>User Registration</Label><p className="text-sm text-muted-foreground">Allow new users to register</p></div>
            <Switch disabled={!canEdit} checked={form.registrationEnabled} onCheckedChange={(v) => setForm({ ...form, registrationEnabled: v })} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div><Label>Email Notifications</Label><p className="text-sm text-muted-foreground">Send email notifications for important events</p></div>
            <Switch disabled={!canEdit} checked={form.emailNotifications} onCheckedChange={(v) => setForm({ ...form, emailNotifications: v })} />
          </div>
        </CardContent>
      </Card>

      {canEdit && (
        <div className="flex justify-end">
          <Button onClick={handleSave}>Save Settings</Button>
        </div>
      )}
    </div>
  )
}
