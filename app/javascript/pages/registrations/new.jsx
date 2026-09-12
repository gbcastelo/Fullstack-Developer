import { Head, useForm } from '@inertiajs/react'
import { ShieldCheck } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Card, CardContent } from '../../components/ui/card'
import { useTranslation } from '../../lib/i18n'

export default function New() {
  const { t } = useTranslation()
  const { data, setData, post, transform, processing, errors } = useForm({
    full_name: '',
    email_address: '',
    password: '',
  })

  function submit(e) {
    e.preventDefault()
    transform(data => ({ user: data }))
    post('/register')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Head title={t('registrations.title')} />
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <ShieldCheck className="h-9 w-9 text-primary" />
          <h1 className="text-xl font-semibold tracking-tight">{t('registrations.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('registrations.subtitle')}</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="full_name">{t('registrations.fullName')}</Label>
                <Input
                  id="full_name"
                  required
                  value={data.full_name}
                  onChange={e => setData('full_name', e.target.value)}
                  placeholder={t('registrations.fullName')}
                />
                {errors.full_name && <p className="text-sm text-destructive">{errors.full_name}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email_address">{t('registrations.email')}</Label>
                <Input
                  id="email_address"
                  type="email"
                  required
                  value={data.email_address}
                  onChange={e => setData('email_address', e.target.value)}
                  placeholder={t('registrations.email')}
                />
                {errors.email_address && <p className="text-sm text-destructive">{errors.email_address}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">{t('registrations.password')}</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={data.password}
                  onChange={e => setData('password', e.target.value)}
                  placeholder={t('registrations.password')}
                />
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
              </div>
              <Button disabled={processing} type="submit" className="w-full">
                {t('registrations.submit')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
