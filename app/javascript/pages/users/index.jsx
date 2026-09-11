import { Head, Link, router } from '@inertiajs/react'

export default function Index({ users }) {
  function destroy(user) {
    if (confirm(`Delete ${user.full_name}?`)) {
      router.delete(`/users/${user.id}`)
    }
  }

  return (
    <div className="max-w-3xl mx-auto mt-12 space-y-4">
      <Head title="Users" />
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Users</h1>
        <Link href="/users/new" className="bg-blue-600 text-white rounded px-3 py-2">New user</Link>
      </div>
      <table className="w-full bg-white rounded shadow">
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="border-b last:border-0">
              <td className="p-3">{user.full_name}</td>
              <td className="p-3 text-gray-500">{user.email_address}</td>
              <td className="p-3">{user.role}</td>
              <td className="p-3 space-x-2">
                <Link href={`/users/${user.id}/edit`} className="text-blue-600">Edit</Link>
                <button onClick={() => router.patch(`/users/${user.id}/toggle_role`)} className="text-amber-600">
                  Toggle role
                </button>
                <button onClick={() => destroy(user)} className="text-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
