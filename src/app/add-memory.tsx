"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

interface EventImage {
  file: File;
  preview: string;
}

export default function AddMemory() {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [details, setDetails] = useState("");
  const [mapUrl, setMapUrl] = useState("");
  const [images, setImages] = useState<EventImage[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    // Build multipart form data for backend
    const formData = new FormData();
    formData.append("eventName", eventName);
    formData.append("eventDate", eventDate);
    formData.append("eventLocation", eventLocation);
    if (details) formData.append("details", details);
    if (mapUrl) formData.append("mapUrl", mapUrl);
    images.forEach(img => formData.append("images", img.file));

    const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
    try {
      await api.post("/api/gallery", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      setShowSuccess(true);
      setTimeout(() => {
        window.location.href = "/admin-gallery";
      }, 1200);
    } catch (err) {
      // Handle error — you can add a toast or message
      setShowSuccess(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-card">
      <form onSubmit={handleSubmit} className="bg-background p-8 rounded-lg shadow-lg w-full max-w-lg space-y-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Add New Memory</h2>
        <div>
          <label className="block mb-2 font-medium">Event Name</label>
          <input
            type="text"
            value={eventName}
            onChange={e => setEventName(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            required
            placeholder="Enter event name"
          />
        </div>
        <div>
          <label className="block mb-2 font-medium">Event Date</label>
          <input
            type="date"
            value={eventDate}
            onChange={e => setEventDate(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            required
            placeholder="Select event date"
          />
        </div>
        <div>
          <label className="block mb-2 font-medium">Event Location</label>
          <input
            type="text"
            value={eventLocation}
            onChange={e => setEventLocation(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            required
            placeholder="Enter event location"
          />
        </div>
        <div>
          <label className="block mb-2 font-medium">Event Details (optional)</label>
          <textarea
            value={details}
            onChange={e => setDetails(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Short description of the event"
          />
        </div>
        <div>
          <label className="block mb-2 font-medium">Map URL (optional)</label>
          <input
            type="url"
            value={mapUrl}
            onChange={e => setMapUrl(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="https://maps.google.com/..."
          />
        </div>
        <div>
          <label className="block mb-2 font-medium">Upload Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="flex flex-wrap gap-4 mt-4">
            {images.map((img, idx) => (
              <div key={idx} className="relative">
                <img src={img.preview} alt="Preview" className="w-24 h-24 object-cover rounded" />
                <button type="button" onClick={() => handleRemoveImage(idx)} className="absolute top-0 right-0 bg-destructive text-white rounded-full w-6 h-6 flex items-center justify-center">×</button>
              </div>
            ))}
          </div>
        </div>
        <Button disabled={submitting} type="submit" className="w-full bg-primary text-primary-foreground py-2 rounded">{submitting ? 'Uploading...' : 'Done'}</Button>
        {showSuccess && <p className="text-success text-center mt-4">Memory added! Redirecting to gallery...</p>}
      </form>
    </div>
  );
}
