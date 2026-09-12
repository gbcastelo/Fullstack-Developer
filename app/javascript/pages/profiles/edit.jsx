import { useEffect, useRef, useState } from 'react'
import { Head, useForm, router } from '@inertiajs/react'
import { Camera } from 'lucide-react'
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
  const [preview, setPreview] = useState(null)
  const fileInputRef = useRef(null)

  // Free the blob URL when it's replaced or the page unmounts, so picking a
  // few avatars in a row doesn't leak memory.
  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview])

  function pickAvatar(e) {
    const file = e.target.files[0]
    if (!file) return
    setData('avatar', file)
    setPreview(URL.createObjectURL(file))
  }

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
        <CardContent className="pt-6">
          <form onSubmit={submit} className="space-y-6">
            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="group relative rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Avatar name={user.full_name} src={preview || user.avatar_url} size="lg" className="h-24 w-24 text-2xl" />
                <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 text-transparent transition-colors group-hover:bg-black/40 group-hover:text-white">
                  <Camera className="h-6 w-6" />
                </span>
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-sm font-medium text-primary hover:underline"
              >
                Change photo
              </button>
              <input
                ref={fileInputRef}
                id="avatar"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={pickAvatar}
                className="sr-only"
              />
              {errors?.avatar && <p className="text-sm text-destructive">{errors.avatar}</p>}
            </div>

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

          <Button
            onClick={destroy}
            variant="outline"
            className="mt-4 w-full border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            Delete my account
          </Button>
        </CardContent>
      </Card>
    </AppShell>
  )
}
