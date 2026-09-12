import { useRef, useState } from 'react'
import { Head, useForm } from '@inertiajs/react'
import { UploadCloud, FileSpreadsheet, X, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import useImportChannel from '../../hooks/useImportChannel'
import { AppShell } from '../../components/app-shell'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { useTranslation } from '../../lib/i18n'
import { cn } from '../../lib/utils'

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function New() {
  const { t } = useTranslation()
  const { data, setData, post, processing } = useForm({ file: null })
  const [dragging, setDragging] = useState(false)
  const fileInputRef = useRef(null)
  const progress = useImportChannel()

  function pickFile(file) {
    if (!file) return
    setData('file', file)
  }

  function removeFile() {
    setData('file', null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function onDrop(e) {
    e.preventDefault()
    setDragging(false)
    pickFile(e.dataTransfer.files[0])
  }

  function submit(e) {
    e.preventDefault()
    post('/imports', { forceFormData: true })
  }

  return (
    <AppShell title={t('nav.importUsers')}>
      <Head title={t('nav.importUsers')} />
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>{t('imports.title')}</CardTitle>
          <CardDescription>{t('imports.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={submit} className="space-y-4">
            {data.file ? (
              <div className="flex items-center gap-3 rounded-lg border border-border bg-accent/30 p-4">
                <FileSpreadsheet className="h-8 w-8 shrink-0 text-primary" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{data.file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatSize(data.file.size)}</p>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  aria-label={t('imports.remove')}
                  className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label
                htmlFor="file"
                onDragOver={e => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                className={cn(
                  'flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:bg-accent/40',
                  dragging ? 'border-primary bg-accent/40' : 'border-border'
                )}
              >
                <UploadCloud className="h-8 w-8" />
                <span>{t('imports.dropzone')}</span>
              </label>
            )}

            {data.file && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-sm font-medium text-primary hover:underline"
              >
                {t('imports.chooseAnother')}
              </button>
            )}

            <input
              ref={fileInputRef}
              id="file"
              type="file"
              name="file"
              accept=".csv,.xlsx"
              required
              onChange={e => pickFile(e.target.files[0])}
              className="sr-only"
            />
            <Button disabled={processing} type="submit" className="w-full">
              {t('imports.upload')}
            </Button>
          </form>

          {progress && (
            <div
              className="space-y-2 rounded-lg border border-border p-4 text-sm"
              data-testid="import-progress"
            >
              <div className="flex items-center gap-2 font-medium">
                {progress.status === 'done' && <CheckCircle2 className="h-4 w-4 text-success" />}
                {progress.status === 'failed' && <XCircle className="h-4 w-4 text-destructive" />}
                {progress.status === 'processing' && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                <span className={progress.status === 'failed' ? 'text-destructive' : ''}>
                  {t('imports.status')}: {progress.status}
                </span>
              </div>
              <p className="text-muted-foreground">{t('imports.processed')}: {progress.processed} / {progress.total}</p>
              {progress.errors?.length > 0 && (
                <ul className="list-inside list-disc text-destructive">
                  {progress.errors.map((e, i) => <li key={i}>{e}</li>)}
                </ul>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </AppShell>
  )
}
