'use client'

/**
 * Hero Section adapted for OdisAI
 * 
 * Professional medical hero section combining modern design patterns
 * with OdisAI's veterinary practice management messaging and theme.
 */

import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { RadiantGradient } from './radiant-gradient'
import { RadiantContainer } from './radiant-plus-grid'
import { Navbar } from './navbar'
import { RadiantStyledButton } from './radiant-button'
import { themeAwareClsx } from './radiant-theme-bridge'

export function HeroSection({
  showNavbar = true,
  banner,
  title = "Transform Your Veterinary Practice",
  subtitle = "OdisAI provides AI-powered documentation, differential diagnosis suggestions, and workflow automation to help veterinary professionals save time and improve patient care.",
  primaryCTA = "Get Started",
  secondaryCTA = "See Pricing",
  primaryHref = "/sign-up",
  secondaryHref = "/pricing"
}: {
  showNavbar?: boolean
  banner?: React.ReactNode
  title?: string
  subtitle?: string
  primaryCTA?: string
  secondaryCTA?: string
  primaryHref?: string
  secondaryHref?: string
}) {
  const defaultBanner = (
    <Link
      href="/blog/odis-ai-veterinary-innovation"
      className={themeAwareClsx(
        'flex items-center gap-1 rounded-full bg-primary/10 px-3 py-0.5 text-sm/6 font-medium text-primary hover:bg-primary/20 transition-colors'
      )}
    >
      Revolutionizing Veterinary Practice Management with AI
      <ChevronRight className="size-4" />
    </Link>
  )

  return (
    <div className="relative">
      <RadiantGradient 
        variant="primary" 
        className="absolute inset-2 bottom-0 rounded-4xl ring-1 ring-border/20 ring-inset" 
      />
      <RadiantContainer className="relative">
        {showNavbar && (
          <Navbar
            banner={banner || defaultBanner}
          />
        )}
        <div className="pt-16 pb-24 sm:pt-24 sm:pb-32 md:pt-32 md:pb-48">
          <h1 className={themeAwareClsx(
            'font-display text-6xl/[0.9] font-medium tracking-tight text-balance text-foreground sm:text-8xl/[0.8] md:text-9xl/[0.8]'
          )}>
            {title}
          </h1>
          <p className={themeAwareClsx(
            'mt-8 max-w-lg text-xl/7 font-medium text-muted-foreground sm:text-2xl/8'
          )}>
            {subtitle}
          </p>
          <div className="mt-12 flex flex-col gap-x-6 gap-y-4 sm:flex-row">
            <RadiantStyledButton 
              variant="primary" 
              href={primaryHref}
            >
              {primaryCTA}
            </RadiantStyledButton>
            <RadiantStyledButton 
              variant="secondary" 
              href={secondaryHref}
            >
              {secondaryCTA}
            </RadiantStyledButton>
          </div>
        </div>
      </RadiantContainer>
    </div>
  )
}

// Medical-focused hero variant
export function MedicalHero({
  showNavbar = true,
  badge = "AI-Powered Veterinary Assistant",
  title = "Focus on Care, Not Paperwork",
  subtitle = "Transform your veterinary practice with AI that understands animal health. Generate SOAP notes, get differential diagnosis suggestions, and automate documentation.",
  features = [
    "Real-time transcription during appointments",
    "AI-powered differential diagnosis suggestions",
    "Automated SOAP note generation",
    "Pre-appointment patient summaries"
  ]
}: {
  showNavbar?: boolean
  badge?: string
  title?: string
  subtitle?: string
  features?: string[]
}) {
  return (
    <div className="relative">
      <RadiantGradient 
        variant="accent" 
        className="absolute inset-2 bottom-0 rounded-4xl ring-1 ring-border/20 ring-inset" 
      />
      <RadiantContainer className="relative">
        {showNavbar && <Navbar />}
        
        <div className="pt-16 pb-24 sm:pt-24 sm:pb-32 md:pt-32 md:pb-48">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent ring-1 ring-accent/20">
              {badge}
            </div>
          </div>
          
          {/* Main Title */}
          <h1 className="text-center font-display text-6xl/[0.9] font-medium tracking-tight text-balance text-foreground sm:text-8xl/[0.8] md:text-9xl/[0.8]">
            {title}
          </h1>
          
          {/* Subtitle */}
          <p className="mt-8 text-center max-w-3xl mx-auto text-xl/7 font-medium text-muted-foreground sm:text-2xl/8">
            {subtitle}
          </p>
          
          {/* CTA Buttons */}
          <div className="mt-12 flex flex-col gap-x-6 gap-y-4 sm:flex-row justify-center">
            <RadiantStyledButton variant="primary" href="/sign-up">
              Start Free Trial
            </RadiantStyledButton>
            <RadiantStyledButton variant="outline" href="/demo">
              Watch Demo
            </RadiantStyledButton>
          </div>
          
          {/* Feature List */}
          <div className="mt-16 max-w-2xl mx-auto">
            <h3 className="text-center text-lg font-semibold text-foreground mb-6">
              Everything you need for modern veterinary practice:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full" />
                  <span className="text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </RadiantContainer>
    </div>
  )
}