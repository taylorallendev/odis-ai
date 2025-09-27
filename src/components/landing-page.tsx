"use client";

import { BentoCard } from "@/src/components/radiant/bento-card";
import { Button } from "@/src/components/radiant/button";
import { Container } from "@/src/components/radiant/container";
import { Gradient } from "@/src/components/radiant/gradient";
import { Link } from "@/src/components/radiant/link";
import { Logo } from "@/src/components/radiant/logo";
import { Heading, Subheading } from "@/src/components/radiant/text";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import {
  ClockIcon,
  ChartBarIcon,
  HeartIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  Bars2Icon,
  XMarkIcon,
  ShieldCheckIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { AnimatedTestimonials } from "@/src/components/landing/animated-testimonials";
import { SoapNotesDemo } from "@/src/components/landing/soap-notes-demo";
import { motion } from "framer-motion";
import { useState } from "react";
import { clsx } from "clsx";

// Navbar Component
function Navbar({ banner }: { banner?: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const links = [
    { href: "#features", label: "Features" },
    { href: "#testimonials", label: "Testimonials" },
    { href: "#pricing", label: "Pricing" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <header className="relative pt-12 sm:pt-16">
      <Container>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center">
              <Logo className="h-9" />
            </Link>
            {banner && (
              <div className="hidden lg:flex items-center">{banner}</div>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-base font-medium text-foreground hover:text-primary transition-colors"
              >
                {label}
              </Link>
            ))}

            {/* Divider */}
            <div className="h-6 w-px bg-border" />

            {/* Auth Links */}
            <Link
              href="/sign-in"
              className="text-base font-medium text-foreground hover:text-primary transition-colors"
            >
              Login
            </Link>
            <Button href="/sign-up">Get Started</Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-muted-foreground hover:text-primary"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars2Icon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4">
            <div className="flex flex-col gap-4">
              {links.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-base font-medium text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}
              <div className="pt-4 border-t border-border">
                <Link
                  href="/sign-in"
                  className="block text-base font-medium text-foreground hover:text-primary transition-colors mb-3"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Button href="/sign-up" className="w-full">
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}

// Hero Section with Enhanced Teal Design
function Hero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-white/80 via-primary/5 to-accent/8 backdrop-blur-sm">
      {/* Enhanced teal gradient background with container margins */}
      <Gradient className="absolute inset-4 lg:inset-8 xl:inset-12 bottom-0 rounded-4xl ring-1 ring-primary/20 ring-inset bg-gradient-to-br from-primary/8 via-accent/5 to-secondary/8" />
      {/* Floating teal elements - repositioned for narrower layout */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-primary/15 to-accent/15 rounded-full blur-3xl animate-pulse opacity-70" />
      <div
        className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-bl from-secondary/12 to-primary/12 rounded-full blur-3xl animate-pulse opacity-60"
        style={{ animationDelay: "2s" }}
      />
      <Container className="relative z-10">
        <Navbar />
        <div className="pt-16 pb-24 sm:pt-24 sm:pb-32 md:pt-32 md:pb-48">
          <motion.h1
            className="font-display text-5xl/[0.9] font-medium tracking-tight text-balance text-foreground sm:text-7xl/[0.8] md:text-8xl/[0.8] max-w-4xl mx-auto text-center lg:text-left lg:mx-0"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Stop drowning
            </span>{" "}
            in paperwork.
          </motion.h1>
          <motion.p
            className="mt-8 max-w-2xl text-xl/7 font-medium text-muted-foreground sm:text-2xl/8 mx-auto text-center lg:text-left lg:mx-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            OdisAI eliminates 3+ hours of daily documentation, generates perfect
            SOAP notes in seconds, and gives you back the time to actually care
            for animals.
          </motion.p>
          <motion.div
            className="mt-12 flex flex-col gap-x-6 gap-y-4 sm:flex-row justify-center lg:justify-start max-w-lg mx-auto lg:mx-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              href="/sign-up"
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-veterinary-medium px-8"
            >
              Start Saving Time Now
            </Button>
            <Button
              variant="secondary"
              href="#features"
              className="border-primary/30 hover:border-primary/50 hover:bg-primary/5 px-8"
            >
              See Live Demo
            </Button>
          </motion.div>
        </div>
      </Container>
    </div>
  );
}

// Trust Signals with Enhanced Teal Design
function TrustSignals() {
  const trustItems = [
    { text: "HIPAA Compliant", color: "bg-success", icon: ShieldCheckIcon },
    {
      text: "SOC 2 Type II Certified",
      color: "bg-primary",
      icon: CheckCircleIcon,
    },
    { text: "99.9% Uptime SLA", color: "bg-accent", icon: ClockIcon },
    {
      text: "500+ Practices Trust OdisAI",
      color: "bg-secondary",
      icon: UserGroupIcon,
    },
  ];

  return (
    <Container className="py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center max-w-4xl mx-auto">
        {trustItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <motion.div
              key={index}
              className="flex flex-col items-center gap-3 p-4 rounded-xl bg-card border border-primary/10 shadow-veterinary-soft hover:shadow-veterinary-medium transition-all duration-300 hover:border-primary/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div
                className={`w-10 h-10 ${item.color} rounded-full flex items-center justify-center`}
              >
                <IconComponent className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium text-foreground">
                {item.text}
              </span>
            </motion.div>
          );
        })}
      </div>
    </Container>
  );
}

