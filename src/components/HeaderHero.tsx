"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

interface HeaderHeroProps {
  className?: string
}

export default function HeaderHero({ className }: HeaderHeroProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setIsScrolled(scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll)
    
    // Trigger fade-in animation
    const timer = setTimeout(() => setIsVisible(true), 100)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(timer)
    }
  }, [])

  const scrollToSection = (sectionId: string, isQuote = false) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      if (isQuote) {
        // Focus the contact form after scrolling
        setTimeout(() => {
          const contactForm = element.querySelector('form')
          if (contactForm) {
            contactForm.focus()
          }
        }, 1000)
      }
    }
    setIsMobileMenuOpen(false)
  }

  const scrollToServices = () => {
    scrollToSection('services')
  }

  const scrollIndicatorClick = () => {
    scrollToSection('about')
  }

  const navItems = [
    { label: 'Home', href: 'hero' },
    { label: 'About', href: 'about' },
    { label: 'Services', href: 'services' },
    { label: 'Gallery', href: 'gallery' },
    { label: 'Testimonials', href: 'testimonials' },
    { label: 'Contact', href: 'contact' }
  ]

  return (
  <header className={`relative min-h-screen ${className || ''}`}>
      {/* Navigation */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-background/95 backdrop-blur-md shadow-lg border-b border-border' 
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-3">
              {/* Logo Image */}
              <button
                onClick={() => scrollToSection('hero')}
                className="flex items-center gap-2 focus:outline-none"
                aria-label="Vedika Sutra home"
              >
                <img
                  src="/assets/logo.png"
                  alt="Vedika Sutra Logo"
                  className="w-10 h-10 rounded-full object-cover border border-primary"
                />
                <span className={`text-2xl font-heading font-bold transition-colors px-2 py-1 ${isScrolled ? 'text-black hover:text-primary' : 'text-white hover:text-primary'}`}>Vedika Sutra</span>
              </button>
              
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => scrollToSection(item.href)}
                  className={`transition-colors relative group focus:outline-none focus:ring-2 focus:ring-ring rounded-md px-3 py-2 ${isScrolled ? 'text-black hover:text-primary' : 'text-white hover:text-primary'}`}
                  aria-label={`Navigate to ${item.label}`}
                >
                  {item.label}
                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full group-hover:left-0" />
                </button>
              ))}
              <Button
                onClick={() => scrollToSection('contact', true)}
                className="bg-[#800020] hover:bg-[#800020]/90 text-white hover:ring-2 hover:ring-[#FFD700] hover:ring-offset-2 transition-all duration-300 focus:ring-[#FFD700]"
                aria-label="Get a quote"
              >
                Get a Quote
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Dialog open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="focus:ring-2 focus:ring-ring"
                    aria-label="Open menu"
                  >
                    <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                      <span className="w-full h-0.5 bg-current" />
                      <span className="w-full h-0.5 bg-current" />
                      <span className="w-full h-0.5 bg-current" />
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md w-full h-full max-h-screen p-0 border-0">
                  <div className="flex flex-col h-full bg-background">
                    <div className="p-6 border-b border-border">
                      <h2 className="text-2xl font-heading font-bold text-foreground">
                        Vedika Sutra
                      </h2>
                    </div>
                    <div className="flex-1 p-6">
                      <nav className="space-y-4">
                        {navItems.map((item) => (
                          <button
                            key={item.href}
                            onClick={() => scrollToSection(item.href)}
                            className="block w-full text-left text-lg text-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded-md p-3"
                            aria-label={`Navigate to ${item.label}`}
                          >
                            {item.label}
                          </button>
                        ))}
                        <div className="pt-4">
                          <Button
                            onClick={() => scrollToSection('contact', true)}
                            className="w-full bg-[#800020] hover:bg-[#800020]/90 text-white hover:ring-2 hover:ring-[#FFD700] hover:ring-offset-2 transition-all duration-300 focus:ring-[#FFD700]"
                            aria-label="Get a quote"
                          >
                            Get a Quote
                          </Button>
                        </div>
                      </nav>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video
            src="/assets/hero-video.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          {/* Overlay for clarity - reduced opacity for more video visibility */}
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Hero Content */}
        <div 
          className={`relative z-10 text-center px-6 transition-all duration-1000 ${
            isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
            Vedika Sutra
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl mb-4 text-white max-w-4xl mx-auto" style={{ fontFamily: 'Playfair Display, serif' }}>
            Weaving Your Moments into Beautiful Memories.
          </p>
          <p className="text-lg md:text-xl mb-12 text-white max-w-2xl mx-auto">
            Creating unforgettable experiences through meticulous planning and elegant execution
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={() => scrollToSection('contact')}
              size="lg"
              className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-black font-semibold px-8 py-6 text-lg hover:ring-2 hover:ring-[#800020] hover:ring-offset-2 transition-all duration-300 focus:ring-[#800020]"
              aria-label="Plan your dream event"
            >
              Plan Your Dream Event
            </Button>
            <Button
              onClick={scrollToServices}
              variant="outline"
              size="lg"
              className="border-2 border-foreground/20 text-foreground hover:bg-foreground hover:text-background px-8 py-6 text-lg transition-all duration-300 focus:ring-2 focus:ring-ring"
              aria-label="View our services"
            >
              Our Services
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <button
          onClick={scrollIndicatorClick}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 w-12 h-12 rounded-full border-2 border-foreground/30 flex items-center justify-center hover:bg-foreground/10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring animate-bounce"
          aria-label="Scroll to next section"
        >
          <div className="w-2 h-2 border-b-2 border-r-2 border-foreground transform rotate-45 translate-y-[-2px]" />
        </button>
      </div>
    </header>
  )
}