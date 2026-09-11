import { Head } from '@inertiajs/react'

export default function Show({ total_users, users_by_role }) {
  return (
    <div className="max-w-2xl mx-auto mt-12 space-y-6">
      <Head title="Dashboard" />
      <h1 className="text-xl font-semibold">Admin Dashboard</h1>
      <div className="bg-white rounded shadow p-6">
        <p className="text-sm text-gray-500">Total users</p>
        <p className="text-3xl font-bold" data-testid="total-users">{total_users}</p>
      </div>
      <div className="bg-white rounded shadow p-6 space-y-2">
        <p className="text-sm text-gray-500">By role</p>
        {Object.entries(users_by_role).map(([role, count]) => (
          <p key={role} data-testid={`role-count-${role}`}>{role}: {count}</p>
        ))}
      </div>
    </div>
  )
}
