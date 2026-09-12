import { Head, useForm } from '@inertiajs/react'
import { AppShell } from '../../components/app-shell'
import { Card, CardContent } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'

export default function New({ errors }) {
  const { data, setData, post, transform, processing } = useForm({
    full_name: '', email_address: '', password: '', role: 'user',
  })

  function submit(e) {
    e.preventDefault()
    transform(data => ({ user: data }))
    post('/users')
  }

  return (
    <AppShell title="New user">
      <Head title="New user" />
      <Card className="max-w-lg">
        <CardContent className="pt-6">
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="full_name">Full name</Label>
              <Input id="full_name" required value={data.full_name} onChange={e => setData('full_name', e.target.value)}
                placeholder="Full name" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email_address">Email</Label>
              <Input id="email_address" required type="email" value={data.email_address} onChange={e => setData('email_address', e.target.value)}
                placeholder="Email" />
              {errors?.email_address && <p className="text-sm text-destructive">{errors.email_address}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" required type="password" value={data.password} onChange={e => setData('password', e.target.value)}
                placeholder="Password" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                value={data.role}
                onChange={e => setData('role', e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="user">user</option>
                <option value="admin">admin</option>
              </select>
            </div>
            <Button disabled={processing} type="submit" className="w-full">Create</Button>
          </form>
        </CardContent>
      </Card>
    </AppShell>
  )
}
