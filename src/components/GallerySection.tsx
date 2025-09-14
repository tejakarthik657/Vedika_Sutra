
"use client";

// Helper to get JWT token
function getAdminToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('adminToken');
  }
  return null;
}

import { useState, useCallback, useEffect } from "react";
import api, { API_BASE_URL } from "@/lib/api";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: string;
  caption?: string;
  eventType?: string;
  date?: string;
  location?: string;
}

const galleryImages: GalleryImage[] = [];

const filterCategories = [
  "All",
  "Weddings",
  "Birthdays",
  "Corporate",
  "Baby Showers",
  "Cultural"
];

export default function GallerySection() {
  // Track deleted image IDs in state only (no localStorage)
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [galleryEvents, setGalleryEvents] = useState<any[]>([]);

  // Helper to check if user is admin (simple session check)
  const isAdmin = typeof window !== 'undefined' && sessionStorage.getItem('isAdmin') === 'true';

  // Admin: Delete event
  const handleDelete = async (eventId: string) => {
    const token = getAdminToken();
    if (!token) return;
    try {
      await api.delete(`/api/gallery/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGalleryEvents(events => events.filter(e => e._id !== eventId));
    } catch {
      // Optionally show error
    }
  };

  // Admin: Undo delete (re-fetch from backend)
  const handleUndo = async () => {
    try {
      const res = await api.get("/api/gallery");
      setGalleryEvents(res.data);
    } catch {}
  };

  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imagesLoading, setImagesLoading] = useState(true);
  const [imageLoadStates, setImageLoadStates] = useState<Record<string, boolean>>({});

  // Fetch events from backend
  useEffect(() => {
    const fetchGallery = async () => {
      setImagesLoading(true);
      try {
        const res = await api.get("/api/gallery");
        setGalleryEvents(res.data);
      } catch {
        setGalleryEvents([]);
      }
      setImagesLoading(false);
    };
    fetchGallery();
  }, []);

  // Combine static images and backend events
  const allImages = [
    ...galleryImages,
  ...galleryEvents.flatMap((event: any, idx: number) =>
      event.images.map((img: string, i: number) => ({
        id: `be-${event._id}-${i}`,
        src: img.startsWith("http") ? img : `${API_BASE_URL}${img}`,
        alt: event.eventName || "Admin Memory",
        category: "Added",
        caption: event.eventName || "Admin Memory",
        eventType: event.eventName || "Admin Memory",
        date: event.eventDate || "",
        location: event.eventLocation || "",
        eventIdx: idx,
        imageIdx: i
      }))
    )
  ];

  // Filter images based on active category
  // Filter out deleted images for all users
  const visibleImages = allImages.filter(img => !deletedIds.includes(img.id));
  const filteredImages = activeFilter === "All"
    ? visibleImages
    : visibleImages.filter(image => image.category === activeFilter);

  // Handle keyboard navigation in lightbox
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!selectedImage) return;

    if (event.key === "Escape") {
      setSelectedImage(null);
      setIsDialogOpen(false);
    } else if (event.key === "ArrowLeft") {
      navigateImage("prev");
    } else if (event.key === "ArrowRight") {
      navigateImage("next");
    }
  }, [selectedImage]);

  const navigateImage = useCallback((direction: "prev" | "next") => {
    if (!selectedImage) return;

    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
    let newIndex;

    if (direction === "prev") {
      newIndex = currentIndex > 0 ? currentIndex - 1 : filteredImages.length - 1;
    } else {
      newIndex = currentIndex < filteredImages.length - 1 ? currentIndex + 1 : 0;
    }

    setSelectedImage(filteredImages[newIndex]);
  }, [selectedImage, filteredImages]);

  // Add keyboard event listeners
  useEffect(() => {
    if (isDialogOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isDialogOpen, handleKeyDown]);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => setImagesLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleImageLoad = useCallback((imageId: string) => {
    setImageLoadStates(prev => ({ ...prev, [imageId]: true }));
  }, []);

  const openLightbox = useCallback((image: GalleryImage) => {
    setSelectedImage(image);
    setIsDialogOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setSelectedImage(null);
    setIsDialogOpen(false);
  }, []);

  return (
    <section className="py-16 bg-card">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Add New Memory Button */}
        <div className="flex justify-end mb-6">
          <Button
            onClick={() => window.location.href = '/admin-login'}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-full shadow-lg"
          >
            Add New Memory
          </Button>
        </div>
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
            Our Unforgettable Moments.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the magic we create through our carefully curated gallery of memorable events
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {filterCategories.map((category) => (
            <Button
              key={category}
              onClick={() => setActiveFilter(category)}
              variant={activeFilter === category ? "default" : "outline"}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                activeFilter === category
                  ? "bg-primary text-primary-foreground border-accent border-2 shadow-lg"
                  : "bg-card text-foreground border-border hover:border-primary hover:text-primary"
              }`}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Loading State */}
        {imagesLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="bg-muted rounded-lg animate-pulse"
                style={{ height: `${200 + Math.random() * 150}px` }}
              />
            ))}
          </div>
        )}

        {/* Gallery Grid */}
        {!imagesLoading && (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6"
            >
              {filteredImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="break-inside-avoid cursor-pointer group relative"
                >
                  <div className="relative overflow-hidden rounded-lg bg-muted" onClick={() => openLightbox(image)}>
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={600}
                      height={600}
                      className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                      onLoad={() => handleImageLoad(image.id)}
                      loading="lazy"
                    />
                    {!imageLoadStates[image.id] && (
                      <div className="absolute inset-0 bg-muted animate-pulse" />
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-white text-sm font-medium">
                        {image.category}
                      </span>
                    </div>
                  </div>
                  {/* Show delete button for admin for all images */}
                  {isAdmin && (
                    <button
                      className="absolute top-2 right-2 bg-destructive text-white rounded-full w-8 h-8 flex items-center justify-center z-10 shadow-lg"
                      title="Delete Memory"
                      onClick={() => handleDelete(image.eventIdx ? galleryEvents[image.eventIdx]._id : image.id)}
                    >
                      ×
                    </button>
                  )}
      {/* Admin: Undo delete button */}
      {isAdmin && (
        <div className="flex justify-end mt-4">
          <Button onClick={handleUndo} className="bg-accent text-accent-foreground px-6 py-2 rounded-full shadow-lg">Undo Delete</Button>
        </div>
      )}
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Empty State */}
        {!imagesLoading && filteredImages.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              No images found for the selected category.
            </p>
          </div>
        )}

        {/* Lightbox Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={closeLightbox}>
          <DialogContent className="max-w-7xl max-h-[90vh] w-full bg-black/95 border-none p-0">
            {selectedImage && (
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Close Button */}
                <Button
                  onClick={closeLightbox}
                  variant="ghost"
                  size="sm"
                  className="absolute top-4 right-4 z-50 text-white hover:bg-white/20 rounded-full w-10 h-10 p-0"
                >
                  ✕
                </Button>

                {/* Navigation Buttons */}
                <Button
                  onClick={() => navigateImage("prev")}
                  variant="ghost"
                  size="sm"
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20 rounded-full w-12 h-12 p-0"
                >
                  ‹
                </Button>
                <Button
                  onClick={() => navigateImage("next")}
                  variant="ghost"
                  size="sm"
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20 rounded-full w-12 h-12 p-0"
                >
                  ›
                </Button>

                {/* Main Image */}
                <div className="relative max-w-full max-h-full p-8">
                  <Image
                    src={selectedImage.src}
                    alt={selectedImage.alt}
                    width={1200}
                    height={800}
                    className="max-w-full max-h-[70vh] object-contain rounded-lg"
                    priority
                  />
                </div>

                {/* Image Info */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-8">
                  <div className="text-white max-w-4xl mx-auto">
                    <h3 className="text-xl font-semibold mb-2 text-white">
                      {selectedImage.caption}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm text-white">
                      {selectedImage.eventType && (
                        <span>Event: {selectedImage.eventType}</span>
                      )}
                      {selectedImage.date && (
                        <span>Date: {selectedImage.date}</span>
                      )}
                      {selectedImage.location && (
                        <span>Location: <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedImage.location)}`} target="_blank" rel="noopener noreferrer" className="underline text-white hover:text-gray-300">{selectedImage.location}</a></span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}