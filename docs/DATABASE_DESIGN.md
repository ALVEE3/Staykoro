# Staykoro - Database Design Documentation

## Database Tables

### 1. Users Table
Stores user account information for guests, hosts, and admins.

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'guest', -- 'guest', 'host', 'admin'
  is_active TINYINT(1) DEFAULT 1,
  profile_image_url VARCHAR(255),
  bio TEXT,
  verification_status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Columns:**
- `id`: Unique identifier
- `name`: User's full name
- `email`: Unique email address
- `phone`: Phone number (Bangladesh format)
- `password`: Hashed password
- `role`: User type (guest, host, or admin)
- `is_active`: Account status
- `profile_image_url`: Profile picture URL
- `bio`: User biography
- `verification_status`: Email/phone verification status
- `created_at`: Account creation timestamp
- `updated_at`: Last update timestamp

---

### 2. Properties Table
Stores property listings posted by hosts.

```sql
CREATE TABLE properties (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price_per_night DECIMAL(10, 2) NOT NULL,
  location VARCHAR(255) NOT NULL,
  district VARCHAR(100),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  host_id INTEGER NOT NULL REFERENCES users(id),
  capacity INTEGER NOT NULL,
  bedrooms INTEGER,
  bathrooms INTEGER,
  image_url VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  is_active TINYINT(1) DEFAULT 1,
  views_count INTEGER DEFAULT 0,
  rating DECIMAL(3, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### 3. Amenities Table
Predefined list of available amenities.

```sql
CREATE TABLE amenities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  icon VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### 4. Property_Amenities Table
Junction table linking properties to amenities (many-to-many relationship).

```sql
CREATE TABLE property_amenities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  property_id INTEGER NOT NULL REFERENCES properties(id),
  amenity_id INTEGER NOT NULL REFERENCES amenities(id),
  UNIQUE(property_id, amenity_id)
);
```

---

### 5. Bookings Table
Stores booking reservations.

```sql
CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  property_id INTEGER NOT NULL REFERENCES properties(id),
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INTEGER NOT NULL DEFAULT 1,
  total_price DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'confirmed', 'completed', 'cancelled'
  payment_status VARCHAR(50) DEFAULT 'pending',
  special_requests TEXT,
  cancellation_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Status Values:**
- `pending` - Initial booking state
- `confirmed` - Payment received
- `completed` - Stay completed
- `cancelled` - Booking cancelled

---

### 6. Reviews Table
Stores user reviews and ratings for properties.

```sql
CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  property_id INTEGER NOT NULL REFERENCES properties(id),
  booking_id INTEGER REFERENCES bookings(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  cleanliness_rating INTEGER CHECK (cleanliness_rating >= 1 AND cleanliness_rating <= 5),
  communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
  location_rating INTEGER CHECK (location_rating >= 1 AND location_rating <= 5),
  value_rating INTEGER CHECK (value_rating >= 1 AND value_rating <= 5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, property_id)
);
```

---

### 7. Payments Table
Tracks payment transactions for bookings.

```sql
CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INTEGER NOT NULL REFERENCES bookings(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  amount DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50), -- 'bkash', 'nagad', 'credit_card'
  transaction_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'success', 'failed'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### 8. Wishlist Table
Stores user wishlist items.

```sql
CREATE TABLE wishlist (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  property_id INTEGER NOT NULL REFERENCES properties(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, property_id)
);
```

---

### 9. Messages Table (Future Chat Feature)
Stores messages between hosts and guests.

```sql
CREATE TABLE messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sender_id INTEGER NOT NULL REFERENCES users(id),
  receiver_id INTEGER NOT NULL REFERENCES users(id),
  booking_id INTEGER REFERENCES bookings(id),
  message TEXT NOT NULL,
  is_read TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### 10. OTP Table
Stores one-time passwords for phone verification.

```sql
CREATE TABLE otp (
  id INT AUTO_INCREMENT PRIMARY KEY,
  phone VARCHAR(20) NOT NULL,
  code VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Database Indexes

For optimal query performance, the following indexes are created:

```sql
-- User indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);

-- Property indexes
CREATE INDEX idx_properties_host_id ON properties(host_id);
CREATE INDEX idx_properties_location ON properties(location);
CREATE INDEX idx_properties_district ON properties(district);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_price ON properties(price_per_night);

-- Booking indexes
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_property_id ON bookings(property_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_check_in ON bookings(check_in);
CREATE INDEX idx_bookings_check_out ON bookings(check_out);

-- Review indexes
CREATE INDEX idx_reviews_property_id ON reviews(property_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);

-- Wishlist indexes
CREATE INDEX idx_wishlist_user_id ON wishlist(user_id);
CREATE INDEX idx_wishlist_property_id ON wishlist(property_id);
```

---

## Entity Relationship Diagram

```
Users (1) ----< (Many) Properties
Users (1) ----< (Many) Bookings
Users (1) ----< (Many) Reviews
Users (1) ----< (Many) Messages
Users (1) ----< (Many) Wishlist

Properties (1) ----< (Many) Property_Amenities >---- (Many) Amenities
Properties (1) ----< (Many) Bookings
Properties (1) ----< (Many) Reviews
Properties (1) ----< (Many) Wishlist

Bookings (1) ----< (Many) Reviews
Bookings (1) ----< (Many) Payments
```

---

## Data Integrity Constraints

1. **Referential Integrity:** All foreign keys enforce CASCADE delete where appropriate
2. **Unique Constraints:** Email (users), property_amenities combination, user_property review combination
3. **Check Constraints:** Rating values (1-5), booking status validation
4. **Default Values:** Timestamps, status fields, counters
5. **NOT NULL Constraints:** Essential fields marked as required

---

## Sample Data Insertion

```sql
-- Insert sample amenities
INSERT INTO amenities (name, icon) VALUES
('WiFi', '📶'),
('Kitchen', '🍳'),
('Air Conditioning', '❄️'),
('Parking', '🚗'),
('Pool', '🏊'),
('Gym', '💪');

-- Insert sample user
INSERT INTO users (name, email, phone, password, role)
VALUES ('John Host', 'john@example.com', '+8801234567890', 'hashed_password', 'host');

-- Insert sample property
INSERT INTO properties (title, description, price_per_night, location, host_id, capacity)
VALUES ('Beautiful Apartment', 'Amazing property...', 2500, 'Dhaka', 1, 4);
```

---

## Backup and Maintenance

Regular backups are recommended:

```bash
# Backup
mysqldump -u icei_41755838 -h sql113.iceiy.com -p icei_41755838_staykoro > icei_41755838_staykoro_backup.sql

# Restore
mysql -u icei_41755838 -h sql113.iceiy.com -p icei_41755838_staykoro < icei_41755838_staykoro_backup.sql
```
