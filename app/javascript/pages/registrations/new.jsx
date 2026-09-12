import { Head, useForm } from '@inertiajs/react'
import { ShieldCheck } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Card, CardContent } from '../../components/ui/card'

export default function New() {
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
      <Head title="Create your account" />
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <ShieldCheck className="h-9 w-9 text-primary" />
          <h1 className="text-xl font-semibold tracking-tight">Create your account</h1>
          <p className="text-sm text-muted-foreground">Join as a standard user</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="full_name">Full name</Label>
                <Input
                  id="full_name"
                  required
                  value={data.full_name}
                  onChange={e => setData('full_name', e.target.value)}
                  placeholder="Full name"
                />
                {errors.full_name && <p className="text-sm text-destructive">{errors.full_name}</p>}
              </div>
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
                {errors.email_address && <p className="text-sm text-destructive">{errors.email_address}</p>}
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
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
              </div>
              <Button disabled={processing} type="submit" className="w-full">
                Register
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
