import { Head, Link, router, usePage } from '@inertiajs/react'
import useDashboardChannel from '../../hooks/useDashboardChannel'

export default function Show({ total_users, users_by_role }) {
  const { total_users: total, users_by_role: byRole } = useDashboardChannel({ total_users, users_by_role })
  const { flash } = usePage().props

  function signOut() {
    router.delete('/session')
  }

  return (
    <div className="max-w-2xl mx-auto mt-12 space-y-6">
      <Head title="Dashboard" />
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/users" className="text-blue-600">Manage users</Link>
          <Link href="/profile" className="text-blue-600">My profile</Link>
          <button onClick={signOut} className="text-gray-600">Sign out</button>
        </nav>
      </div>
      {flash?.alert && <p className="text-red-600 text-sm">{flash.alert}</p>}
      {flash?.notice && <p className="text-green-600 text-sm">{flash.notice}</p>}
      <div className="bg-white rounded shadow p-6">
        <p className="text-sm text-gray-500">Total users</p>
        <p className="text-3xl font-bold" data-testid="total-users">{total}</p>
      </div>
      <div className="bg-white rounded shadow p-6 space-y-2">
        <p className="text-sm text-gray-500">By role</p>
        {Object.entries(byRole).map(([role, count]) => (
          <p key={role} data-testid={`role-count-${role}`}>{role}: {count}</p>
        ))}
      </div>
    </div>
  )
}
