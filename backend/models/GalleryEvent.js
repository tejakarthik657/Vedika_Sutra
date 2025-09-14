// File: backend/models/GalleryEvent.js

import mongoose from 'mongoose';

const GalleryEventSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  eventLocation: { type: String, required: true },
  eventDate: { type: String, required: true },
  eventTime: { type: String, required: true }, // This remains required
  details: { type: String, required: false }, // Made this optional
  images: [{ type: String }],
  mapUrl: { type: String, required: false }, // Made this optional
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('GalleryEvent', GalleryEventSchema);