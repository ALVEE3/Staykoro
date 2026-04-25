# Staykoro - Setup & Installation Guide

## Prerequisites

Before starting, ensure you have the following installed:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org)
- **npm** or **yarn** - Comes with Node.js
- **MySQL** (v8.0 or higher) - [Download](https://dev.mysql.com/downloads/installer/)
- **Git** (optional) - [Download](https://git-scm.com)

### Verify Installation

```bash
node --version    # Should be v14+
npm --version     # Should be 6+
mysql --version   # Should be 8.0+
```

---

## Project Setup

### 1. Initialize the Database

#### Create Database

```bash
# Open MySQL command line
mysql -u icei_41755838 -h sql113.iceiy.com -p

# Create database
CREATE DATABASE icei_41755838_staykoro;

# Exit mysql
EXIT;
```

#### Run Schema

```bash
# From project root directory
mysql -u icei_41755838 -h sql113.iceiy.com -p icei_41755838_staykoro < database/schema.sql
```

This creates all tables, indexes, and inserts sample amenities.

---

### 2. Backend Setup

#### Install Dependencies

```bash
cd backend
npm install
```

#### Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

**Required Environment Variables:**
```env
PORT=5000
NODE_ENV=development

DB_USER=icei_41755838
DB_PASSWORD=your_password
DB_HOST=sql113.iceiy.com
DB_PORT=3306
DB_NAME=icei_41755838_staykoro

JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=7d

CLIENT_URL=http://staykoro.iceiy.com
```

#### Start Backend Server

```bash
# Development with hot reload
npm run dev

# Production
npm start
```

Server will run at `http://localhost:5000`

---

### 3. Frontend Setup

#### Install Dependencies

```bash
cd frontend
npm install
```

#### Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Edit .env if needed
nano .env
```

**Frontend Environment Variables:**
```env
VITE_API_URL=http://localhost:5000/api
```

#### Start Frontend Development Server

```bash
npm run dev
```

Application will run at `http://localhost:3000`

---

## Testing the Setup

### 1. Check Backend Health

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{"status":"Server is running"}
```

### 2. Test API Endpoints

#### Create User Account

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+8801234567890",
    "password": "TestPass123",
    "role": "guest"
  }'
```

#### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

### 3. Test Frontend

Visit `http://localhost:3000` in your browser and:
1. Go to Sign Up page
2. Create an account
3. Login
4. View home page and properties

---

## Common Issues & Solutions

### Issue 1: Database Connection Error

**Error:** `ECONNREFUSED - Connection refused`

**Solution:**
```bash
# Check if MySQL is running
# On Windows
# Search for Services -> MySQL80 -> Start

# On macOS
brew services start mysql

# On Linux
sudo service mysql start
```

### Issue 2: Port Already in Use

**Error:** `EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Find process using port 5000 (Linux/macOS)
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or use different port in .env
PORT=5001
```

### Issue 3: npm Install Fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue 4: CORS Error

**Solution:** Ensure `CLIENT_URL` in backend `.env` matches your frontend URL:
```env
CLIENT_URL=http://localhost:3000
```

---

## Database Management

### Backup Database

```bash
mysqldump -u icei_41755838 -h sql113.iceiy.com -p icei_41755838_staykoro > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restore Database

```bash
mysql -u icei_41755838 -h sql113.iceiy.com -p icei_41755838_staykoro < backup_20240101_120000.sql
```

### Reset Database (⚠️ Careful!)

```bash
# Drop database
mysql -u icei_41755838 -h sql113.iceiy.com -p -e "DROP DATABASE icei_41755838_staykoro"

# Recreate
mysql -u icei_41755838 -h sql113.iceiy.com -p -e "CREATE DATABASE icei_41755838_staykoro"

# Rerun schema
mysql -u icei_41755838 -h sql113.iceiy.com -p icei_41755838_staykoro < database/schema.sql
```

---

## Development Workflow

### 1. Start Services in Order

```bash
# Terminal 1: Start MySQL (if not running)
sudo service mysql start

# Terminal 2: Start Backend
cd backend && npm run dev

# Terminal 3: Start Frontend
cd frontend && npm run dev
```

### 2. Frontend Hot Reload

Changes to React files automatically reload in browser

### 3. Backend Hot Reload

Backend restarts automatically on file changes (via nodemon)

---

## Building for Production

### Frontend Build

```bash
cd frontend
npm run build
# Creates optimized build in dist/
```

### Backend Deployment

```bash
cd backend
npm run build    # If using TypeScript
npm start        # Start production server
```

---

## Environment Variables Summary

### Backend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment | development |
| DB_USER | MySQL user | icei_41755838 |
| DB_PASSWORD | MySQL password | your_password |
| DB_HOST | Database host | sql113.iceiy.com |
| DB_PORT | Database port | 3306 |
| DB_NAME | Database name | icei_41755838_staykoro |
| JWT_SECRET | JWT signing key | secret-key-123 |
| JWT_EXPIRES_IN | Token expiration | 7d |
| CLIENT_URL | Frontend URL | http://staykoro.iceiy.com |

### Frontend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| VITE_API_URL | Backend API URL | http://localhost:5000/api |

---

## Next Steps

1. **Explore Features:**
   - Create properties (as host)
   - Make bookings (as guest)
   - Leave reviews
   - Access admin dashboard

2. **Customize:**
   - Modify colors in `frontend/tailwind.config.js`
   - Update API endpoints in `frontend/src/services/api.js`
   - Add more amenities to database

3. **Deploy:**
   - Frontend: Deploy to Vercel, Netlify
   - Backend: Deploy to Heroku, DigitalOcean, AWS

---

## Getting Help

- Check error messages in console/terminal
- Review API documentation in `docs/API_ENDPOINTS.md`
- Check database schema in `docs/DATABASE_DESIGN.md`
- Review backend logs for API errors

---

## Security Checklist (Before Production)

- [ ] Change all default passwords
- [ ] Update JWT_SECRET to a strong value
- [ ] Enable HTTPS
- [ ] Set NODE_ENV=production
- [ ] Review CORS settings
- [ ] Add rate limiting
- [ ] Set up proper error logging
- [ ] Configure database backups
- [ ] Use environment variables for sensitive data
- [ ] Implement input validation

---

**Happy coding! 🚀**
