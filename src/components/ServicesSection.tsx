"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Service {
  id: string;
  title: string;
  summary: string;
  description: string;
  category: string;
  image: string;
  details: string[];
}

const services: Service[] = [
  {
    id: "weddings",
    title: "Weddings",
    summary: "Crafting your perfect day with elegance and tradition",
    description: "Transform your special day into an unforgettable celebration with our comprehensive wedding planning services. From intimate ceremonies to grand celebrations, we handle every detail with care and precision.",
    category: "celebration",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=300&fit=crop",
    details: [
      "Full-service wedding planning and coordination",
      "Vendor management and venue selection",
      "Custom décor and floral arrangements",
      "Traditional and contemporary ceremony options"
    ]
  },
  {
    id: "engagements",
    title: "Engagements",
    summary: "Celebrate your love story with intimate gatherings",
    description: "Mark the beginning of your journey together with a beautifully planned engagement celebration that reflects your unique love story and sets the tone for your future.",
    category: "celebration",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=300&fit=crop",
    details: [
      "Romantic venue styling and decoration",
      "Photography coordination and timeline",
      "Catering and beverage service management",
      "Guest experience and entertainment planning"
    ]
  },
  {
    id: "birthday-parties",
    title: "Birthday Parties",
    summary: "Memorable celebrations for every milestone",
    description: "Create magical birthday experiences that bring joy and wonder to your special day, whether it's a child's themed party or an elegant adult celebration.",
    category: "party",
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=300&fit=crop",
    details: [
      "Age-appropriate themes and entertainment",
      "Custom cake and catering coordination",
      "Party games and activity planning",
      "Memorable party favors and gifts"
    ]
  },
  {
    id: "baby-showers",
    title: "Baby Showers",
    summary: "Welcoming new life with joy and anticipation",
    description: "Celebrate the upcoming arrival of your little one with a heartwarming baby shower that brings together family and friends in a beautiful, memorable setting.",
    category: "celebration",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    details: [
      "Gender reveal and themed decorations",
      "Games and activities for all ages",
      "Gift registry coordination",
      "Keepsake creation and memory making"
    ]
  },
  {
    id: "corporate-events",
    title: "Corporate Events",
    summary: "Professional gatherings that inspire and connect",
    description: "Elevate your business events with professional planning that creates meaningful connections, showcases your brand, and achieves your corporate objectives.",
    category: "corporate",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop",
    details: [
      "Conference and seminar coordination",
      "Team building activities and retreats",
      "Product launch and networking events",
      "Award ceremonies and recognition events"
    ]
  },
  {
    id: "cultural-functions",
    title: "Cultural Functions",
    summary: "Honoring traditions with authentic celebrations",
    description: "Preserve and celebrate your cultural heritage with authentic events that honor traditions while creating new memories for future generations.",
    category: "cultural",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop",
    details: [
      "Traditional ceremony coordination",
      "Authentic cuisine and catering",
      "Cultural entertainment and performances",
      "Custom decorations respecting traditions"
    ]
  }
];

const categories = ["all", "celebration", "party", "corporate", "cultural"];

export default function ServicesSection() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredServices = services.filter(service => 
    activeFilter === "all" || service.category === activeFilter
  );

  const scrollToContact = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="services" className="py-24 bg-card">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
            Services Tailored for Every Occasion
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From intimate gatherings to grand celebrations, we bring your vision to life with meticulous planning and creative excellence.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeFilter === category ? "default" : "outline"}
              onClick={() => setActiveFilter(category)}
              className="capitalize"
            >
              {category === "all" ? "All Services" : category}
            </Button>
          ))}
        </div>

        {/* Services Grid */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <Card
                key={service.id}
                className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg bg-card border-border"
                onClick={() => setSelectedService(service)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedService(service);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`View details for ${service.title}`}
              >
                <CardHeader className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="bg-primary text-primary-foreground">
                        {service.category}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  <CardTitle className="text-xl font-heading font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {service.title}
                  </CardTitle>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {service.summary}
                  </p>
                </CardContent>

                <CardFooter className="p-6 pt-0">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      scrollToContact();
                    }}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Schedule a Consultation
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              No services found for the selected category.
            </p>
            <Button
              onClick={() => setActiveFilter("all")}
              variant="outline"
              className="mt-4"
            >
              Show All Services
            </Button>
          </div>
        )}

        {/* Service Detail Dialog */}
        <Dialog open={!!selectedService} onOpenChange={() => setSelectedService(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-card">
            {selectedService && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-heading font-semibold text-foreground">
                    {selectedService.title}
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                  <img
                    src={selectedService.image}
                    alt={selectedService.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  
                  <div>
                    <Badge className="bg-primary text-primary-foreground mb-4">
                      {selectedService.category}
                    </Badge>
                    <p className="text-muted-foreground leading-relaxed">
                      {selectedService.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-heading font-semibold text-foreground mb-3">
                      What We Include
                    </h4>
                    <ul className="space-y-2">
                      {selectedService.details.map((detail, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                          <span className="text-muted-foreground">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button
                      onClick={scrollToContact}
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      Get Started Today
                    </Button>
                    <Button
                      onClick={() => setSelectedService(null)}
                      variant="outline"
                      className="flex-1"
                    >
                      Browse More Services
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}