/**
 * Theme Bridge adapted from Radiant with conventional naming
 * 
 * This module provides a mapping system to convert radiant-ts hardcoded colors
 * to OdisAI's CSS variable-based theme system while maintaining the visual
 * hierarchy and professional medical aesthetic.
 */

import { clsx } from 'clsx'

/**
 * Color mapping configuration that translates radiant-ts colors to OdisAI CSS variables
 */
export const themeMapping = {
  // Background colors
  backgrounds: {
    primary: 'hsl(var(--background))', // white/light background
    secondary: 'hsl(var(--muted))', // gray-50 equivalent
    dark: 'hsl(var(--secondary))', // dark backgrounds (gray-900 equivalent)
    card: 'hsl(var(--card))',
  },
  
  // Text colors
  text: {
    primary: 'hsl(var(--foreground))', // main text (gray-950 equivalent)
    secondary: 'hsl(var(--muted-foreground))', // secondary text (gray-600 equivalent)
    muted: 'hsl(var(--muted-foreground))', // muted text (gray-500 equivalent)
    white: 'hsl(var(--primary-foreground))', // white text
    darkSecondary: 'hsl(var(--muted-foreground))', // gray-400 equivalent for dark mode
  },
  
  // Primary/accent colors
  accent: {
    primary: 'hsl(var(--primary))', // teal-600 equivalent
    secondary: 'hsl(var(--accent))', // accent color
    destructive: 'hsl(var(--destructive))', // red/error colors
  },
  
  // Border and ring colors
  borders: {
    default: 'hsl(var(--border))',
    input: 'hsl(var(--input))',
    ring: 'hsl(var(--ring))',
    light: 'hsl(var(--border) / 0.1)', // border-black/5 equivalent
    white: 'hsl(var(--primary-foreground) / 0.15)', // border-white/15 equivalent
  },
  
  // Gradient colors - adapted to OdisAI's teal-based medical theme
  gradients: {
    // Main hero gradient - professional teal gradient instead of colorful
    primary: 'bg-gradient-to-br from-[hsl(var(--background))] from-28% via-[hsl(var(--primary)/0.1)] via-70% to-[hsl(var(--primary)/0.2)]',
    // Alternative gradient for variety
    secondary: 'bg-gradient-to-br from-[hsl(var(--muted))] from-28% via-[hsl(var(--accent)/0.2)] via-70% to-[hsl(var(--accent)/0.3)]',
    // Dark mode gradient
    dark: 'bg-gradient-to-br from-[hsl(var(--secondary))] from-28% via-[hsl(var(--primary)/0.2)] via-70% to-[hsl(var(--primary)/0.3)]',
  },
}

/**
 * Utility function to apply OdisAI theme classes instead of hardcoded colors
 */
export function applyThemeClasses(baseClasses: string): string {
  return baseClasses
    // Replace hardcoded gray colors with CSS variables
    .replace(/text-gray-950/g, 'text-foreground')
    .replace(/text-gray-900/g, 'text-foreground')
    .replace(/text-gray-800/g, 'text-foreground')
    .replace(/text-gray-600/g, 'text-muted-foreground')
    .replace(/text-gray-500/g, 'text-muted-foreground')
    .replace(/text-gray-400/g, 'text-muted-foreground')
    
    // Replace background colors
    .replace(/bg-gray-950/g, 'bg-secondary')
    .replace(/bg-gray-900/g, 'bg-secondary')
    .replace(/bg-gray-800/g, 'bg-secondary')
    .replace(/bg-gray-100/g, 'bg-muted')
    .replace(/bg-gray-50/g, 'bg-muted')
    .replace(/bg-white/g, 'bg-background')
    
    // Replace border colors
    .replace(/border-black\/5/g, 'border-border')
    .replace(/border-white\/15/g, 'border-border')
    .replace(/ring-black\/10/g, 'ring-ring')
    .replace(/ring-\[#D15052\]\/15/g, 'ring-ring')
    
    // Replace hover states
    .replace(/data-hover:bg-gray-800/g, 'data-hover:bg-secondary/80')
    .replace(/data-hover:bg-gray-50/g, 'data-hover:bg-muted/80')
    .replace(/data-hover:bg-black\/2\.5/g, 'data-hover:bg-primary/5')
    .replace(/data-hover:bg-black\/5/g, 'data-hover:bg-primary/10')
}

/**
 * Professional medical gradient component for OdisAI
 * Replaces the colorful radiant-ts gradients with medical-appropriate teal tones
 */
export function MedicalGradient({
  className,
  variant = 'primary',
  ...props
}: React.ComponentPropsWithoutRef<'div'> & {
  variant?: 'primary' | 'secondary' | 'dark'
}) {
  const gradientClass = {
    primary: 'bg-gradient-to-br from-background from-28% via-primary/10 via-70% to-primary/20',
    secondary: 'bg-gradient-to-br from-muted from-28% via-accent/20 via-70% to-accent/30',
    dark: 'bg-gradient-to-br from-secondary from-28% via-primary/20 via-70% to-primary/30',
  }[variant]
  
  return (
    <div
      {...props}
      className={clsx(className, gradientClass)}
    />
  )
}

/**
 * Professional medical gradient background for hero sections
 */
export function MedicalGradientBackground({
  variant = 'primary'
}: {
  variant?: 'primary' | 'secondary'
}) {
  const gradientClass = {
    primary: 'bg-gradient-to-br from-background from-28% via-primary/10 via-70% to-primary/20',
    secondary: 'bg-gradient-to-br from-muted from-28% via-accent/20 via-70% to-accent/30',
  }[variant]
  
  return (
    <div className="relative mx-auto max-w-7xl">
      <div
        className={clsx(
          'absolute -top-44 -right-60 h-60 w-xl transform-gpu md:right-0',
          gradientClass,
          'rotate-[-10deg] rounded-full blur-3xl',
        )}
      />
    </div>
  )
}

/**
 * Utility to convert hex colors to CSS variables when needed
 */
export function hexToThemeVar(hexColor: string): string {
  // Map common radiant-ts hex colors to OdisAI theme variables
  const colorMap: Record<string, string> = {
    '#fff1be': 'hsl(var(--muted))',
    '#ee87cb': 'hsl(var(--accent))',
    '#b060ff': 'hsl(var(--primary))',
    '#D15052': 'hsl(var(--destructive))',
    // Add more mappings as needed
  }
  
  return colorMap[hexColor] || hexColor
}

/**
 * Theme-aware utility for conditional classes
 */
export function themeAwareClsx(...classes: Parameters<typeof clsx>) {
  return applyThemeClasses(clsx(...classes))
}