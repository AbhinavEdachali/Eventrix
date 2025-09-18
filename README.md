# eventrix

## Project Overview

Eventrix is an event and wedding service platform made using the MERN stack (MongoDB, Express.js, React.js, Node.js). It is designed to help people easily explore, choose, and book services like venues, decorators, catering, and makeup artists all in one place. The system is simple for users to browse categories, view vendor details, add services to shortlist, and finally book them with payment options.

For the admin side, Eventrix provides a Superadmin dashboard that controls everything on the platform. From adding and editing categories, vendors, and products to handling user reviews, bookings, blogs, and enquiries – the Superadmin has complete access. The dashboard also shows reports and stats to make monitoring easier.

The backend connects both user site and admin panel, taking care of authentication, storing data in MongoDB, and providing APIs for smooth communication. With role-based access, responsive UI, and dynamic features, Eventrix is built to be a reliable solution for organizing and managing wedding or event services effectively.


## Project Parts

1. eventix (User Frontend)

   Made with: React, Vite, Tailwind CSS
   What it does:
      User can sign up / login
      Browse services by category (like makeup, venues, decorators)
      Add to shortlist, check details, and book services
      Choose payment: Cash on Delivery (COD) or Card
      Read blogs and send enquiries
   How it works: User app talks to backend through APIs.

2. eventrix\superadmin (Superadmin Dashboard)

   Made with: React, Vite, Tailwind CSS
   What it does: 
      Superadmin login and role-based access
      Full control over categories, vendors, products, blogs
      Manage user enquiries, bookings, reviews
      Dashboard shows stats like products, bookings, users
      CRUD (add, edit, delete) for everything
   How it works: Admin actions call backend APIs to update data.

 3. eventrix\_backend (Backend API Server)

    Made with: Node.js, Express, MongoDB, JWT
    What it does:
       Handles all APIs for frontend and admin
       Authentication & authorization for users and admins
       File uploads for product and blog images
       Models and controllers for each resource (user, vendor, product, booking, etc.)
       Stores and fetches all data in MongoDB
    How it works: Backend is the central hub. Both user site and admin dashboard use it to get and send data.


##  Getting Started

1. Clone the repo.
2. Install dependencies in all folders (`eventix`, `eventrix_superadmin`, `eventrix_backend`).
3. Add environment variables in `.env` (database URL, JWT secret, etc.).
4. Start backend: `npm start` inside eventrix\_backend.
5. Start frontend apps: `npm run dev` inside eventix and eventrix\_superadmin.
6. Open in browser:

     User site → `http://localhost:5173/`
     Admin site → `http://localhost:5174/`

## Key Features

  Simple and modern UI/UX with Tailwind
  Role-based secure authentication
  Full CRUD: users, vendors, products, categories, blogs
  File/image upload support
  Review, booking, enquiry system
  Mobile friendly responsive design
  Superadmin control for vendors and services


## Folder Structure

  `eventix` → User frontend app
  `eventrix_superadmin` → Superadmin dashboard
  `eventrix_backend` → Backend API server



