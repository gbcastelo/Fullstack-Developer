import { Head, useForm, router } from '@inertiajs/react'

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Head title="Edit profile" />
      <div className="max-w-md w-full mx-auto bg-white p-8 rounded shadow space-y-4">
        <h1 className="text-xl font-semibold">Edit profile</h1>
        <form onSubmit={submit} className="space-y-4">
          <label className="block">
            <span className="text-sm text-gray-700">Full name</span>
            <input
              required
              value={data.full_name}
              onChange={e => setData('full_name', e.target.value)}
              placeholder={user.full_name}
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </label>
          {errors?.full_name && <p className="text-red-600 text-sm">{errors.full_name}</p>}
          <label className="block">
            <span className="text-sm text-gray-700">Avatar</span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={e => setData('avatar', e.target.files[0])}
              className="mt-1 w-full text-sm"
            />
          </label>
          {errors?.avatar && <p className="text-red-600 text-sm">{errors.avatar}</p>}
          <button disabled={processing} type="submit" className="w-full bg-blue-600 text-white rounded px-3 py-2">
            Save
          </button>
        </form>
        <button onClick={destroy} className="w-full border border-red-600 text-red-600 rounded px-3 py-2">
          Delete my account
        </button>
      </div>
    </div>
  )
}
