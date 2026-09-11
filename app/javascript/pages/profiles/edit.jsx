import { Head, useForm, router } from '@inertiajs/react'

export default function Edit({ user, errors }) {
  const { data, setData, transform, patch, processing } = useForm({ full_name: user.full_name })

  function submit(e) {
    e.preventDefault()
    transform(data => ({ user: data }))
    patch('/profile')
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
              value={data.full_name}
              onChange={e => setData('full_name', e.target.value)}
              placeholder={user.full_name}
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </label>
          {errors?.full_name && <p className="text-red-600 text-sm">{errors.full_name}</p>}
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
