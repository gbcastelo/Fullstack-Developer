import { router } from '@inertiajs/react'

export default function Show() {
  function signOut() {
    router.delete('/session')
  }

  return (
    <div className="p-8 flex items-center justify-between">
      <span>Dashboard placeholder</span>
      <button onClick={signOut} className="text-sm text-gray-600">Sign out</button>
    </div>
  )
}
