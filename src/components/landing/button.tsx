/**
 * Styled Button Component adapted from Radiant with conventional naming
 * 
 * Maintains the radiant-ts button styling and behavior while using
 * OdisAI's medical-grade color palette and CSS variables.
 */

import { clsx } from 'clsx'
import Link from 'next/link'
import { themeAwareClsx } from './theme-bridge'
import { forwardRef } from 'react'

const variants = {
  primary: themeAwareClsx(
    'inline-flex items-center justify-center px-4 py-[calc(theme(spacing.2)-1px)]',
    'rounded-full border border-transparent bg-primary shadow-md',
    'text-base font-medium whitespace-nowrap text-primary-foreground',
    'disabled:bg-primary disabled:opacity-40 hover:bg-primary/90',
    'transition-colors duration-200',
  ),
  secondary: themeAwareClsx(
    'relative inline-flex items-center justify-center px-4 py-[calc(theme(spacing.2)-1px)]',
    'rounded-full border border-transparent bg-background/90 shadow-md ring-1 ring-border',
    'after:absolute after:inset-0 after:rounded-full after:shadow-[inset_0_0_2px_1px_hsl(var(--background)/0.3)]',
    'text-base font-medium whitespace-nowrap text-foreground',
    'disabled:bg-background/50 disabled:opacity-40 hover:bg-background',
    'transition-colors duration-200',
  ),
  outline: themeAwareClsx(
    'inline-flex items-center justify-center px-2 py-[calc(theme(spacing.1.5)-1px)]',
    'rounded-lg border border-transparent shadow-sm ring-1 ring-border/50',
    'text-sm font-medium whitespace-nowrap text-foreground',
    'disabled:bg-transparent disabled:opacity-40 hover:bg-muted/50',
    'transition-colors duration-200',
  ),
  medical: themeAwareClsx(
    'inline-flex items-center justify-center px-4 py-[calc(theme(spacing.2)-1px)]',
    'rounded-full border border-transparent bg-accent shadow-md',
    'text-base font-medium whitespace-nowrap text-accent-foreground',
    'disabled:bg-accent disabled:opacity-40 hover:bg-accent/90',
    'transition-colors duration-200',
  ),
}

type ButtonProps = {
  variant?: keyof typeof variants
  href?: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

export const StyledButton = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(function StyledButton({
  variant = 'primary',
  className,
  href,
  children,
  onClick,
  disabled,
  type = 'button',
  ...props
}, ref) {
  const buttonClassName = clsx(className, variants[variant])

  if (href) {
    return (
      <Link
        href={href}
        className={buttonClassName}
        {...props}
      >
        {children}
      </Link>
    )
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClassName}
      {...props}
    >
      {children}
    </button>
  )
})