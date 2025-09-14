"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutSection() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), 200);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className={`py-16 lg:py-24 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Bringing Your Celebrations to Life.
          </h2>
          <div className="w-16 h-0.5 mx-auto" style={{ backgroundColor: '#D8AFA7' }}></div>
        </div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Column - Text Content */}
          <div className="space-y-6 order-2 lg:order-1">
            <div className="flex items-center gap-4 mb-6">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                style={{ backgroundColor: '#800020' }}
              >
                VS
              </div>
              <span className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
                Vedika Sutra
              </span>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-foreground leading-relaxed mb-6 font-sans">
                At Vedika Sutra Event Management, we believe that every celebration tells a unique story. 
                With over a decade of experience crafting unforgettable moments, we specialize in transforming 
                your vision into reality through meticulous planning, creative design, and flawless execution.
              </p>
              
              <p className="text-muted-foreground leading-relaxed font-sans">
                From intimate gatherings to grand celebrations, our dedicated team brings passion, 
                expertise, and attention to detail to every event. We don't just plan events – we create 
                experiences that resonate with your heart and leave lasting memories for you and your loved ones.
              </p>
            </div>

            {/* Expandable Philosophy Section */}
            <div className="mt-8">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="group flex items-center gap-2 text-lg font-semibold font-heading text-foreground hover:text-primary transition-colors duration-200"
                aria-expanded={isExpanded}
                aria-controls="philosophy-content"
              >
                Our Philosophy
                <span 
                  className={`inline-block transition-transform duration-200 ${
                    isExpanded ? 'rotate-90' : 'rotate-0'
                  }`}
                  style={{ color: '#D8AFA7' }}
                >
                  ›
                </span>
              </button>
              
              <div
                id="philosophy-content"
                className={`overflow-hidden transition-all duration-300 ease-out ${
                  isExpanded ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
                }`}
              >
                <Card className="bg-secondary border-border">
                  <CardContent className="p-6">
                    <p className="text-muted-foreground leading-relaxed font-sans">
                      We believe that the most beautiful celebrations come from understanding 
                      the essence of each moment. Our philosophy centers on creating authentic 
                      experiences that reflect your personality, values, and dreams. Every detail 
                      is thoughtfully considered, from the initial consultation to the final farewell.
                    </p>
                    <p className="text-muted-foreground leading-relaxed mt-4 font-sans">
                      We work as partners, not just vendors, ensuring that your event feels 
                      genuinely yours while exceeding your expectations in every way.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="order-1 lg:order-2">
            <Card className="overflow-hidden group cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src="https://i.pinimg.com/1200x/1c/0a/cf/1c0acfbaccd3d265fd88e0c879375e57.jpg"
                  alt="Vedika Sutra Event Management team crafting beautiful celebrations"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </Card>
          </div>
        </div>

        {/* Decorative accent */}
        <div className="flex justify-center mt-16">
          <div 
            className="w-24 h-1 rounded-full"
            style={{ backgroundColor: '#FFD700' }}
          />
        </div>
      </div>
    </section>
  );
}