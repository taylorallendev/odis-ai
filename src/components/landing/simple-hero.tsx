import { clsx } from "clsx";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/src/components/ui/button";
import { Container } from "@/src/components/ui/container";
import { Badge } from "@/src/components/ui/badge";
import { ArrowRight, Stethoscope, Play } from "lucide-react";

// Enhanced OdisAI veterinary-themed gradient with better visual depth
function EnhancedGradient({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      {...props}
      className={clsx(
        className,
        "bg-gradient-to-br from-teal-50/90 via-blue-50/60 to-emerald-50/90 backdrop-blur-sm",
        "relative overflow-hidden"
      )}
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
      <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
      {/* Floating elements for visual interest */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-teal-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-200/20 rounded-full blur-3xl" />
    </div>
  );
}

// Enhanced navbar component with better styling
function EnhancedNavbar() {
  const links = [
    { href: "#features", label: "Features" },
    { href: "#testimonials", label: "Success Stories" },
    { href: "#pricing", label: "Pricing" },
    { href: "/sign-in", label: "Login" },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="pt-8 sm:pt-10 relative z-10"
    >
      <div className="relative flex justify-between items-center">
        <div className="relative flex gap-6">
          <motion.div whileHover={{ scale: 1.05 }} className="py-3">
            <Link
              href="/"
              title="Home"
              className="flex items-center gap-3 group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-950 to-gray-700 bg-clip-text text-transparent">
                OdisAI
              </span>
            </Link>
          </motion.div>
        </div>
        <nav className="relative hidden lg:flex items-center gap-1">
          {links.map(({ href, label }, index) => (
            <motion.div
              key={href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              className="relative flex"
            >
              {href === "/sign-in" ? (
                <Button asChild variant="outline" size="sm" className="ml-4">
                  <Link href={href}>{label}</Link>
                </Button>
              ) : (
                <Link
                  href={href}
                  className="flex items-center px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-950 hover:bg-white/60 rounded-lg transition-all duration-200"
                >
                  {label}
                </Link>
              )}
            </motion.div>
          ))}
        </nav>
      </div>
    </motion.nav>
  );
}

// Enhanced hero component with optimized positioning to reduce excessive top spacing
function SimpleHero() {
  return (
    <div className="relative min-h-screen flex items-start px-6 sm:px-12 lg:px-16 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50/30" />

      <Container className="relative max-w-7xl mx-auto w-full">
        <EnhancedNavbar />

        {/* Hero Content Card - Optimized spacing to position content higher */}
        <div className="mt-6 sm:mt-8 md:mt-10 relative">
          <EnhancedGradient className="absolute inset-0 rounded-3xl ring-1 ring-teal-100/50 ring-inset shadow-2xl" />
          {/* Main Content - Reduced top padding to move content higher */}
          <div className="relative pt-12 pb-24 sm:pt-16 sm:pb-28 md:pt-20 md:pb-32 lg:pt-24 lg:pb-36 px-8 sm:px-12 lg:px-16 xl:px-20">
            <div className="max-w-5xl mx-auto text-center">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-8"
              ></motion.div>

              {/* Main Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="font-display text-5xl/[0.9] font-bold tracking-tight text-balance bg-gradient-to-r from-gray-950 via-gray-800 to-gray-950 bg-clip-text text-transparent sm:text-6xl/[0.9] md:text-7xl/[0.9] lg:text-8xl/[0.9]"
              >
                Stop drowning in paperwork.
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="mt-8 max-w-3xl mx-auto text-lg/7 font-medium text-gray-600 sm:text-xl/8 md:text-2xl/9"
              >
                OdisAI eliminates{" "}
                <span className="font-semibold text-teal-600">
                  3+ hours of daily documentation
                </span>
                , generates perfect SOAP notes in seconds, and gives you back
                the time to actually care for animals.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="mt-12 flex flex-col gap-4 sm:flex-row sm:gap-6 justify-center items-center"
              >
                <Button
                  asChild
                  size="lg"
                  className="group relative inline-flex items-center justify-center px-8 py-4 rounded-full bg-gradient-to-r from-teal-600 to-blue-600 text-white font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  <Link href="/sign-up">
                    Start Saving Time Now
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="group relative inline-flex items-center justify-center px-8 py-4 rounded-full border-2 border-gray-300 bg-white/80 backdrop-blur-sm text-gray-700 font-semibold shadow-lg hover:shadow-xl hover:border-teal-400 hover:bg-white hover:scale-105 transition-all duration-300"
                >
                  <Link href="#pricing">
                    <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                    See Live Demo
                  </Link>
                </Button>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
                className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-500"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                  <span>Free 14-day trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                  <span>Setup in 15 minutes</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export { SimpleHero };
