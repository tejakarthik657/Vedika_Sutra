// File: backend/routes/gallery.js

import express from 'express';
import GalleryEvent from '../models/GalleryEvent.js';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Configure multer storage to keep original file extensions
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Keep the original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Middleware for admin auth
function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authorization failed: No token provided.' });
  }
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authorization failed: Invalid token.' });
  }
}

// Get all gallery events
router.get('/', async (req, res) => {
  try {
    const events = await GalleryEvent.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    console.error('Error fetching gallery events:', error);
    res.status(500).json({ message: 'Failed to fetch gallery events.' });
  }
});

// Add new event (admin only) - WITH ERROR HANDLING
router.post('/', auth, upload.array('images'), async (req, res) => {
  try {
    const { eventName, eventLocation, eventDate, eventTime, details, mapUrl } = req.body;
    
    // Check if files were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'At least one image is required.' });
    }
    
    const images = req.files.map(file => `/uploads/${file.filename}`);
    
    const event = new GalleryEvent({
      eventName,
      eventLocation,
      eventDate,
      eventTime,
      details,
      images,
      mapUrl
    });
    
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating new event:', error);
    // Specifically handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error while creating event.' });
  }
});

// Delete event (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await GalleryEvent.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    // Optional: Delete image files from the server's 'uploads' folder
    event.images.forEach(imagePath => {
      const fullPath = path.join(process.cwd(), imagePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    });

    await GalleryEvent.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted successfully.' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Failed to delete event.' });
  }
});

export default router;