// Feature Section
function FeatureSection() {
  return (
    <div className="overflow-hidden">
      <Container className="pb-24">
        <Subheading>AI-Powered Features</Subheading>
        <Heading as="h2" className="max-w-3xl">
          Perfect SOAP Notes, Generated Instantly
        </Heading>
        <p className="mt-6 max-w-3xl text-xl/8 text-muted-foreground">
          From voice to complete medical records in seconds. Watch as your
          spoken exam becomes a comprehensive SOAP note with diagnosis
          suggestions included.
        </p>
        {/* Interactive SOAP Notes Demo - Narrower and more focused */}
        <div className="mt-16 flex justify-center px-8">
          <motion.div
            className="w-full max-w-3xl bg-gradient-to-br from-white/80 via-primary/8 to-accent/12 backdrop-blur-md rounded-3xl border border-primary/30 shadow-veterinary-strong relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            {/* Enhanced gradient overlay for the demo card */}
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-emerald-500/5 to-cyan-500/8 rounded-3xl pointer-events-none" />
            <div className="relative z-10">
              <SoapNotesDemo />
            </div>
          </motion.div>
        </div>
      </Container>
    </div>
  );
}

// Bento Section
function BentoSection() {
  return (
    <Container>
      <Subheading>Core Features</Subheading>
      <Heading as="h3" className="mt-2 max-w-3xl">
        Reclaim 10+ Hours Per Week with Intelligent Practice Management
      </Heading>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:mt-16 lg:grid-cols-6 lg:grid-rows-2 max-w-5xl mx-auto px-4">
        <BentoCard
          eyebrow="Time Saving"
          title="Generate Complete SOAP Notes in Under 3 Minutes"
          description="Stop staying late to finish charts. Our AI listens to your exam, understands veterinary terminology, and creates comprehensive SOAP notes while you work. No more racing against the clock."
          graphic={
            <div className="flex size-full items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl" />
              <ClockIcon className="h-24 w-24 text-primary relative z-10" />
            </div>
          }
          fade={["bottom"]}
          className="max-lg:rounded-t-4xl lg:col-span-3 lg:rounded-tl-4xl border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5"
        />
        <BentoCard
          eyebrow="Clinical Support"
          title="AI-Powered Clinical Decision Support That Actually Helps"
          description="Get intelligent differential diagnosis suggestions based on your transcribed findings. Reduce diagnostic uncertainty, catch overlooked possibilities, and practice with greater confidence."
          graphic={
            <div className="flex size-full items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-full blur-3xl" />
              <ChartBarIcon className="h-24 w-24 text-secondary relative z-10" />
            </div>
          }
          fade={["bottom"]}
          className="lg:col-span-3 lg:rounded-tr-4xl border-secondary/20 bg-gradient-to-br from-secondary/5 to-primary/5"
        />
        <BentoCard
          eyebrow="Accuracy"
          title="Never Miss Critical Details Again"
          description="Capture every symptom, observation, and client concern automatically. Our veterinary-trained AI transcription catches nuances you might miss while focusing on the patient."
          graphic={
            <div className="flex size-full items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-success/20 to-accent/20 rounded-full blur-3xl" />
              <DocumentTextIcon className="h-24 w-24 text-success relative z-10" />
            </div>
          }
          className="lg:col-span-2 lg:rounded-bl-4xl border-success/20 bg-gradient-to-br from-success/5 to-accent/5"
        />
        <BentoCard
          eyebrow="Communication"
          title="Automated Client Communication"
          description="Transform difficult conversations into trust-building moments with auto-generated compassionate, clear client communications and discharge instructions."
          graphic={
            <div className="flex size-full items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full blur-3xl" />
              <EnvelopeIcon className="h-24 w-24 text-accent relative z-10" />
            </div>
          }
          className="lg:col-span-2 border-accent/20 bg-gradient-to-br from-accent/5 to-primary/5"
        />
        <BentoCard
          eyebrow="Patient Care"
          title="Focus on What You Became a Vet For"
          description="Spend less time on screens and more time with patients. Our AI handles documentation seamlessly so you can get back to caring for animals."
          graphic={
            <div className="flex size-full items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-warm-accent/20 to-primary/20 rounded-full blur-3xl" />
              <HeartIcon className="h-24 w-24 text-warm-accent relative z-10" />
            </div>
          }
          className="max-lg:rounded-b-4xl lg:col-span-2 lg:rounded-br-4xl border-warm-accent/20 bg-gradient-to-br from-warm-accent/5 to-primary/5"
        />
      </div>
    </Container>
  );
}

