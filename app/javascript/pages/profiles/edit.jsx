import { Head, useForm, router } from '@inertiajs/react'
import { AppShell } from '../../components/app-shell'
import { Card, CardContent } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Avatar } from '../../components/ui/avatar'

export default function Edit({ user, errors }) {
  const { data, setData, transform, patch, processing } = useForm({
    full_name: user.full_name,
    avatar: null,
  })

  function submit(e) {
    e.preventDefault()
    // Omit avatar entirely when no new file was picked: has_one_attached's
    // setter treats an explicit "" as "delete the attachment", so sending it
    // unconditionally would wipe an existing avatar on every unrelated save.
    transform(({ full_name, avatar }) => ({
      user: avatar ? { full_name, avatar } : { full_name },
    }))
    patch('/profile', { forceFormData: true })
  }

  function destroy() {
    if (confirm('Delete your account? This cannot be undone.')) {
      router.delete('/profile')
    }
  }

  return (
    <AppShell title="Edit profile">
      <Head title="Edit profile" />
      <Card className="max-w-lg">
        <CardContent className="space-y-6 pt-6">
          <div className="flex items-center gap-4">
            <Avatar name={user.full_name} src={user.avatar_url} size="lg" />
            <div className="space-y-1.5">
              <Label htmlFor="avatar">Avatar</Label>
              <input
                id="avatar"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={e => setData('avatar', e.target.files[0])}
                className="text-sm text-muted-foreground file:mr-2 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-sm file:font-medium"
              />
              {errors?.avatar && <p className="text-sm text-destructive">{errors.avatar}</p>}
            </div>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="full_name">Full name</Label>
              <Input
                id="full_name"
                required
                value={data.full_name}
                onChange={e => setData('full_name', e.target.value)}
                placeholder={user.full_name}
              />
              {errors?.full_name && <p className="text-sm text-destructive">{errors.full_name}</p>}
            </div>
            <Button disabled={processing} type="submit" className="w-full">
              Save
            </Button>
          </form>

          <Button onClick={destroy} variant="outline" className="w-full border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive">
            Delete my account
          </Button>
        </CardContent>
      </Card>
    </AppShell>
  )
}
