# Staykoro - Bangladesh Travel Marketplace

A comprehensive marketplace platform connecting hosts (property owners) and guests (travelers) with booking, payments, and property management features. Built with React, Node.js, Express, and PostgreSQL.

## 🌟 Features

### Core Features
- ✅ User Authentication (JWT-based)
- ✅ Property Listing & Search
- ✅ Advanced Filtering (Location, Price, Amenities)
- ✅ Booking System with Availability Calendar
- ✅ Reviews & Ratings
- ✅ Host & Guest Dashboards
- ✅ Admin Panel

### Bangladesh-Specific Features
- 📍 District-based location filtering
- 💱 BDT currency support
- 📱 Phone OTP verification
- 🏪 Local payment integration (bKash, Nagad)

## 📋 Tech Stack

### Frontend
- React.js (ES6+)
- Tailwind CSS
- JavaScript

### Backend
- Node.js
- Express.js
- REST API

### Database
- PostgreSQL

## 📁 Project Structure

```
staykoro/
├── frontend/                 # React application
│   ├── public/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── context/         # Context API
│   │   ├── hooks/           # Custom hooks
│   │   └── App.jsx
│   ├── package.json
│   └── tailwind.config.js
│
├── backend/                  # Express application
│   ├── routes/              # API routes
│   ├── controllers/         # Route controllers
│   ├── models/              # Database models
│   ├── middleware/          # Custom middleware
│   ├── config/              # Configuration files
│   ├── server.js
│   └── package.json
│
├── database/                # Database schema
│   ├── schema.sql          # Database tables
│   └── migrations/         # Migration scripts
│
└── docs/                    # Documentation
    ├── API_ENDPOINTS.md
    ├── DATABASE_DESIGN.md
    └── SETUP_GUIDE.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

### Database Setup
```bash
# Create database
createdb staykoro

# Run schema
psql staykoro < ../database/schema.sql
```

## 📚 Documentation
- [API Endpoints](./docs/API_ENDPOINTS.md)
- [Database Design](./docs/DATABASE_DESIGN.md)
- [Setup Guide](./docs/SETUP_GUIDE.md)

## 🎯 Development Roadmap

**Phase 1 (MVP)**
- Authentication
- Property Listing
- Booking System

**Phase 2**
- Host Dashboard
- Reviews & Ratings
- Advanced Search Filters

**Phase 3**
- Payment Integration
- Admin Panel
- Performance Optimization

## 📦 Features by Module

### 1. Authentication
- JWT-based authentication
- Email & password login
- Social login (future)
- Phone OTP verification

### 2. Property Management
- Add/Edit properties
- Image upload & carousel
- Availability calendar
- Admin approval system

### 3. Booking System
- Date selection
- Real-time availability check
- Booking confirmation
- Cancellation handling

### 4. Search & Filter
- Location-based search
- Price range filtering
- Guest count filtering
- Amenities filtering

### 5. Reviews & Ratings
- 5-star rating system
- Comments/feedback
- Host & Guest ratings

### 6. Admin Dashboard
- User management
- Property approval
- Analytics & reporting
- Dispute resolution

## 🔐 Security Features
- Password hashing (bcrypt)
- JWT token management
- Input validation & sanitization
- Role-based access control (RBAC)
- SQL injection prevention

## 🌍 Bangladesh Support
- All major districts included
- BDT (৳) currency
- Local payment methods
- Phone number validation

## 📝 License
MIT

## 👥 Contributors
Staykoro Team

---

**Happy Coding! 🚀**
