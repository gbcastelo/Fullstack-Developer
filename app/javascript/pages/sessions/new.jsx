import { Head, useForm } from '@inertiajs/react'

export default function New() {
  const { data, setData, post, processing, errors } = useForm({
    email_address: '',
    password: '',
  })

  function submit(e) {
    e.preventDefault()
    post('/session')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Head title="Sign in" />
      <form onSubmit={submit} className="bg-white p-8 rounded shadow w-full max-w-sm space-y-4">
        <h1 className="text-xl font-semibold">Sign in</h1>
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
        {errors.email_address && <p className="text-red-600 text-sm">{errors.email_address}</p>}
        <button disabled={processing} type="submit" className="w-full bg-blue-600 text-white rounded px-3 py-2">
          Sign in
        </button>
      </form>
    </div>
  )
}
