/**
 * Landing Page Components adapted from Radiant-TS with conventional naming
 * 
 * This module exports all the adapted radiant-ts components that work
 * seamlessly with OdisAI's medical-grade theme and CSS variables.
 * 
 * Key Features:
 * - Professional medical color palette (teal-based)
 * - CSS variable integration for consistent theming
 * - Dark mode support
 * - Accessibility compliance
 * - Veterinary practice-focused messaging
 */

// Core theme system
export { 
  themeMapping, 
  applyThemeClasses, 
  MedicalGradient, 
  MedicalGradientBackground, 
  hexToThemeVar, 
  themeAwareClsx 
} from './theme-bridge'

// Layout components
export { 
  Gradient, 
  GradientBackground 
} from './gradient'

export { 
  PlusGrid, 
  PlusGridItem, 
  PlusGridRow, 
  GridContainer 
} from './plus-grid'

// UI components
export { StyledButton } from './button'

export { 
  Heading, 
  Subheading, 
  Lead, 
  MedicalHeading, 
  MedicalSubheading 
} from './text'

export { 
  BentoCard, 
  MedicalBentoCard 
} from './bento-card'

// Layout components
export { Navbar } from './navbar'

export { 
  Hero, 
  MedicalHero 
} from './hero'

// Type definitions for components
export type ThemeVariant = 'primary' | 'secondary' | 'accent' | 'muted'
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'medical'
export type TextVariant = 'primary' | 'accent' | 'default'

/**
 * Usage Examples:
 * 
 * // Basic gradient background
 * <Gradient variant="primary" className="rounded-lg p-8">
 *   <h1>Medical Content</h1>
 * </Gradient>
 * 
 * // Professional button with medical styling
 * <StyledButton variant="medical" href="/appointment">
 *   Book Appointment
 * </StyledButton>
 * 
 * // Themed bento card for features
 * <BentoCard
 *   eyebrow="AI-Powered"
 *   title="SOAP Notes"
 *   description="Generate comprehensive medical notes automatically"
 *   graphic={<SoapNotesDemo />}
 * />
 * 
 * // Medical hero section
 * <MedicalHero
 *   title="Transform Your Veterinary Practice"
 *   subtitle="AI-powered tools for modern veterinary care"
 * />
 */