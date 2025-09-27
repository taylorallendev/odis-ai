/**
 * Text Components adapted from Radiant with conventional naming
 * 
 * Provides Heading, Subheading, and Lead components that maintain
 * radiant-ts typography hierarchy while using OdisAI theme colors.
 */

import { clsx } from 'clsx'

type HeadingProps = {
  as?: 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  dark?: boolean
} & React.ComponentPropsWithoutRef<
  'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
>

export function Heading({
  className,
  as: Element = 'h2',
  dark = false,
  ...props
}: HeadingProps) {
  return (
    <Element
      {...props}
      data-dark={dark ? 'true' : undefined}
      className={clsx(
        className,
        'text-4xl font-medium tracking-tighter text-pretty text-foreground data-[dark=true]:text-primary-foreground sm:text-6xl',
      )}
    />
  )
}

export function Subheading({
  className,
  as: Element = 'h2',
  dark = false,
  ...props
}: HeadingProps) {
  return (
    <Element
      {...props}
      data-dark={dark ? 'true' : undefined}
      className={clsx(
        className,
        'font-mono text-xs/5 font-semibold tracking-widest text-muted-foreground uppercase data-[dark=true]:text-muted-foreground/80',
      )}
    />
  )
}

export function Lead({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'p'>) {
  return (
    <p
      className={clsx(
        className, 
        'text-2xl font-medium text-muted-foreground'
      )}
      {...props}
    />
  )
}

// Medical-specific text components for OdisAI
export function MedicalHeading({
  className,
  as: Element = 'h2',
  variant = 'primary',
  ...props
}: HeadingProps & {
  variant?: 'primary' | 'accent'
}) {
  const variantClasses = {
    primary: 'text-foreground',
    accent: 'text-primary',
  }
  
  return (
    <Element
      {...props}
      className={clsx(
        className,
        'text-4xl font-medium tracking-tighter text-pretty sm:text-6xl',
        variantClasses[variant]
      )}
    />
  )
}

export function MedicalSubheading({
  className,
  variant = 'default',
  ...props
}: React.ComponentPropsWithoutRef<'p'> & {
  variant?: 'default' | 'accent'
}) {
  const variantClasses = {
    default: 'text-muted-foreground',
    accent: 'text-accent',
  }
  
  return (
    <p
      className={clsx(
        className,
        'font-mono text-xs/5 font-semibold tracking-widest uppercase',
        variantClasses[variant]
      )}
      {...props}
    />
  )
}