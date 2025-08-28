"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Testimonial {
  id: number;
  text: string;
  name: string;
  event: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    text: "Vedika Sutra made our dream wedding come true! Every detail was perfect, from the floral arrangements to the seamless coordination. Our guests are still talking about how beautiful everything was.",
    name: "Priya S.",
    event: "Wedding",
    rating: 5
  },
  {
    id: 2,
    text: "The corporate event they organized for our company was absolutely flawless. Professional, creative, and within budget. I couldn't have asked for a better experience.",
    name: "Rajesh M.",
    event: "Corporate Event",
    rating: 5
  },
  {
    id: 3,
    text: "Our anniversary celebration was magical thanks to Vedika Sutra. They understood our vision perfectly and brought it to life with such elegance and attention to detail.",
    name: "Anjali & Vikram",
    event: "Anniversary",
    rating: 5
  },
  {
    id: 4,
    text: "From planning to execution, everything was handled with such professionalism. The team's creativity and dedication made our product launch event truly memorable.",
    name: "Sarah K.",
    event: "Product Launch",
    rating: 5
  }
];

export default function TestimonialsSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev + 1) % testimonials.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide(prev => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(nextSlide, 6000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, nextSlide]);

  // Handle mouse enter/leave for autoplay pause
  const handleMouseEnter = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsPlaying(true);
  }, []);

  // Touch handling for mobile swipe
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  }, [touchStart, touchEnd, nextSlide, prevSlide]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextSlide();
    }
  }, [nextSlide, prevSlide]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-sm ${
          i < rating ? 'text-accent' : 'text-muted-foreground/30'
        }`}
        aria-hidden="true"
      >
        ★
      </span>
    ));
  };

  return (
    <section className="w-full py-16 md:py-24 bg-background" id="testimonials">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-4">
            What Our Clients Say.
          </h2>
        </div>

        <div 
          className="relative max-w-4xl mx-auto"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="region"
          aria-label="Client testimonials carousel"
          ref={containerRef}
        >
          {/* Main carousel area */}
          <div className="relative overflow-hidden rounded-lg">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className="w-full flex-shrink-0 px-4"
                  aria-hidden={index !== currentSlide}
                >
                  <Card className={`
                    mx-auto max-w-3xl border-0 shadow-lg
                    ${index % 2 === 0 ? 'bg-card' : 'bg-secondary'}
                  `}>
                    <CardContent className="p-8 md:p-12 text-center">
                      {/* Quote mark */}
                      <div className="mb-6">
                        <span 
                          className="text-6xl md:text-7xl text-primary/20 font-serif leading-none"
                          aria-hidden="true"
                        >
                          "
                        </span>
                      </div>

                      {/* Testimonial text */}
                      <blockquote className="text-lg md:text-xl text-foreground leading-relaxed mb-8 font-sans italic">
                        {testimonial.text}
                      </blockquote>

                      {/* Star rating */}
                      <div className="flex justify-center items-center gap-1 mb-4">
                        <span className="sr-only">
                          {testimonial.rating} out of 5 stars
                        </span>
                        {renderStars(testimonial.rating)}
                      </div>

                      {/* Client info */}
                      <div className="text-center">
                        <cite className="not-italic">
                          <div className="font-heading font-semibold text-lg text-foreground">
                            {testimonial.name}
                          </div>
                          <div className="text-muted-foreground text-sm mt-1">
                            {testimonial.event}
                          </div>
                        </cite>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation controls */}
          <div className="flex items-center justify-center mt-8 gap-4">
            {/* Previous button */}
            <Button
              variant="outline"
              size="sm"
              onClick={prevSlide}
              aria-label="Previous testimonial"
              className="rounded-full w-10 h-10 p-0 border-primary/20 hover:border-primary hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <span aria-hidden="true">←</span>
            </Button>

            {/* Dot indicators */}
            <div className="flex gap-2" role="tablist" aria-label="Testimonial navigation">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`
                    w-3 h-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                    ${index === currentSlide 
                      ? 'bg-primary scale-110' 
                      : 'bg-primary/30 hover:bg-primary/50'
                    }
                  `}
                  aria-label={`Go to testimonial ${index + 1}`}
                  role="tab"
                  aria-selected={index === currentSlide}
                  tabIndex={index === currentSlide ? 0 : -1}
                />
              ))}
            </div>

            {/* Next button */}
            <Button
              variant="outline"
              size="sm"
              onClick={nextSlide}
              aria-label="Next testimonial"
              className="rounded-full w-10 h-10 p-0 border-primary/20 hover:border-primary hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <span aria-hidden="true">→</span>
            </Button>
          </div>

          {/* Play/pause indicator (hidden but accessible) */}
          <div className="sr-only" aria-live="polite">
            Carousel is {isPlaying ? 'playing' : 'paused'}. 
            Hover or focus to pause autoplay.
          </div>
        </div>
      </div>
    </section>
  );
}