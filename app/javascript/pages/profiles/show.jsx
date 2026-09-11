import { Head, Link } from '@inertiajs/react'

export default function Show({ user }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Head title="My profile" />
      <div className="max-w-md w-full mx-auto bg-white p-8 rounded shadow space-y-2">
        <h1 className="text-xl font-semibold mb-4">My profile</h1>
        <p><span className="font-medium">Name:</span> {user.full_name}</p>
        <p><span className="font-medium">Email:</span> {user.email_address}</p>
        <p><span className="font-medium">Role:</span> {user.role}</p>
        <Link href="/profile/edit" className="inline-block mt-4 text-blue-600">Edit profile</Link>
      </div>
    </div>
  )
}
