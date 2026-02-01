import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useStore } from '@/store'
import { can } from '@/lib/permissions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Upload, Building2, X } from 'lucide-react'
import { toast } from 'sonner'

const languages = [
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
]

export function SettingsPage() {
  const { t, i18n } = useTranslation()
  const user = useStore((s) => s.user)
  const settings = useStore((s) => s.settings)
  const updateSettings = useStore((s) => s.updateSettings)
  const [form, setForm] = useState({ ...settings })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const canEdit = user ? can(user.role, 'settings.edit') : false

  const handleSave = () => {
    updateSettings(form)
    // Also update i18n language if changed
    if (form.language !== i18n.language) {
      i18n.changeLanguage(form.language)
    }
    toast.success(t('settings.saved'))
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error(t('settings.fileTooLarge'))
        return
      }
      if (!file.type.startsWith('image/')) {
        toast.error(t('settings.selectImage'))
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setForm({ ...form, logo: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveLogo = () => {
    setForm({ ...form, logo: '' })
  }

  const handleLanguageChange = (lang: string) => {
    setForm({ ...form, language: lang })
    // Immediately change the UI language
    i18n.changeLanguage(lang)
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t('settings.title')}</h1>
        <p className="text-muted-foreground">{t('settings.subtitle')}</p>
      </div>

      {/* Company Logo */}
      <Card>
        <CardHeader>
          <CardTitle>{t('settings.logo')}</CardTitle>
          <CardDescription>{t('settings.logoDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24 rounded-lg">
              <AvatarImage src={form.logo} alt="Company logo" className="object-cover" />
              <AvatarFallback className="rounded-lg bg-muted">
                <Building2 className="h-10 w-10 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleLogoUpload}
                accept="image/*"
                className="hidden"
                disabled={!canEdit}
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={!canEdit}
                >
                  <Upload size={14} className="mr-2" />
                  {t('settings.uploadLogo')}
                </Button>
                {form.logo && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveLogo}
                    disabled={!canEdit}
                  >
                    <X size={14} className="mr-2" />
                    {t('settings.removeLogo')}
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {t('settings.logoHint')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle>{t('settings.companyInfo')}</CardTitle>
          <CardDescription>{t('settings.companyInfoDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('settings.companyName')}</Label>
              <Input
                disabled={!canEdit}
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('common.email')}</Label>
              <Input
                disabled={!canEdit}
                value={form.companyEmail}
                onChange={(e) => setForm({ ...form, companyEmail: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('common.phone')}</Label>
              <Input
                disabled={!canEdit}
                value={form.companyPhone}
                onChange={(e) => setForm({ ...form, companyPhone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('settings.address')}</Label>
              <Input
                disabled={!canEdit}
                value={form.companyAddress}
                onChange={(e) => setForm({ ...form, companyAddress: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>{t('settings.preferences')}</CardTitle>
          <CardDescription>{t('settings.preferencesDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('settings.language')}</Label>
              <Select
                disabled={!canEdit}
                value={form.language}
                onValueChange={handleLanguageChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t('settings.timezone')}</Label>
              <Select
                disabled={!canEdit}
                value={form.timezone}
                onValueChange={(v) => setForm({ ...form, timezone: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[
                    'America/New_York',
                    'America/Chicago',
                    'America/Denver',
                    'America/Los_Angeles',
                    'Europe/London',
                    'Europe/Berlin',
                    'Europe/Moscow',
                    'Asia/Tokyo',
                    'Asia/Tashkent',
                  ].map((tz) => (
                    <SelectItem key={tz} value={tz}>
                      {tz}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('settings.currency')}</Label>
              <Select
                disabled={!canEdit}
                value={form.currency}
                onValueChange={(v) => setForm({ ...form, currency: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['USD', 'EUR', 'GBP', 'JPY', 'RUB', 'UZS'].map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t('settings.dateFormat')}</Label>
              <Select
                disabled={!canEdit}
                value={form.dateFormat}
                onValueChange={(v) => setForm({ ...form, dateFormat: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD', 'DD.MM.YYYY'].map((f) => (
                    <SelectItem key={f} value={f}>
                      {f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Toggles */}
      <Card>
        <CardHeader>
          <CardTitle>{t('settings.systemToggles')}</CardTitle>
          <CardDescription>{t('settings.systemTogglesDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>{t('settings.maintenanceMode')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('settings.maintenanceModeDesc')}
              </p>
            </div>
            <Switch
              disabled={!canEdit}
              checked={form.maintenanceMode}
              onCheckedChange={(v) => setForm({ ...form, maintenanceMode: v })}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>{t('settings.userRegistration')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('settings.userRegistrationDesc')}
              </p>
            </div>
            <Switch
              disabled={!canEdit}
              checked={form.registrationEnabled}
              onCheckedChange={(v) => setForm({ ...form, registrationEnabled: v })}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>{t('settings.emailNotifications')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('settings.emailNotificationsDesc')}
              </p>
            </div>
            <Switch
              disabled={!canEdit}
              checked={form.emailNotifications}
              onCheckedChange={(v) => setForm({ ...form, emailNotifications: v })}
            />
          </div>
        </CardContent>
      </Card>

      {canEdit && (
        <div className="flex justify-end">
          <Button onClick={handleSave}>{t('settings.saveSettings')}</Button>
        </div>
      )}
    </div>
  )
}
