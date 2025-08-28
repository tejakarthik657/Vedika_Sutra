// File: src/app/admin-gallery/page.tsx

"use client";

import GallerySection from "@/components/GallerySection";
import { Button } from "@/components/ui/button"; // Import the Button component
import Link from "next/link"; // Import the Link component for client-side navigation
import { useState, useEffect } from "react";

function AdminGalleryClient() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    // This check should only run on the client side
    if (typeof window !== 'undefined') {
      const adminStatus = sessionStorage.getItem('isAdmin') === 'true';
      setIsAdmin(adminStatus);
      if (!adminStatus) {
        // Redirect if not admin
        window.location.href = '/admin-login';
      }
    }
  }, []);

  // Show a loading or null state while checking for admin status
  if (isAdmin === null) {
     return <div className="min-h-screen flex items-center justify-center"><p>Verifying admin access...</p></div>;
  }
  
  // This will prevent the component from rendering on the server or if not admin
  if (!isAdmin) {
    return null;
  }
  
  // If admin, render the gallery and the button
  return (
    <>
      <GallerySection />
      
      {/* --- ADDED SECTION START --- */}
      <div className="flex justify-center py-12 bg-card">
        <Link href="/" passHref>
          <Button
            variant="outline"
            className="px-8 py-3 text-lg border-primary text-primary hover:bg-primary/10 hover:text-primary"
          >
            Back to Home Page
          </Button>
        </Link>
      </div>
      {/* --- ADDED SECTION END --- */}
    </>
  );
}

export default function AdminGalleryPage() {
  return <AdminGalleryClient />;
}