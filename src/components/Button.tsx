import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary'
  loading?: boolean
  loadingText?: string
  children: ReactNode
}

export default function Button({
  variant = 'primary',
  loading = false,
  loadingText,
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  const variantClass = variant === 'secondary' ? ' secondary' : ''
  const classes = `${className}${variantClass}`.trim()

  return (
    <button className={classes} disabled={disabled || loading} {...props}>
      {loading ? loadingText ?? 'Loading...' : children}
    </button>
  )
}
