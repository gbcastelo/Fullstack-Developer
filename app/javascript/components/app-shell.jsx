import { Link, usePage, router } from '@inertiajs/react'
import { LayoutDashboard, Users, Upload, UserRound, LogOut, Sun, Moon, ShieldCheck, Languages } from 'lucide-react'
import { useTheme } from '../lib/use-theme'
import { useTranslation } from '../lib/i18n'
import { Avatar } from './ui/avatar'
import { Alert } from './ui/alert'
import { cn } from '../lib/utils'

export function AppShell({ children, title }) {
  const { props, url } = usePage()
  const user = props.current_user
  const flash = props.flash || {}
  const [theme, setTheme] = useTheme()
  const { t, locale } = useTranslation()

  const NAV = [
    { href: '/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard, adminOnly: true },
    { href: '/users', label: t('nav.users'), icon: Users, adminOnly: true },
    { href: '/imports/new', label: t('nav.importUsers'), icon: Upload, adminOnly: true },
    { href: '/profile', label: t('nav.myProfile'), icon: UserRound, adminOnly: false },
  ]

  function signOut() {
    router.delete('/session')
  }

  function toggleLocale() {
    const next = locale === 'pt-BR' ? 'en' : 'pt-BR'
    document.cookie = `locale=${next}; path=/; max-age=${60 * 60 * 24 * 365}`
    router.reload()
  }

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="flex w-56 shrink-0 flex-col border-r border-border bg-card sm:w-64">
        <div className="flex items-center gap-2 border-b border-border px-6 py-5">
          <ShieldCheck className="h-6 w-6 text-primary" />
          <span className="text-base font-semibold tracking-tight">Umanni Admin</span>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV.filter(item => !item.adminOnly || user?.role === 'admin').map(item => {
            const active = url === item.href || (item.href !== '/profile' && url.startsWith(item.href))
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {user && (
          <div className="border-t border-border p-3">
            <div className="flex items-center gap-3 rounded-md px-2 py-2">
              <Avatar name={user.full_name} src={user.avatar_url} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{user.full_name}</p>
                <p className="truncate text-xs text-muted-foreground">{user.email_address}</p>
              </div>
              <button
                onClick={signOut}
                className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <LogOut className="h-4 w-4" />
                <span className="sr-only">{t('nav.signOut')}</span>
              </button>
            </div>
          </div>
        )}
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3 md:px-8">
          <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleLocale}
              aria-label={t('nav.toggleLanguage')}
              title={locale === 'pt-BR' ? 'English' : 'Português'}
              className="flex items-center gap-1.5 rounded-md border border-border px-2 py-2 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Languages className="h-4 w-4" />
              {locale === 'pt-BR' ? 'PT' : 'EN'}
            </button>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label={t('nav.toggleTheme')}
              className="rounded-md border border-border p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </header>

        <main className="flex-1 space-y-4 p-4 md:p-8">
          {flash.notice && <Alert variant="notice">{flash.notice}</Alert>}
          {flash.alert && <Alert variant="alert">{flash.alert}</Alert>}
          {children}
        </main>
      </div>
    </div>
  )
}
