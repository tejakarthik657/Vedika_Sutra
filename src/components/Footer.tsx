"use client";

import Link from 'next/link';

export default function Footer() {
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navigationLinks = [
    { href: '#hero', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#services', label: 'Services' },
    { href: '#gallery', label: 'Gallery' },
    { href: '#testimonials', label: 'Testimonials' },
    { href: '#contact', label: 'Contact' },
  ];

  return (
    <footer className="border-t border-border/50 bg-muted/30 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col space-y-6 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          {/* Brand Section */}
          <div className="flex flex-col space-y-2 lg:flex-row lg:items-center lg:space-x-6 lg:space-y-0">
            <div className="flex items-center space-x-3">
              <img
                src="/assets/logo.png"
                alt="Vedika Sutra Logo"
                className="h-8 w-8 rounded-full object-cover border border-primary"
              />
              <div>
                <h3 className="text-sm font-heading font-semibold text-foreground">
                  Vedika Sutra
                </h3>
                <p className="text-xs text-muted-foreground">
                  Creating unforgettable moments
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => handleSmoothScroll(e, link.href)}
                className="text-sm text-muted-foreground transition-colors duration-200 hover:text-primary focus:text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 focus:ring-offset-background rounded-sm px-1 py-0.5"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Copyright */}
          <div className="text-xs text-muted-foreground">
            © 2025 Vedika Sutra Event Management. All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}