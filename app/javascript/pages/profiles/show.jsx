import { Head, Link, router, usePage } from '@inertiajs/react'

export default function Show({ user }) {
  const { flash } = usePage().props

  function signOut() {
    router.delete('/session')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Head title="My profile" />
      <div className="max-w-md w-full mx-auto bg-white p-8 rounded shadow space-y-2">
        <h1 className="text-xl font-semibold mb-4">My profile</h1>
        {flash?.alert && <p className="text-red-600 text-sm">{flash.alert}</p>}
        {flash?.notice && <p className="text-green-600 text-sm">{flash.notice}</p>}
        <p><span className="font-medium">Name:</span> {user.full_name}</p>
        <p><span className="font-medium">Email:</span> {user.email_address}</p>
        <p><span className="font-medium">Role:</span> {user.role}</p>
        <div className="flex items-center justify-between mt-4">
          <Link href="/profile/edit" className="text-blue-600">Edit profile</Link>
          <button onClick={signOut} className="text-sm text-gray-600">Sign out</button>
        </div>
      </div>
    </div>
  )
}
