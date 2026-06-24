# Event Management Platform — Vendor & Venue Owner Module (Member 3)

This is the **Vendor & Venue Owner** module of the team Event Management Platform.
It is a self-contained full-stack slice (React + Node.js + MongoDB) that can run on its
own and later be merged into the main team repository.

## User journeys implemented

**Vendors / Suppliers (Journeys 13–16)**
- Register / login as a vendor; view and update vendor profile (company, supplies, location, pricing list, contact).
- View incoming sourcing requests with details; accept or decline; send a clarification message.
- View accepted orders as deliveries; update delivery status (Preparing → Out for Delivery → Delivered); report delays.
- Create and submit invoices with line items and notes; track invoice status (Pending Review / Approved / Paid).

**Venue Owners (Journeys 22–26)**
- Register / login as a venue owner; profile via account.
- Create, edit, deactivate and remove venue listings (name, description, location, capacity, size m², amenities, pricing).
- Receive booking requests; approve / decline; send counter-proposal. Approving blocks the date on the venue calendar.
- View confirmed bookings with organizer contact details.
- Performance dashboard: total bookings, revenue, per-venue booking rate; export report as CSV.

## Tech stack
- **Frontend:** React 18 + Vite + React Router + Axios
- **Backend:** Node.js + Express + Mongoose (ESM)
- **Database:** MongoDB
- **Auth:** JWT (role-based)

## Project structure
```
vendor-venue-module/
  backend/
    src/
      config/db.js
      middleware/auth.js
      models/        (User, Vendor, SourcingRequest, Delivery, Invoice, Venue, BookingRequest)
      routes/        (auth, vendor, venue)
      server.js
    database/seed.js
  frontend/
    src/
      pages/vendor/  (VendorProfile, SourcingRequests, Deliveries, Invoices)
      pages/venue/   (VenueListings, BookingRequests, ConfirmedBookings, Reports)
      components/Navbar.jsx
      context/AuthContext.jsx
      services/api.js
  docs/AI_CHATLOG.md
```

## Setup

### Prerequisites
- Node.js 18+ and npm
- MongoDB running locally (or a MongoDB Atlas connection string)

### Backend
```bash
cd backend
npm install
cp .env.example .env        # adjust MONGO_URI / JWT_SECRET if needed
npm run seed                # populate dummy data
npm run dev                 # starts on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env        # VITE_API_URL defaults to http://localhost:5000/api
npm run dev                 # starts on http://localhost:5173
```

## Dummy data / seed
`npm run seed` (in `backend/`) **wipes and repopulates** the database with:
- 1 organizer, 2 vendors, 1 venue owner
- 3 sourcing requests, 1 delivery, 1 invoice
- 2 venues, 2 booking requests

Re-run it any time to reset.

### Demo logins (password for all: `password123`)
| Role | Email |
|------|-------|
| Vendor | vendor1@demo.com |
| Vendor | vendor2@demo.com |
| Venue owner | owner@demo.com |
| Organizer | organizer@demo.com |

## Assumptions
- The canonical `User` and `Event` models are owned by the backend lead (Member 2). This module
  ships a minimal `User` model and references events by name (`eventName`) so it can run standalone.
  On integration, swap to the shared models and replace `eventName` strings with `Event` references.
- Booking and sourcing requests are normally created by organizers (Members 1/2). For this module
  they are provided via the seed script so vendor/venue-owner flows can be demonstrated.
- Invoices may be submitted without an explicit organizer id in the demo; the backend then attaches
  them to the first organizer found. In integration this should come from the related request.
- Photo/floor-plan upload is stored as URL strings only (no file upload service in this slice).

## API summary
- `POST /api/auth/register`, `POST /api/auth/login`
- Vendor: `GET/PUT /api/vendors/me`, `GET /api/vendors`, `GET /api/vendors/requests/incoming`,
  `PATCH /api/vendors/requests/:id/respond`, `POST /api/vendors/requests/:id/message`,
  `GET/PATCH /api/vendors/deliveries`, `GET/POST /api/vendors/invoices`
- Venue: `GET /api/venues`, `GET /api/venues/mine`, `POST /api/venues`, `PUT /api/venues/:id`,
  `PATCH /api/venues/:id/status`, `GET /api/venues/bookings/requests`,
  `PATCH /api/venues/bookings/requests/:id/respond`, `GET /api/venues/bookings/confirmed`,
  `GET /api/venues/reports/summary`
