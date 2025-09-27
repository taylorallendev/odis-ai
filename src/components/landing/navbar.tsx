'use client'

/**
 * Navbar Component adapted for OdisAI Theme
 * 
 * Professional medical navigation with OdisAI branding and theme colors
 */

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Stethoscope, Menu } from 'lucide-react'
import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import { useState } from 'react'
import { themeAwareClsx } from './radiant-theme-bridge'
import { RadiantContainer } from './radiant-plus-grid'

const links = [
  { href: '/features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/sign-in', label: 'Login' },
]

function DesktopNav() {
  return (
    <nav className="relative hidden lg:flex items-center gap-1">
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={themeAwareClsx(
            'flex items-center px-4 py-3 text-base font-medium text-foreground bg-blend-multiply hover:bg-primary/5 transition-colors rounded-lg'
          )}
        >
          {label}
        </Link>
      ))}
    </nav>
  )
}

function MobileNavButton({ 
  isOpen, 
  setIsOpen 
}: { 
  isOpen: boolean
  setIsOpen: (open: boolean) => void 
}) {
  return (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className={themeAwareClsx(
        'flex size-12 items-center justify-center self-center rounded-lg hover:bg-primary/10 lg:hidden transition-colors'
      )}
      aria-label="Open main menu"
    >
      <Menu className="size-6" />
    </button>
  )
}

function MobileNav({ 
  isOpen, 
  setIsOpen 
}: { 
  isOpen: boolean
  setIsOpen: (open: boolean) => void 
}) {
  if (!isOpen) return null
  
  return (
    <div className="lg:hidden">
      <div className="flex flex-col gap-6 py-4">
        {links.map(({ href, label }, linkIndex) => (
          <motion.div
            initial={{ opacity: 0, rotateX: -90 }}
            animate={{ opacity: 1, rotateX: 0 }}
            transition={{
              duration: 0.15,
              ease: 'easeInOut',
              rotateX: { duration: 0.3, delay: linkIndex * 0.1 },
            }}
            key={href}
          >
            <Link 
              href={href} 
              className="text-base font-medium text-foreground hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {label}
            </Link>
          </motion.div>
        ))}
      </div>
      <div className="absolute left-1/2 w-screen -translate-x-1/2">
        <div className="absolute inset-x-0 top-0 border-t border-border/50" />
        <div className="absolute inset-x-0 top-2 border-t border-border/20" />
      </div>
    </div>
  )
}

// OdisAI Logo Component
function OdisLogo({ className }: { className?: string }) {
  return (
    <div className={themeAwareClsx(className, 'flex items-center gap-2')}>
      <Stethoscope className="h-8 w-8 text-primary" />
      <span className="text-2xl font-bold text-foreground">
        OdisAI
      </span>
    </div>
  )
}

export function Navbar({ 
  banner,
  showBranding = true 
}: { 
  banner?: React.ReactNode
  showBranding?: boolean
}) {
  const [mobileOpen, setMobileOpen] = useState(false)
  
  return (
    <header className="pt-12 sm:pt-16">
      <RadiantContainer>
        <div className="relative flex justify-between items-center">
          <div className="relative flex gap-6 items-center">
            <div className="py-3">
              <Link href="/" title="OdisAI Home">
                {showBranding ? (
                  <OdisLogo className="h-9" />
                ) : (
                  <div className="h-9 w-32 bg-primary/20 rounded" />
                )}
              </Link>
            </div>
            {banner && (
              <div className="relative hidden items-center py-3 lg:flex">
                {banner}
              </div>
            )}
          </div>
          <DesktopNav />
          <MobileNavButton isOpen={mobileOpen} setIsOpen={setMobileOpen} />
        </div>
      </RadiantContainer>
      <MobileNav isOpen={mobileOpen} setIsOpen={setMobileOpen} />
    </header>
  )
}