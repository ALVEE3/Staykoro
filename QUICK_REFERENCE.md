# ⚡ Staykoro - Quick Reference Guide

## 🚀 Getting Started (5 Minutes)

### Step 1: Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend (new terminal)
cd frontend
npm install
```

### Step 2: Configure Environment
```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your database credentials

# Frontend
cd frontend
cp .env.example .env
```

### Step 3: Setup Database
```bash
# Create database
mysql -u icei_41755838 -h sql113.iceiy.com -p -e "CREATE DATABASE icei_41755838_staykoro"

# Import schema
mysql -u icei_41755838 -h sql113.iceiy.com -p icei_41755838_staykoro < ../database/schema.sql
```

### Step 4: Run Development Servers
```bash
# Terminal 1: Backend (port 5000)
cd backend
npm run dev

# Terminal 2: Frontend (port 3000)
cd frontend
npm run dev
```

**Visit: http://localhost:3000** ✅

---

## 📁 Project Structure at a Glance

```
Frontend/                          Backend/
├── src/                          ├── routes/
│   ├── pages/                    │   ├── auth.js
│   │   ├── Home.jsx              │   ├── properties.js
│   │   ├── Properties.jsx        │   ├── bookings.js
│   │   ├── Login.jsx             │   ├── reviews.js
│   │   ├── Signup.jsx            │   └── ...
│   │   ├── Dashboard.jsx         │
│   │   └── ...                   ├── middleware/
│   ├── components/               │   ├── auth.js
│   │   ├── Navbar.jsx            │   └── validation.js
│   │   ├── PropertyCard.jsx      │
│   │   └── SearchBar.jsx         ├── config/
│   ├── services/api.js           │   ├── config.js
│   ├── context/AuthContext.jsx   │   └── database.js
│   └── App.jsx                   │
                                  └── server.js
```

---

## 🔗 API Quick Reference

### Authentication
```bash
# Register
POST /api/auth/register

# Login
POST /api/auth/login

# Verify token
GET /api/auth/verify
```

### Properties
```bash
# List properties
GET /api/properties?location=Dhaka&minPrice=1000&maxPrice=5000

# Get one property
GET /api/properties/1

# Create property (host)
POST /api/properties

# Update property (host)
PUT /api/properties/1

# Delete property (host)
DELETE /api/properties/1
```

### Bookings
```bash
# Create booking
POST /api/bookings

# Get my bookings
GET /api/bookings/user/my-bookings

# Get booking details
GET /api/bookings/1

# Cancel booking
PUT /api/bookings/1/cancel
```

---

## 👥 User Roles & Access

| Role | Features | Access |
|------|----------|--------|
| **Guest** | Browse, search, book properties, leave reviews | Public pages, Dashboard |
| **Host** | List properties, manage bookings, view earnings | Host Dashboard, Add Property |
| **Admin** | Approve properties, manage users, analytics | Admin Dashboard |

---

## 🎨 Frontend Routes

| Route | Component | Access |
|-------|-----------|--------|
| `/` | Home | Public |
| `/properties` | Properties List | Public |
| `/property/:id` | Property Details | Public |
| `/login` | Login | Unauthenticated |
| `/signup` | Signup | Unauthenticated |
| `/dashboard` | Guest Dashboard | Guest/All |
| `/dashboard/host` | Host Dashboard | Host |
| `/property/add` | Add Property | Host |
| `/admin/dashboard` | Admin Dashboard | Admin |

---

## 🗄️ Database Tables

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| `users` | User accounts | id, email, role, password |
| `properties` | Property listings | id, title, price, host_id, status |
| `bookings` | Reservations | id, user_id, property_id, check_in, check_out |
| `reviews` | User reviews | id, user_id, property_id, rating |
| `amenities` | Amenities list | id, name |
| `property_amenities` | Property-amenity links | property_id, amenity_id |
| `payments` | Payment transactions | id, booking_id, amount, status |
| `wishlist` | User favorites | user_id, property_id |
| `messages` | Chat messages | sender_id, receiver_id, message |
| `otp` | Phone verification | phone, code, expires_at |

---

## 📝 Common Commands

### Backend

```bash
# Start development server
npm run dev

# Start production server
npm start

# Run tests
npm test

# Install new package
npm install package-name
```

### Frontend

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview build
npm run preview

# Install new package
npm install package-name
```

### Database

```bash
# Connect to database
mysql -u icei_41755838 -h sql113.iceiy.com -p icei_41755838_staykoro

# Backup database
mysqldump -u icei_41755838 -h sql113.iceiy.com -p icei_41755838_staykoro > backup.sql

# Restore database
mysql -u icei_41755838 -h sql113.iceiy.com -p icei_41755838_staykoro < backup.sql

# List tables
SHOW TABLES; (in mysql)

# Run SQL file
mysql -u icei_41755838 -h sql113.iceiy.com -p icei_41755838_staykoro < schema.sql
```

