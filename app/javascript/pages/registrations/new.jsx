import { Head, useForm } from '@inertiajs/react'

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Head title="Create your account" />
      <form onSubmit={submit} className="bg-white p-8 rounded shadow w-full max-w-sm space-y-4">
        <h1 className="text-xl font-semibold">Create your account</h1>
        <label className="block">
          <span className="text-sm text-gray-700">Full name</span>
          <input
            value={data.full_name}
            onChange={e => setData('full_name', e.target.value)}
            placeholder="Full name"
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </label>
        {errors.full_name && <p className="text-red-600 text-sm">{errors.full_name}</p>}
        <label className="block">
          <span className="text-sm text-gray-700">Email</span>
          <input
            type="email"
            value={data.email_address}
            onChange={e => setData('email_address', e.target.value)}
            placeholder="Email"
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </label>
        {errors.email_address && <p className="text-red-600 text-sm">{errors.email_address}</p>}
        <label className="block">
          <span className="text-sm text-gray-700">Password</span>
          <input
            type="password"
            value={data.password}
            onChange={e => setData('password', e.target.value)}
            placeholder="Password"
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </label>
        {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
        <button disabled={processing} type="submit" className="w-full bg-blue-600 text-white rounded px-3 py-2">
          Register
        </button>
      </form>
    </div>
  )
}
