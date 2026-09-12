import { Head, Link, useForm } from '@inertiajs/react'
import useImportChannel from '../../hooks/useImportChannel'

export default function New() {
  const { setData, post, processing } = useForm({ file: null })
  const progress = useImportChannel()

  function submit(e) {
    e.preventDefault()
    post('/imports', { forceFormData: true })
  }

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded shadow space-y-4">
      <Head title="Import users" />
      <Link href="/users" className="text-blue-600 text-sm">&larr; Back to users</Link>
      <h1 className="text-xl font-semibold">Import users</h1>
      <form onSubmit={submit} className="space-y-4">
        <input
          type="file"
          name="file"
          accept=".csv,.xlsx"
          required
          onChange={e => setData('file', e.target.files[0])}
          className="w-full"
        />
        <button disabled={processing} type="submit" className="w-full bg-blue-600 text-white rounded px-3 py-2">
          Upload
        </button>
      </form>
      {progress && (
        <div
          className={`text-sm ${progress.status === 'failed' ? 'text-red-600' : 'text-gray-700'}`}
          data-testid="import-progress"
        >
          <p>Status: {progress.status}</p>
          <p>Processed: {progress.processed} / {progress.total}</p>
          {progress.errors?.length > 0 && (
            <ul className="text-red-600">
              {progress.errors.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
