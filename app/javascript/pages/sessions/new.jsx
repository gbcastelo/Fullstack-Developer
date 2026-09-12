import { Head, Link, useForm, usePage } from '@inertiajs/react'
import { ShieldCheck } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Alert } from '../../components/ui/alert'
import { Card, CardContent } from '../../components/ui/card'

export default function New() {
  const { flash } = usePage().props
  const { data, setData, post, processing } = useForm({
    email_address: '',
    password: '',
  })

  function submit(e) {
    e.preventDefault()
    post('/session')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Head title="Sign in" />
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <ShieldCheck className="h-9 w-9 text-primary" />
          <h1 className="text-xl font-semibold tracking-tight">Sign in to Umanni Admin</h1>
          <p className="text-sm text-muted-foreground">Manage users, roles, and imports</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={submit} className="space-y-4">
              {flash?.alert && <Alert variant="alert">{flash.alert}</Alert>}
              {flash?.notice && <Alert variant="notice">{flash.notice}</Alert>}
              <div className="space-y-1.5">
                <Label htmlFor="email_address">Email</Label>
                <Input
                  id="email_address"
                  type="email"
                  required
                  value={data.email_address}
                  onChange={e => setData('email_address', e.target.value)}
                  placeholder="Email"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={data.password}
                  onChange={e => setData('password', e.target.value)}
                  placeholder="Password"
                />
              </div>
              <Button disabled={processing} type="submit" className="w-full">
                Sign in
              </Button>
            </form>
          </CardContent>
        </Card>

        <Link href="/register" className="block text-center text-sm text-primary hover:underline">
          Create an account
        </Link>
      </div>
    </div>
  )
}
