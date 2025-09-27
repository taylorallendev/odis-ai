/**
 * Plus Grid Components adapted from Radiant with conventional naming
 * 
 * Provides the grid layout system used by radiant-ts components
 * with OdisAI theme integration.
 */

import { clsx } from 'clsx'
import { themeAwareClsx } from './theme-bridge'

export function PlusGrid({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={themeAwareClsx(
        className,
        'mx-auto max-w-7xl px-6 lg:px-8'
      )}
      {...props}
    />
  )
}

export function PlusGridRow({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={themeAwareClsx(
        className,
        'grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-8'
      )}
      {...props}
    />
  )
}

export function PlusGridItem({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={themeAwareClsx(
        className,
        'relative'
      )}
      {...props}
    />
  )
}

// Alternative container component for general use
export function GridContainer({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={themeAwareClsx(
        className,
        'mx-auto max-w-7xl px-6 lg:px-8'
      )}
      {...props}
    />
  )
}