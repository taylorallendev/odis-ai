/**
 * Gradient Component adapted from Radiant with conventional naming
 * 
 * Provides professional medical-grade gradients that maintain the visual
 * impact of radiant-ts while using OdisAI's teal-based color system.
 */

import { clsx } from 'clsx'

export function Gradient({
  className,
  variant = 'primary',
  ...props
}: React.ComponentPropsWithoutRef<'div'> & {
  variant?: 'primary' | 'accent' | 'muted'
}) {
  const gradientClasses = {
    // Enhanced teal primary gradient with better visual impact
    primary: 'bg-gradient-to-br from-teal-50/80 from-20% via-teal-100/60 via-50% to-teal-200/40 to-90%',
    // Accent gradient - using accent color
    accent: 'bg-gradient-to-br from-muted from-28% via-accent/20 via-70% to-accent/35',
    // Muted gradient - very subtle
    muted: 'bg-gradient-to-br from-background from-28% via-muted via-70% to-muted/80',
  }
  
  return (
    <div
      {...props}
      className={clsx(
        className,
        gradientClasses[variant],
      )}
    />
  )
}

export function GradientBackground({
  variant = 'primary'
}: {
  variant?: 'primary' | 'accent'
}) {
  const gradientClasses = {
    primary: 'bg-gradient-to-br from-background from-28% via-primary/15 via-70% to-primary/25',
    accent: 'bg-gradient-to-br from-muted from-28% via-accent/20 via-70% to-accent/35',
  }
  
  return (
    <div className="relative mx-auto max-w-7xl">
      <div
        className={clsx(
          'absolute -top-44 -right-60 h-60 w-xl transform-gpu md:right-0',
          gradientClasses[variant],
          'rotate-[-10deg] rounded-full blur-3xl',
        )}
      />
    </div>
  )
}