---

## 🐛 Troubleshooting

### Problem: Port 5000 already in use
```bash
# Kill process on port 5000
lsof -i :5000
kill -9 <PID>
```

### Problem: Database connection refused
```bash
# Start MySQL
# Windows: Search for Services -> MySQL80 -> Start
# macOS: brew services start mysql
# Linux: sudo service mysql start
```

### Problem: npm dependencies fail
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules
npm install
```

### Problem: Cannot find module
```bash
# Check node_modules exists, if not:
npm install
```

---

## 🔑 Important Files to Know

| File | Purpose |
|------|---------|
| `backend/server.js` | Main backend entry |
| `frontend/src/App.jsx` | Main frontend entry |
| `database/schema.sql` | Database schema |
| `backend/.env` | Backend config |
| `frontend/.env` | Frontend config |
| `package.json` | Dependencies & scripts |

---

## ✅ Checklist Before Development

- [ ] Node.js installed (v14+)
- [ ] MySQL installed and running
- [ ] Repository cloned/downloaded
- [ ] `.env` files created in frontend & backend
- [ ] Database created and schema imported
- [ ] Dependencies installed (`npm install`)
- [ ] Backend starts without errors (`npm run dev`)
- [ ] Frontend starts without errors (`npm run dev`)
- [ ] Can access http://localhost:3000

---

## 🚢 Deployment Checklist

### Backend (Heroku/DigitalOcean)
- [ ] Set NODE_ENV=production
- [ ] Update JWT_SECRET
- [ ] Configure database connection
- [ ] Setup environment variables
- [ ] Test API endpoints
- [ ] Setup error logging

### Frontend (Vercel/Netlify)
- [ ] Update VITE_API_URL to backend URL
- [ ] Build: `npm run build`
- [ ] Test build: `npm run preview`
- [ ] Deploy dist folder
- [ ] Test in production

### Database
- [ ] Run migrations on production DB
- [ ] Setup automated backups
- [ ] Configure database security
- [ ] Monitor database performance

---

## 📚 File Locations

**Configuration:**
- Backend config: `backend/config/`
- Frontend styles: `frontend/src/index.css`
- Tailwind config: `frontend/tailwind.config.js`

**Routes & Components:**
- API routes: `backend/routes/`
- Pages: `frontend/src/pages/`
- Components: `frontend/src/components/`
- Services: `frontend/src/services/`

**Database & Docs:**
- Schema: `database/schema.sql`
- API docs: `docs/API_ENDPOINTS.md`
- DB docs: `docs/DATABASE_DESIGN.md`
- Setup guide: `docs/SETUP_GUIDE.md`

---

## 💡 Pro Tips

1. **Use VS Code extensions:**
   - Prettier (code formatting)
   - ESLint (code quality)
   - Thunder Client (API testing)

2. **Test API endpoints with:**
   ```bash
   # Using curl
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"pass"}'
   
   # Using Thunder Client or Postman
   # Import API documentation
   ```

3. **Debug frontend issues:**
   - Open DevTools (F12)
   - Check Network tab for API calls
   - Check Console for errors

4. **Debug backend issues:**
   - Check terminal for error logs
   - Add console.log statements
   - Check database with MySQL client

---

## 🔗 Useful Links

- React Docs: https://react.dev
- Express Docs: https://expressjs.com
- MySQL Docs: https://dev.mysql.com/doc/
- Tailwind CSS: https://tailwindcss.com
- Vite Docs: https://vitejs.dev

---

## 🎯 Development Best Practices

### Frontend
- Keep components small and reusable
- Use hooks for state management
- Organize by feature/domain
- Write meaningful variable names
- Add comments for complex logic

### Backend
- Follow REST conventions
- Validate all inputs
- Use consistent error handling
- Write descriptive error messages
- Add logging for debugging

### Database
- Write efficient queries
- Use indexes for frequently searched fields
- Normalize data structure
- Document table relationships
- Regular backups

---

## 📞 Getting Help

1. **Check documentation:**
   - SETUP_GUIDE.md
   - API_ENDPOINTS.md
   - DATABASE_DESIGN.md

2. **Review error messages:**
   - Browser console (frontend)
   - Terminal logs (backend)
   - MySQL logs (database)

3. **Search online:**
   - Stack Overflow
   - GitHub issues
   - Official documentation

---

**Good luck! Happy coding! 🚀**

*For more details, see PROJECT_SUMMARY.md*
