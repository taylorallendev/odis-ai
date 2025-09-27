/**
 * Design Utilities for OdisAI Landing Page
 * Helper functions for consistent styling and animations
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names with Tailwind CSS merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Animation variants for Framer Motion
 */
export const animationVariants = {
  // Fade in from bottom
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  
  // Fade in from top
  fadeInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  
  // Scale in
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  },
  
  // Slide in from left
  slideInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
  
  // Slide in from right
  slideInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
} as const;

/**
 * Common transition presets
 */
export const transitions = {
  fast: { duration: 0.15, ease: "easeOut" },
  normal: { duration: 0.3, ease: "easeOut" },
  slow: { duration: 0.5, ease: "easeOut" },
  spring: { type: "spring", stiffness: 300, damping: 30 },
  bouncy: { type: "spring", stiffness: 400, damping: 25 },
} as const;

/**
 * Staggered animation for lists
 */
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

/**
 * Hover animation presets
 */
export const hoverAnimations = {
  lift: {
    whileHover: { y: -2, scale: 1.02 },
    transition: transitions.fast,
  },
  scale: {
    whileHover: { scale: 1.05 },
    transition: transitions.fast,
  },
  glow: {
    whileHover: { 
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
      scale: 1.02,
    },
    transition: transitions.normal,
  },
} as const;

/**
 * Gradient background utilities
 */
export const gradients = {
  veterinary: "bg-gradient-to-br from-teal-50/90 via-blue-50/60 to-emerald-50/90",
  primary: "bg-gradient-to-r from-teal-600 to-blue-600",
  secondary: "bg-gradient-to-r from-blue-600 to-purple-600",
  accent: "bg-gradient-to-r from-emerald-500 to-teal-500",
  subtle: "bg-gradient-to-br from-gray-50 via-white to-blue-50/30",
  text: "bg-gradient-to-r from-gray-950 via-gray-800 to-gray-950",
} as const;

/**
 * Shadow utilities
 */
export const shadows = {
  card: "shadow-xl",
  cardHover: "shadow-2xl",
  button: "shadow-lg",
  buttonHover: "shadow-xl",
  floating: "shadow-2xl",
} as const;

/**
 * Border utilities
 */
export const borders = {
  card: "border border-gray-100/50",
  input: "border border-gray-300",
  focus: "focus:border-teal-400 focus:ring-2 focus:ring-teal-100",
  hover: "hover:border-teal-400",
} as const;

/**
 * Spacing utilities using 8-point grid
 */
export const spacing = {
  section: "py-24", // Major sections
  container: "py-20", // Standard containers
  card: "py-16", // Card content
  element: "py-12", // Individual elements
  tight: "py-8", // Tight spacing
  minimal: "py-4", // Minimal spacing
} as const;

/**
 * Typography utilities
 */
export const typography = {
  display: {
    large: "text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight",
    medium: "text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight",
    small: "text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight",
  },
  heading: {
    h1: "text-3xl md:text-4xl lg:text-5xl font-semibold",
    h2: "text-2xl md:text-3xl lg:text-4xl font-semibold",
    h3: "text-xl md:text-2xl lg:text-3xl font-semibold",
  },
  body: {
    large: "text-lg md:text-xl leading-relaxed",
    medium: "text-base md:text-lg leading-relaxed",
    small: "text-sm md:text-base leading-relaxed",
  },
} as const;

/**
 * Component size variants
 */
export const sizes = {
  button: {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl",
  },
  badge: {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base",
  },
  avatar: {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-20 h-20",
  },
} as const;

/**
 * Common component styles
 */
export const components = {
  card: cn(
    "bg-white rounded-2xl",
    shadows.card,
    borders.card,
    "backdrop-blur-sm"
  ),
  button: {
    primary: cn(
      "rounded-full font-semibold",
      "bg-gradient-to-r from-teal-600 to-blue-600",
      "text-white",
      shadows.button,
      "hover:shadow-xl hover:scale-105",
      "transition-all duration-300"
    ),
    secondary: cn(
      "rounded-full font-semibold",
      "border-2 border-gray-300",
      "bg-white/80 backdrop-blur-sm",
      "text-gray-700",
      shadows.button,
      "hover:shadow-xl hover:border-teal-400 hover:scale-105",
      "transition-all duration-300"
    ),
  },
  badge: cn(
    "rounded-full font-medium",
    "bg-white/80 backdrop-blur-sm",
    "border border-teal-200",
    "text-teal-700"
  ),
} as const;

/**
 * Layout utilities
 */
export const layout = {
  container: "max-w-7xl mx-auto px-6 sm:px-12 lg:px-16",
  section: "relative overflow-hidden",
  grid: {
    responsive: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",
    equal: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6",
  },
  flex: {
    center: "flex items-center justify-center",
    between: "flex items-center justify-between",
    col: "flex flex-col items-center",
  },
} as const;