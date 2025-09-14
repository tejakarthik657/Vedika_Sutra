// File: src/app/add-memory/page.tsx

"use client";

import { useState, useEffect, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useRouter } from "next/navigation";

interface EventImage {
  file: File;
  preview: string;
}

export default function AddMemoryPage() {
  const router = useRouter();
  const [isAllowed, setIsAllowed] = useState(false);
  
  // State for all form fields
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [details, setDetails] = useState("");
  const [mapUrl, setMapUrl] = useState("");
  const [images, setImages] = useState<EventImage[]>([]);

  // State for UI feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Check for admin status on client side
    if (sessionStorage.getItem('isAdmin') === 'true') {
      setIsAllowed(true);
    } else {
      router.push('/admin-login');
    }
  }, [router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newImages = filesArray.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      setError("Please upload at least one image.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setShowSuccess(false);

    const formData = new FormData();
    formData.append("eventName", eventName);
    formData.append("eventDate", eventDate);
    formData.append("eventLocation", eventLocation);
    formData.append("eventTime", eventTime);
    formData.append("details", details);
    formData.append("mapUrl", mapUrl);
    images.forEach((img) => formData.append("images", img.file));

    try {
      const token = localStorage.getItem('adminToken');
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/gallery`;

      await axios.post(apiUrl, formData, {
        headers: {
          // 'Content-Type': 'multipart/form-data' is set automatically by axios for FormData
          Authorization: `Bearer ${token}`,
        },
      });

      setShowSuccess(true);
      setTimeout(() => {
        router.push("/admin-gallery");
      }, 1500);

    } catch (err: any) {
      console.error("Failed to create event:", err);
      const errorMessage = err.response?.data?.message || "Failed to add memory. Please check the console and try again.";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAllowed) {
    return <div className="min-h-screen flex items-center justify-center bg-card"><p>Redirecting...</p></div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-card py-12">
      <form onSubmit={handleSubmit} className="bg-background p-8 rounded-lg shadow-lg w-full max-w-2xl space-y-6">
        <h2 className="text-3xl font-bold mb-6 text-center text-foreground">Add New Memory</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="eventName">Event Name *</Label>
            <Input id="eventName" value={eventName} onChange={e => setEventName(e.target.value)} required placeholder="e.g., Anjali & Rohan's Wedding"/>
          </div>
          <div className="space-y-2">
            <Label htmlFor="eventLocation">Event Location *</Label>
            <Input id="eventLocation" value={eventLocation} onChange={e => setEventLocation(e.target.value)} required placeholder="e.g., Hyderabad, India"/>
          </div>
          <div className="space-y-2">
            <Label htmlFor="eventDate">Event Date *</Label>
            <Input id="eventDate" type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} required/>
          </div>
          <div className="space-y-2">
            <Label htmlFor="eventTime">Event Time *</Label>
            <Input id="eventTime" type="time" value={eventTime} onChange={e => setEventTime(e.target.value)} required/>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="details">Details</Label>
          <Textarea id="details" value={details} onChange={e => setDetails(e.target.value)} placeholder="Add a short description of the event..." />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mapUrl">Google Maps URL</Label>
          <Input id="mapUrl" type="url" value={mapUrl} onChange={e => setMapUrl(e.target.value)} placeholder="https://maps.app.goo.gl/..." />
        </div>

        <div className="space-y-2">
          <Label htmlFor="images">Upload Images *</Label>
          <Input id="images" type="file" multiple accept="image/*" onChange={handleImageChange} className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
          <div className="flex flex-wrap gap-4 mt-4">
            {images.map((img, idx) => (
              <div key={idx} className="relative">
                <img src={img.preview} alt="Preview" className="w-24 h-24 object-cover rounded-lg border" />
                <button type="button" onClick={() => handleRemoveImage(idx)} className="absolute -top-2 -right-2 bg-destructive text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-md">✕</button>
              </div>
            ))}
          </div>
        </div>
        
        {error && <p className="text-destructive text-sm text-center">{error}</p>}
        {showSuccess && <p className="text-green-600 text-center">Memory added successfully! Redirecting...</p>}

        <Button type="submit" className="w-full text-lg py-3 h-auto" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Add Memory'}
        </Button>
      </form>
    </div>
  );
}