
# Wanderlust - Airbnb Clone (MERN)

A full-stack Airbnb-inspired web application built using the MERN stack. Users can create listings, upload images, leave reviews, and manage their own properties through a secure authentication system.

## Live Demo

Frontend: https://airbnb-mern-b08k.onrender.com

Backend API: https://airbnb-mern-backend-vi08.onrender.com

---

## Features

- User authentication (Sign up, Login, Logout)
- Session-based authentication using Passport.js
- Create new property listings
- Edit and delete own listings
- Upload listing images
- View listing details
- Interactive map using Leaflet
- Add and delete reviews
- Authorization for listings and reviews
- Responsive React frontend
- REST API with Express
- MongoDB Atlas database

---

## Tech Stack

### Frontend

- React
- React Router
- Axios
- Bootstrap
- Leaflet

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Passport.js
- Express Session
- Joi Validation
- Multer

### Deployment

- Render
- MongoDB Atlas

---

## Project Structure

```
frontend/
    src/
    public/

backend/
    controllers/
    middleware/
    models/
    routes/
    utils/
    app.js
```

---

## Installation

### Clone Repository

```bash
git clone YOUR_GITHUB_REPO
cd Airbnb_MERN
```

### Backend

```bash
npm install
```

Create a `.env` file

```
ATLASDB_URL=
SESSION_SECRET=
CLOUD_NAME=
CLOUD_API_KEY=
CLOUD_API_SECRET=
FRONTEND_ORIGIN=
```

Run backend

```bash
npm start
```

---

### Frontend

```bash
cd frontend
npm install
```

Create `.env`

```
VITE_API_BASE_URL=http://localhost:8080
```

Run frontend

```bash
npm run dev
```

---

## Screenshots

Add screenshots here after deployment.

- Home Page
- Listing Details
- Login
- Signup
- Create Listing
- Edit Listing

---

## Future Improvements

- Wishlist functionality
- Booking system
- Search and filtering
- User profiles
- Image gallery
- Pagination

---

## Author

Arpita

GitHub: https://github.com/Arpita3011-projects