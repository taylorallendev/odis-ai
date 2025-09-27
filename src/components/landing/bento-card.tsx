'use client'

/**
 * Bento Card Component adapted from Radiant with conventional naming
 * 
 * Maintains the interactive and visual design of radiant-ts bento cards
 * while using OdisAI's medical theme colors and CSS variables.
 */

import { clsx } from 'clsx'
import { motion } from 'framer-motion'
import { Subheading } from './text'
import { themeAwareClsx } from './theme-bridge'

export function BentoCard({
  dark = false,
  className = '',
  eyebrow,
  title,
  description,
  graphic,
  fade = [],
  hover = true,
}: {
  dark?: boolean
  className?: string
  eyebrow: React.ReactNode
  title: React.ReactNode
  description: React.ReactNode
  graphic: React.ReactNode
  fade?: ('top' | 'bottom')[]
  hover?: boolean
}) {
  const cardVariants = {
    idle: { 
      scale: 1,
      boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'
    },
    active: { 
      scale: 1.02,
      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
    }
  }
  
  return (
    <motion.div
      initial="idle"
      whileHover={hover ? "active" : "idle"}
      variants={cardVariants}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      data-dark={dark ? 'true' : undefined}
      className={themeAwareClsx(
        className,
        'group relative flex flex-col overflow-hidden rounded-lg',
        'bg-card shadow-sm ring-1 ring-border/50',
        'data-[dark=true]:bg-secondary data-[dark=true]:ring-border/20',
      )}
    >
      <div className="relative h-80 shrink-0">
        {graphic}
        {fade.includes('top') && (
          <div className="absolute inset-0 bg-gradient-to-b from-card to-50% group-data-[dark=true]:from-secondary group-data-[dark=true]:from-[-25%]" />
        )}
        {fade.includes('bottom') && (
          <div className="absolute inset-0 bg-gradient-to-t from-card to-50% group-data-[dark=true]:from-secondary group-data-[dark=true]:from-[-25%]" />
        )}
      </div>
      <div className="relative p-10">
        <Subheading as="h3" dark={dark}>
          {eyebrow}
        </Subheading>
        <p className="mt-1 text-2xl/8 font-medium tracking-tight text-foreground group-data-[dark=true]:text-primary-foreground">
          {title}
        </p>
        <p className="mt-2 max-w-[600px] text-sm/6 text-muted-foreground group-data-[dark=true]:text-muted-foreground/80">
          {description}
        </p>
      </div>
    </motion.div>
  )
}

// Medical-specific bento card variant
export function MedicalBentoCard({
  className = '',
  eyebrow,
  title,
  description,
  graphic,
  fade = [],
  variant = 'default',
}: {
  className?: string
  eyebrow: React.ReactNode
  title: React.ReactNode
  description: React.ReactNode
  graphic: React.ReactNode
  fade?: ('top' | 'bottom')[]
  variant?: 'default' | 'accent'
}) {
  const variantClasses = {
    default: 'bg-card ring-border/50',
    accent: 'bg-accent/5 ring-accent/20',
  }
  
  return (
    <motion.div
      initial="idle"
      whileHover="active"
      variants={{
        idle: { scale: 1 },
        active: { scale: 1.02 }
      }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={clsx(
        className,
        'group relative flex flex-col overflow-hidden rounded-lg shadow-sm ring-1',
        variantClasses[variant],
      )}
    >
      <div className="relative h-80 shrink-0">
        {graphic}
        {fade.includes('top') && (
          <div className="absolute inset-0 bg-gradient-to-b from-card to-50%" />
        )}
        {fade.includes('bottom') && (
          <div className="absolute inset-0 bg-gradient-to-t from-card to-50%" />
        )}
      </div>
      <div className="relative p-10">
        <h4 className="text-sm/6 font-medium text-muted-foreground uppercase tracking-wider">
          {eyebrow}
        </h4>
        <p className="mt-1 text-2xl/8 font-medium tracking-tight text-foreground">
          {title}
        </p>
        <p className="mt-2 max-w-[600px] text-sm/6 text-muted-foreground">
          {description}
        </p>
      </div>
    </motion.div>
  )
}