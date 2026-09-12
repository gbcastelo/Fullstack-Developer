import { Head, Link } from '@inertiajs/react'
import { Pencil, Mail, ShieldCheck } from 'lucide-react'
import { AppShell } from '../../components/app-shell'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Avatar } from '../../components/ui/avatar'
import { Badge } from '../../components/ui/badge'
import { buttonVariants } from '../../components/ui/button'

export default function Show({ user }) {
  return (
    <AppShell title="My profile">
      <Head title="My profile" />
      <Card className="max-w-lg">
        <CardHeader className="flex-row items-center gap-4 space-y-0">
          <Avatar name={user.full_name} src={user.avatar_url} size="lg" />
          <div>
            <CardTitle>{user.full_name}</CardTitle>
            <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="mt-1">
              <ShieldCheck className="h-3 w-3" />
              {user.role}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            {user.email_address}
          </p>
          <Link href="/profile/edit" className={buttonVariants('outline', 'default', 'w-full')}>
            <Pencil className="h-4 w-4" />
            Edit profile
          </Link>
        </CardContent>
      </Card>
    </AppShell>
  )
}
