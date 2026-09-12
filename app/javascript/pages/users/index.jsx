import { Head, Link, router } from '@inertiajs/react'
import { Plus, Pencil, Repeat, Trash2 } from 'lucide-react'
import { AppShell } from '../../components/app-shell'
import { Button, buttonVariants } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Avatar } from '../../components/ui/avatar'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/table'
import { useTranslation } from '../../lib/i18n'

export default function Index({ users }) {
  const { t } = useTranslation()

  function destroy(user) {
    if (confirm(t('users.confirmDelete')(user.full_name))) {
      router.delete(`/users/${user.id}`)
    }
  }

  return (
    <AppShell title={t('nav.users')}>
      <Head title={t('nav.users')} />

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {users.length} {users.length === 1 ? t('users.oneUser') : t('users.manyUsers')}
        </p>
        <Link href="/users/new" className={buttonVariants('default', 'default')}>
          <Plus className="h-4 w-4" />
          {t('users.newUser')}
        </Link>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('users.name')}</TableHead>
            <TableHead>{t('users.email')}</TableHead>
            <TableHead>{t('users.role')}</TableHead>
            <TableHead className="text-right">{t('users.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map(user => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar name={user.full_name} src={user.avatar_url} size="sm" />
                  <span className="font-medium">{user.full_name}</span>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">{user.email_address}</TableCell>
              <TableCell>
                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>{t(`role.${user.role}`)}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Link href={`/users/${user.id}/edit`} className={buttonVariants('ghost', 'sm')}>
                    <Pencil className="h-3.5 w-3.5" />
                    {t('users.edit')}
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-amber-600 hover:text-amber-700"
                    onClick={() => router.patch(`/users/${user.id}/toggle_role`)}
                  >
                    <Repeat className="h-3.5 w-3.5" />
                    {t('users.toggleRole')}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => destroy(user)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    {t('users.delete')}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </AppShell>
  )
}
