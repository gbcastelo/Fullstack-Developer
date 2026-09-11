import { Head, useForm } from '@inertiajs/react'

export default function Edit({ user, errors }) {
  const { data, setData, patch, transform, processing } = useForm({
    full_name: user.full_name, email_address: user.email_address, role: user.role,
  })

  function submit(e) {
    e.preventDefault()
    transform(data => ({ user: data }))
    patch(`/users/${user.id}`)
  }

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded shadow space-y-4">
      <Head title="Edit user" />
      <h1 className="text-xl font-semibold">Edit user</h1>
      <form onSubmit={submit} className="space-y-4">
        <label className="block">
          <span className="text-sm text-gray-700">Full name</span>
          <input required value={data.full_name} onChange={e => setData('full_name', e.target.value)}
            className="w-full border rounded px-3 py-2" />
        </label>
        <label className="block">
          <span className="text-sm text-gray-700">Email</span>
          <input required type="email" value={data.email_address} onChange={e => setData('email_address', e.target.value)}
            className="w-full border rounded px-3 py-2" />
        </label>
        <select value={data.role} onChange={e => setData('role', e.target.value)} className="w-full border rounded px-3 py-2">
          <option value="user">user</option>
          <option value="admin">admin</option>
        </select>
        {errors?.email_address && <p className="text-red-600 text-sm">{errors.email_address}</p>}
        <button disabled={processing} type="submit" className="w-full bg-blue-600 text-white rounded px-3 py-2">Save</button>
      </form>
    </div>
  )
}
