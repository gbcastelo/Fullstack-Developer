import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react'
import { cn } from '../../lib/utils'

const styles = {
  notice: { wrap: 'bg-success/10 text-success border-success/20', Icon: CheckCircle2 },
  alert: { wrap: 'bg-destructive/10 text-destructive border-destructive/20', Icon: AlertCircle },
  failed: { wrap: 'bg-destructive/10 text-destructive border-destructive/20', Icon: XCircle },
}

export function Alert({ variant = 'notice', className, children, ...props }) {
  const { wrap, Icon } = styles[variant] ?? styles.notice
  return (
    <div className={cn('flex items-start gap-2 rounded-lg border px-3 py-2 text-sm', wrap, className)} {...props}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{children}</span>
    </div>
  )
}
