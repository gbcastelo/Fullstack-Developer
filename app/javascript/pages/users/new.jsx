import { Head, useForm } from '@inertiajs/react'
import { AppShell } from '../../components/app-shell'
import { Card, CardContent } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { useTranslation } from '../../lib/i18n'

export default function New({ errors }) {
  const { t } = useTranslation()
  const { data, setData, post, transform, processing } = useForm({
    full_name: '', email_address: '', password: '', role: 'user',
  })

  function submit(e) {
    e.preventDefault()
    transform(data => ({ user: data }))
    post('/users')
  }

  return (
    <AppShell title={t('users.newUser')}>
      <Head title={t('users.newUser')} />
      <Card className="max-w-lg">
        <CardContent className="pt-6">
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="full_name">{t('users.fullName')}</Label>
              <Input id="full_name" required value={data.full_name} onChange={e => setData('full_name', e.target.value)}
                placeholder={t('users.fullName')} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email_address">{t('users.email')}</Label>
              <Input id="email_address" required type="email" value={data.email_address} onChange={e => setData('email_address', e.target.value)}
                placeholder={t('users.email')} />
              {errors?.email_address && <p className="text-sm text-destructive">{errors.email_address}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">{t('users.password')}</Label>
              <Input id="password" required type="password" value={data.password} onChange={e => setData('password', e.target.value)}
                placeholder={t('users.password')} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="role">{t('users.role')}</Label>
              <select
                id="role"
                value={data.role}
                onChange={e => setData('role', e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="user">{t('role.user')}</option>
                <option value="admin">{t('role.admin')}</option>
              </select>
            </div>
            <Button disabled={processing} type="submit" className="w-full">{t('users.create')}</Button>
          </form>
        </CardContent>
      </Card>
    </AppShell>
  )
}
