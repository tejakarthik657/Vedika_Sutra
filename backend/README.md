# Vedika Sutra Backend

Node.js + Express backend for event gallery and contact form.

## Features
- Admin authentication (JWT)
- Gallery CRUD with image upload (Multer)
- Google Maps integration for event location
- Contact form (sends email to admin and stores in MongoDB)

## Environment Variables
- MONGO_URI
- ADMIN_EMAIL
- JWT_SECRET
- GOOGLE_MAPS_API_KEY

## Endpoints
- POST /api/admin/login
- POST /api/gallery
- GET /api/gallery
- DELETE /api/gallery/:id
- POST /api/contact
