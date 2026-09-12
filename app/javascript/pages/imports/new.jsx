import { Head, useForm } from '@inertiajs/react'
import { UploadCloud, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import useImportChannel from '../../hooks/useImportChannel'
import { AppShell } from '../../components/app-shell'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { useTranslation } from '../../lib/i18n'

export default function New() {
  const { t } = useTranslation()
  const { setData, post, processing } = useForm({ file: null })
  const progress = useImportChannel()

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
            <label
              htmlFor="file"
              className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:bg-accent/40"
            >
              <UploadCloud className="h-8 w-8" />
              <span>{t('imports.dropzone')}</span>
            </label>
            <input
              id="file"
              type="file"
              name="file"
              accept=".csv,.xlsx"
              required
              onChange={e => setData('file', e.target.files[0])}
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
