import HeaderHero from "@/components/HeaderHero"
import AboutSection from "@/components/AboutSection"
import ServicesSection from "@/components/ServicesSection"
import GallerySection from "@/components/GallerySection"
import TestimonialsSection from "@/components/TestimonialsSection"
import ContactSection from "@/components/ContactSection"
import Footer from "@/components/Footer"
import { Toaster } from "sonner"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      <HeaderHero />
      
      <main className="relative">
        <div id="about" className="scroll-mt-16">
          <AboutSection />
        </div>
        
        <div id="services" className="scroll-mt-16">
          <ServicesSection />
        </div>
        
        <div id="gallery" className="scroll-mt-16">
          <GallerySection />
        </div>
        
        <div id="testimonials" className="scroll-mt-16">
          <TestimonialsSection />
        </div>
        
        <div id="contact" className="scroll-mt-16">
          <ContactSection />
        </div>
      </main>
      
      <Footer />
      
      <Toaster 
        position="top-right" 
        richColors 
        closeButton 
        duration={4000}
      />
    </div>
  )
}