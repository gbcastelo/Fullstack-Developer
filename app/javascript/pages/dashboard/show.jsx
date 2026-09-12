import { Head, usePage } from '@inertiajs/react'
import { Users2, ShieldCheck, UserRound, Radio } from 'lucide-react'
import useDashboardChannel from '../../hooks/useDashboardChannel'
import { AppShell } from '../../components/app-shell'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { useTranslation } from '../../lib/i18n'

function greetingKey() {
  const hour = new Date().getHours()
  if (hour < 12) return 'dashboard.greetingMorning'
  if (hour < 18) return 'dashboard.greetingAfternoon'
  return 'dashboard.greetingEvening'
}

export default function Show({ total_users, users_by_role }) {
  const { total_users: total, users_by_role: byRole } = useDashboardChannel({ total_users, users_by_role })
  const { current_user } = usePage().props
  const { t } = useTranslation()
  const firstName = current_user?.full_name?.split(' ')[0]

  const roleCards = [
    {
      role: 'admin',
      label: t('dashboard.administrators'),
      description: t('dashboard.administratorsDescription'),
      icon: ShieldCheck,
    },
    {
      role: 'user',
      label: t('dashboard.standardUsers'),
      description: t('dashboard.standardUsersDescription'),
      icon: UserRound,
    },
  ]

  return (
    <AppShell title={t('nav.dashboard')}>
      <Head title={t('nav.dashboard')} />

      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">
          {t(greetingKey())}{firstName ? `, ${firstName}` : ''} 👋
        </h2>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          {t('dashboard.subtitle')}
          <span className="ml-1 inline-flex items-center gap-1 text-xs font-medium text-success">
            <Radio className="h-3 w-3 animate-pulse" />
            {t('dashboard.live')}
          </span>
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t('dashboard.totalUsers')}</CardTitle>
            <Users2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tracking-tight" data-testid="total-users">{total}</p>
            <CardDescription className="mt-1">
              {total === 1 ? t('dashboard.onePerson') : t('dashboard.manyPeople')}
            </CardDescription>
          </CardContent>
        </Card>

        {roleCards.map(({ role, label, description, icon: Icon }) => {
          const count = byRole[role] ?? 0
          return (
            <Card key={role}>
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold tracking-tight" data-testid={`role-count-${role}`}>
                  {count}
                  <span className="sr-only">{` (${role}: ${count})`}</span>
                </p>
                <CardDescription className="mt-1">{description}</CardDescription>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </AppShell>
  )
}
