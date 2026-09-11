import { Head, useForm } from '@inertiajs/react'

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
    <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded shadow space-y-4">
      <Head title="New user" />
      <h1 className="text-xl font-semibold">New user</h1>
      <form onSubmit={submit} className="space-y-4">
        <input required value={data.full_name} onChange={e => setData('full_name', e.target.value)}
          placeholder="Full name" className="w-full border rounded px-3 py-2" />
        <input required type="email" value={data.email_address} onChange={e => setData('email_address', e.target.value)}
          placeholder="Email" className="w-full border rounded px-3 py-2" />
        <input required type="password" value={data.password} onChange={e => setData('password', e.target.value)}
          placeholder="Password" className="w-full border rounded px-3 py-2" />
        <select value={data.role} onChange={e => setData('role', e.target.value)} className="w-full border rounded px-3 py-2">
          <option value="user">user</option>
          <option value="admin">admin</option>
        </select>
        {errors?.email_address && <p className="text-red-600 text-sm">{errors.email_address}</p>}
        <button disabled={processing} type="submit" className="w-full bg-blue-600 text-white rounded px-3 py-2">Create</button>
      </form>
    </div>
  )
}
