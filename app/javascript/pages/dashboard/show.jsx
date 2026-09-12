import { Head } from '@inertiajs/react'
import { Users2, ShieldCheck, UserRound } from 'lucide-react'
import useDashboardChannel from '../../hooks/useDashboardChannel'
import { AppShell } from '../../components/app-shell'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'

export default function Show({ total_users, users_by_role }) {
  const { total_users: total, users_by_role: byRole } = useDashboardChannel({ total_users, users_by_role })

  const roleCards = [
    { role: 'admin', label: 'Admins', icon: ShieldCheck },
    { role: 'user', label: 'Users', icon: UserRound },
  ]

  return (
    <AppShell title="Dashboard">
      <Head title="Dashboard" />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total users</CardTitle>
            <Users2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tracking-tight" data-testid="total-users">{total}</p>
            <p className="text-xs text-muted-foreground">Updates live</p>
          </CardContent>
        </Card>

        {roleCards.map(({ role, label, icon: Icon }) => (
          <Card key={role}>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold tracking-tight" data-testid={`role-count-${role}`}>
                {role}: {byRole[role] ?? 0}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  )
}
