# 🌟 Staykoro - Bangladesh Travel Marketplace

![Staykoro Banner](https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80)

A comprehensive marketplace platform connecting hosts (property owners) and guests (travelers) with booking, payments, and property management features. Built with React, Node.js, Express, and MySQL.

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
- React.js (Vite, ES6+)
- Tailwind CSS
- JavaScript

### Backend
- Node.js
- Express.js
- REST API

### Database
- MySQL

## 📁 Project Structure

```text
staykoro/
├── frontend/                 # React application
│   ├── public/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services (Axios)
│   │   ├── App.jsx          # React router setup
│   │   └── index.css        # Global Tailwind styles
│   ├── package.json
│   └── tailwind.config.js
│
├── backend/                  # Express application
│   ├── .env                 # Environment configuration
│   ├── db.js                # Database connection pool
│   ├── schema.sql           # Database tables
│   ├── server.js            # Main application logic
│   └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MySQL

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
npm install
node server.js
```

### Database Setup
```bash
# 1. Open your MySQL client (XAMPP, phpMyAdmin, MySQL Workbench)
# 2. Create the database
CREATE DATABASE staykoro;

# 3. Import the schema found in the backend folder
# Or run this via CLI:
mysql -u root -p staykoro < backend/schema.sql
```

## 📚 Documentation
- **Database Schema**: Reference `backend/schema.sql` for exact relational structures.
- **API Endpoints**: Configured inside `backend/server.js` covering Auth and Properties.

## 🎯 Development Roadmap

**Phase 1 (MVP) ✅**
- Authentication
- Property Listing
- Booking System

**Phase 2 ✅**
- Host Dashboard
- Reviews & Ratings
- Advanced Search Filters

**Phase 3 ✅**
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
