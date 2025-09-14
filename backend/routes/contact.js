import express from 'express';
import Contact from '../models/Contact.js';
// We no longer need nodemailer, so the import is removed.

const router = express.Router();

// Contact form submission
router.post('/', async (req, res) => {
  try {
    // 1. Get the data from the request body
    const { name, email, phone, eventType, message } = req.body;

    // 2. Create a new Contact document using the Mongoose model
    const newContact = new Contact({
      name,
      email,
      phone,
      eventType,
      message,
    });

    // 3. Save the document to your MongoDB database
    await newContact.save();

    // 4. Send a success response back to the frontend
    // The frontend will see this and show the "Message sent successfully!" toast.
    res.status(201).json({ message: 'Contact information saved successfully' });

  } catch (error) {
    // If anything goes wrong (e.g., database connection issue, validation error)
    console.error('Error saving contact form data:', error);
    res.status(500).json({ message: 'Failed to save contact information. Please try again.' });
  }
});

export default router;