// Testimonials Section
function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        "I was spending 4+ hours every evening finishing charts. Now I leave the clinic when my last patient does. OdisAI gave me my life back. The diagnosis suggestions actually show up during the appointment, so I rarely need to touch the note afterward.",
      name: "Dr. Deepti Pal",
      designation:
        "Small Animal Veterinarian • Reduced documentation time from 4 hours to 15 minutes daily",
      src: "/images/testimonials/vet-1.jpg",
    },
    {
      quote:
        "My diagnostic accuracy improved dramatically. The AI catches patterns I might miss during busy days and suggests differentials I hadn't considered. I walk into every room already knowing what I need to focus on.",
      name: "Dr. Tais Perpetuo",
      designation:
        "Emergency Veterinarian • Increased diagnostic confidence in 89% of complex cases",
      src: "/images/testimonials/vet-2.jpg",
    },
    {
      quote:
        "Client compliance is up 40% since we started using OdisAI's automated discharge instructions. Families actually understand and follow through now. It's made our practice look more professional and organized.",
      name: "Jennifer Martinez",
      designation:
        "Practice Manager • Improved treatment compliance from 52% to 73%",
      src: "/images/testimonials/vet-3.jpg",
    },
  ];

  return (
    <section
      id="testimonials"
      className="py-24 bg-gradient-to-b from-white/70 via-primary/5 to-accent/8 backdrop-blur-sm relative overflow-hidden"
    >
      {/* Testimonials section gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-50/50 via-emerald-50/30 to-cyan-50/40 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-gradient-to-bl from-accent/8 to-transparent rounded-full blur-3xl opacity-60 pointer-events-none" />

      <Container className="relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <Subheading>Testimonials</Subheading>
          <Heading as="h2" className="mt-2">
            Trusted by 500+ Veterinary Practices
          </Heading>
          <p className="mt-6 text-xl/8 text-muted-foreground max-w-3xl mx-auto">
            Real veterinarians, real results, real work-life balance restored.
            See how colleagues transformed their practices and reclaimed their
            time.
          </p>
        </div>
        <div className="mt-12 max-w-6xl mx-auto">
          <AnimatedTestimonials testimonials={testimonials} autoplay={true} />
        </div>
      </Container>
    </section>
  );
}

// Pricing Section
function PricingSection() {
  const plans = [
    {
      title: "Solo Practice",
      description: "Perfect for Solo Practitioners Ready to Reclaim Their Time",
      price: "Starting at $99/month",
      features: [
        "Save 2+ hours daily with AI-powered SOAP notes",
        "Real-time veterinary transcription",
        "Intelligent differential diagnosis suggestions",
        "Automated client communication",
        "Basic reporting & analytics",
        "Email support & free setup",
      ],
      buttonText: "Start Free Trial",
      popular: false,
    },
    {
      title: "Multi-Vet Practice",
      description: "Ideal for Growing Practices Serious About Efficiency",
      price: "Starting at $299/month",
      features: [
        "Everything in Solo Practice",
        "Save 10+ hours weekly per veterinarian",
        "Multi-user dashboard & collaboration",
        "Advanced case management",
        "Custom template creation",
        "Priority support with 1-hour response",
        "Practice performance insights & ROI tracking",
      ],
      buttonText: "Schedule Demo",
      popular: true,
    },
    {
      title: "Enterprise",
      description: "Built for Multi-Doctor Clinics Focused on Scale",
      price: "Custom Pricing",
      features: [
        "Everything in Multi-Vet Practice",
        "Save $50,000+ annually in documentation costs",
        "Custom integrations with existing systems",
        "Advanced security & HIPAA compliance",
        "Dedicated account manager",
        "24/7 phone support & training",
        "API access & white-label options",
      ],
      buttonText: "Contact Sales",
      popular: false,
    },
  ];

  return (
    <section
      id="pricing"
      className="mx-2 mt-2 rounded-4xl bg-gradient-to-br from-primary/95 via-secondary/90 to-accent/85 py-32 relative overflow-hidden"
    >
      {/* Decorative teal elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-accent/20 to-transparent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      <Container>
        <Subheading dark>Pricing</Subheading>
        <Heading as="h3" dark className="mt-2 max-w-3xl">
          Plans That Pay for Themselves in Time Saved
        </Heading>
        <p className="mt-6 max-w-3xl text-xl/8 text-white/80">
          Every plan saves you hours daily and pays for itself through increased
          efficiency and reduced overtime. Choose what works for your practice
          size.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:mt-16 lg:grid-cols-3 max-w-5xl mx-auto px-4">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={clsx(
                "relative rounded-3xl bg-white/10 backdrop-blur-md p-8 ring-1 ring-white/20 shadow-veterinary-strong transition-all duration-300 hover:bg-white/15 hover:scale-102",
                plan.popular && "ring-2 ring-accent scale-105 bg-white/15"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-accent to-primary text-white px-4 py-2 rounded-full text-sm font-medium shadow-veterinary-medium">
                    Most Popular
                  </span>
                </div>
              )}
              <h3 className="text-2xl font-semibold text-white">
                {plan.title}
              </h3>
              <p className="mt-2 text-white/70">{plan.description}</p>
              <p className="mt-6 text-3xl font-bold text-white">{plan.price}</p>
              <ul className="mt-8 space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <li
                    key={featureIndex}
                    className="flex items-start gap-3 text-white/80"
                  >
                    <CheckCircleIcon className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="mt-8 w-full"
                variant={plan.popular ? "accent" : "secondary"}
                href="/sign-up"
              >
                {plan.buttonText}
              </Button>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

// CTA Section
function CallToActionSection() {
  return (
    <Container className="py-32">
      <div className="text-center max-w-4xl mx-auto">
        <Heading as="h2" className="mx-auto">
          Ready to Stop Working Nights and Weekends?
        </Heading>
        <p className="mt-6 max-w-3xl mx-auto text-xl/8 text-muted-foreground">
          Join 500+ veterinary practices who've eliminated documentation stress
          and rediscovered why they love practicing medicine. Transform your
          workflow in 24 hours.
        </p>
        <div className="mt-12 flex flex-col gap-x-6 gap-y-4 sm:flex-row justify-center max-w-lg mx-auto">
          <Button href="/sign-up" className="px-8">
            Start Saving Time Now
          </Button>
          <Button variant="secondary" href="#contact" className="px-8">
            See Live Demo
          </Button>
        </div>
      </div>
    </Container>
  );
}

// Contact Section
function ContactSection() {
  return (
    <section
      id="contact"
      className="bg-gradient-to-b from-white/80 via-muted/30 to-primary/8 py-32 relative overflow-hidden"
    >
      {/* Contact section gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-50/40 via-emerald-50/20 to-cyan-50/30 pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-gradient-to-tr from-primary/8 to-transparent rounded-full blur-3xl opacity-50 pointer-events-none" />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-5xl mx-auto">
          <div className="text-center lg:text-left">
            <Heading as="h2">Ready to Get Your Life Back?</Heading>
            <p className="mt-6 text-xl/8 text-muted-foreground max-w-2xl mx-auto lg:mx-0">
              See how much time you could save. Our team will show you exactly
              how OdisAI can transform your practice workflow in a personalized
              demo.
            </p>

            <div className="mt-8 space-y-4 max-w-md mx-auto lg:mx-0">
              <motion.div
                className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10 hover:border-primary/20 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
              >
                <div className="rounded-full bg-gradient-to-br from-primary to-accent p-3 shadow-veterinary-soft">
                  <EnvelopeIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Email</p>
                  <p className="text-muted-foreground">info@odisai.net</p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-secondary/5 to-primary/5 border border-secondary/10 hover:border-secondary/20 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
              >
                <div className="rounded-full bg-gradient-to-br from-secondary to-primary p-3 shadow-veterinary-soft">
                  <PhoneIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Phone</p>
                  <p className="text-muted-foreground">+1 (800) 123-4567</p>
                </div>
              </motion.div>
            </div>
          </div>

          <motion.div
            className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-veterinary-strong border border-primary/20 relative overflow-hidden max-w-lg mx-auto lg:mx-0"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Enhanced decorative teal gradient */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/20 via-accent/15 to-transparent rounded-bl-full" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-secondary/15 to-transparent rounded-tr-full" />
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50 bg-background text-foreground transition-all duration-200 hover:border-primary/30"
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50 bg-background text-foreground transition-all duration-200 hover:border-primary/30"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50 bg-background text-foreground transition-all duration-200 hover:border-primary/30"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label
                  htmlFor="practice"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Practice Name
                </label>
                <input
                  id="practice"
                  type="text"
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50 bg-background text-foreground transition-all duration-200 hover:border-primary/30"
                  placeholder="Enter your practice name"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50 bg-background text-foreground transition-all duration-200 hover:border-primary/30"
                  placeholder="Tell us about your practice and how we can help"
                />
              </div>

              <Button type="submit" className="w-full">
                Get Personal Demo
              </Button>
            </form>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

// Footer Component
function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-gradient-to-b from-card via-card/90 to-primary/5 py-12 relative overflow-hidden">
      {/* Footer gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-50/20 to-emerald-50/10 pointer-events-none" />

      <Container className="relative z-10">
        <div className="grid gap-8 md:grid-cols-4 max-w-5xl mx-auto">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <Logo className="mb-4" />
            <p className="text-muted-foreground max-w-md">
              AI-powered veterinary practice management that eliminates
              documentation burden, saves hours daily, and helps you focus on
              caring for animals.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#features"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#pricing"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/sign-up"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Get Started
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#contact"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-8 pt-8 border-t border-border max-w-4xl mx-auto w-full">
          <div className="text-sm text-muted-foreground">
            © {currentYear} OdisAI. All rights reserved.
          </div>
          <div className="flex gap-6">
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}

// Main Landing Page Component
export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/8 overflow-hidden relative">
      {/* Page-wide gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-teal-50/30 to-emerald-50/20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/3 to-transparent opacity-50 pointer-events-none" />

      {/* Ambient teal lighting effects */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-primary/15 to-accent/10 rounded-full blur-3xl opacity-60 animate-pulse pointer-events-none" />
      <div
        className="absolute top-1/3 right-20 w-80 h-80 bg-gradient-to-bl from-secondary/12 to-primary/8 rounded-full blur-3xl opacity-50 animate-pulse pointer-events-none"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-gradient-to-tr from-accent/10 to-secondary/8 rounded-full blur-3xl opacity-40 animate-pulse pointer-events-none"
        style={{ animationDelay: "2s" }}
      />

      {/* Content with relative positioning */}
      <div className="relative z-10">
        <Hero />
        <TrustSignals />
        <main>
          <div className="bg-gradient-to-b from-white/60 via-primary/8 to-accent/12 backdrop-blur-sm py-32 relative overflow-hidden">
            {/* Section-specific gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-emerald-500/3 to-cyan-500/5 pointer-events-none" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-accent/8 to-transparent rounded-full blur-3xl opacity-70 pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tl from-primary/8 to-transparent rounded-full blur-3xl opacity-70 pointer-events-none" />

            <div className="relative z-10">
              <FeatureSection />
              <BentoSection />
            </div>
          </div>
          <TestimonialsSection />
          <PricingSection />
          <CallToActionSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </div>
  );
}
