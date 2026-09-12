import { Head, usePage } from '@inertiajs/react'
import { Users2, ShieldCheck, UserRound, Radio } from 'lucide-react'
import useDashboardChannel from '../../hooks/useDashboardChannel'
import { AppShell } from '../../components/app-shell'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'

function greeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export default function Show({ total_users, users_by_role }) {
  const { total_users: total, users_by_role: byRole } = useDashboardChannel({ total_users, users_by_role })
  const { current_user } = usePage().props
  const firstName = current_user?.full_name?.split(' ')[0]

  const roleCards = [
    {
      role: 'admin',
      label: 'Administrators',
      description: 'Can manage users, imports, and settings',
      icon: ShieldCheck,
    },
    {
      role: 'user',
      label: 'Standard users',
      description: 'Can view and edit their own profile',
      icon: UserRound,
    },
  ]

  return (
    <AppShell title="Dashboard">
      <Head title="Dashboard" />

      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">
          {greeting()}{firstName ? `, ${firstName}` : ''} 👋
        </h2>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          Here's what's happening with your team today.
          <span className="ml-1 inline-flex items-center gap-1 text-xs font-medium text-success">
            <Radio className="h-3 w-3 animate-pulse" />
            Live
          </span>
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total users</CardTitle>
            <Users2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tracking-tight" data-testid="total-users">{total}</p>
            <CardDescription className="mt-1">
              {total === 1 ? 'Person on the platform' : 'People on the platform right now'}
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
