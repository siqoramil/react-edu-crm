import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useStore } from '@/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher'
import { Zap } from 'lucide-react'

export function LoginPage() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('admin@acme.com')
  const [password, setPassword] = useState('password')
  const [error, setError] = useState('')
  const login = useStore((s) => s.login)
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const success = login(email, password)
    if (success) {
      navigate('/')
    } else {
      setError(t('auth.invalidCredentials'))
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Zap size={28} className="text-primary" />
            <span className="text-2xl font-bold">{t('auth.adminPanel')}</span>
          </div>
          <CardTitle className="text-xl">{t('auth.signIn')}</CardTitle>
          <CardDescription>
            {t('auth.enterCredentials')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@acme.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.password')}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Any password works"
              />
            </div>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <Button type="submit" className="w-full">
              {t('auth.signIn')}
            </Button>
            <div className="mt-4 rounded-md bg-muted p-3 text-xs text-muted-foreground space-y-1">
              <p className="font-medium text-foreground">{t('auth.demoAccounts')}:</p>
              <p><strong>{t('auth.admin')}:</strong> admin@acme.com</p>
              <p><strong>{t('auth.manager')}:</strong> manager@acme.com</p>
              <p><strong>{t('auth.viewer')}:</strong> viewer@acme.com</p>
              <p className="italic">{t('auth.anyPassword')}</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
