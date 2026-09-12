import { cn } from '../../lib/utils'

const variants = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border',
  outline: 'border border-border bg-transparent hover:bg-accent hover:text-accent-foreground',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm',
  link: 'text-primary underline-offset-4 hover:underline p-0 h-auto',
}

const sizes = {
  default: 'h-9 px-4 py-2',
  sm: 'h-8 px-3 text-sm',
  lg: 'h-10 px-6',
  icon: 'h-9 w-9',
}

export function buttonVariants(variant = 'default', size = 'default', className) {
  return cn(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
    variants[variant],
    sizes[size],
    className
  )
}

export function Button({ className, variant = 'default', size = 'default', ...props }) {
  return <button className={buttonVariants(variant, size, className)} {...props} />
}
