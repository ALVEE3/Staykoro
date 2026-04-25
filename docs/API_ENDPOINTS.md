# Staykoro - API Endpoints Documentation

## Authentication Endpoints

### Register
- **URL:** `POST /api/auth/register`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+880XXXXXXXXXX",
    "password": "SecurePass123",
    "role": "guest" // or "host"
  }
  ```
- **Response:** `201 Created`
  ```json
  {
    "message": "User registered successfully",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "guest"
    },
    "token": "JWT_TOKEN"
  }
  ```

### Login
- **URL:** `POST /api/auth/login`
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "SecurePass123"
  }
  ```
- **Response:** `200 OK`
  ```json
  {
    "message": "Login successful",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "guest"
    },
    "token": "JWT_TOKEN"
  }
  ```

### Verify Token
- **URL:** `GET /api/auth/verify`
- **Headers:** `Authorization: Bearer JWT_TOKEN`
- **Response:** `200 OK`
  ```json
  {
    "user": {
      "id": 1,
      "email": "john@example.com",
      "role": "guest"
    }
  }
  ```

---

## Property Endpoints

### Get All Properties
- **URL:** `GET /api/properties`
- **Query Parameters:**
  - `location` (string) - Filter by location
  - `minPrice` (number) - Minimum price
  - `maxPrice` (number) - Maximum price
  - `capacity` (number) - Minimum capacity
  - `page` (number, default: 1) - Page number
  - `limit` (number, default: 12) - Items per page
- **Response:** `200 OK`
  ```json
  {
    "properties": [...],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 12,
      "pages": 9
    }
  }
  ```

### Get Single Property
- **URL:** `GET /api/properties/:id`
- **Response:** `200 OK`
  ```json
  {
    "id": 1,
    "title": "Cozy Apartment",
    "description": "...",
    "price_per_night": 2500,
    "location": "Dhaka",
    "capacity": 4,
    "amenities": [...],
    "reviews": [...]
  }
  ```

### Create Property (Host Only)
- **URL:** `POST /api/properties`
- **Headers:** `Authorization: Bearer JWT_TOKEN`
- **Body:**
  ```json
  {
    "title": "Beautiful Villa",
    "description": "Amazing property...",
    "price_per_night": 5000,
    "location": "Cox's Bazar",
    "capacity": 6,
    "bedrooms": 3,
    "bathrooms": 2,
    "amenities": [1, 2, 3]
  }
  ```
- **Response:** `201 Created`

### Update Property (Host Only)
- **URL:** `PUT /api/properties/:id`
- **Headers:** `Authorization: Bearer JWT_TOKEN`
- **Body:** Same as create
- **Response:** `200 OK`

### Delete Property (Host Only)
- **URL:** `DELETE /api/properties/:id`
- **Headers:** `Authorization: Bearer JWT_TOKEN`
- **Response:** `200 OK`

---

## Booking Endpoints

### Create Booking
- **URL:** `POST /api/bookings`
- **Headers:** `Authorization: Bearer JWT_TOKEN`
- **Body:**
  ```json
  {
    "property_id": 1,
    "check_in": "2024-05-01",
    "check_out": "2024-05-05",
    "guests": 2
  }
  ```
- **Response:** `201 Created`

### Get User Bookings
- **URL:** `GET /api/bookings/user/my-bookings`
- **Headers:** `Authorization: Bearer JWT_TOKEN`
- **Query Parameters:** `status` (optional) - Filter by status
- **Response:** `200 OK`

### Get Booking Details
- **URL:** `GET /api/bookings/:id`
- **Headers:** `Authorization: Bearer JWT_TOKEN`
- **Response:** `200 OK`

### Cancel Booking
- **URL:** `PUT /api/bookings/:id/cancel`
- **Headers:** `Authorization: Bearer JWT_TOKEN`
- **Response:** `200 OK`

---

## Review Endpoints

### Create Review
- **URL:** `POST /api/reviews`
- **Headers:** `Authorization: Bearer JWT_TOKEN`
- **Body:**
  ```json
  {
    "property_id": 1,
    "booking_id": 5,
    "rating": 5,
    "comment": "Amazing experience!"
  }
  ```
- **Response:** `201 Created`

### Get Property Reviews
- **URL:** `GET /api/reviews/property/:propertyId`
- **Response:** `200 OK`
  ```json
  {
    "reviews": [...],
    "averageRating": "4.8"
  }
  ```

### Update Review
- **URL:** `PUT /api/reviews/:id`
- **Headers:** `Authorization: Bearer JWT_TOKEN`
- **Body:** Same as create
- **Response:** `200 OK`

### Delete Review
- **URL:** `DELETE /api/reviews/:id`
- **Headers:** `Authorization: Bearer JWT_TOKEN`
- **Response:** `200 OK`

---

## User Endpoints

### Get Profile
- **URL:** `GET /api/users/profile`
- **Headers:** `Authorization: Bearer JWT_TOKEN`
- **Response:** `200 OK`

### Update Profile
- **URL:** `PUT /api/users/profile`
- **Headers:** `Authorization: Bearer JWT_TOKEN`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "phone": "+880XXXXXXXXXX"
  }
  ```
- **Response:** `200 OK`

### Get User Stats
- **URL:** `GET /api/users/stats`
- **Headers:** `Authorization: Bearer JWT_TOKEN`
- **Response:** `200 OK`

---

## Admin Endpoints

### Get Dashboard Stats
- **URL:** `GET /api/admin/stats`
- **Headers:** `Authorization: Bearer JWT_TOKEN` (Admin only)
- **Response:** `200 OK`

### Get Pending Properties
- **URL:** `GET /api/admin/properties/pending`
- **Headers:** `Authorization: Bearer JWT_TOKEN` (Admin only)
- **Response:** `200 OK`

### Approve Property
- **URL:** `POST /api/admin/properties/:id/approve`
- **Headers:** `Authorization: Bearer JWT_TOKEN` (Admin only)
- **Response:** `200 OK`

### Reject Property
- **URL:** `POST /api/admin/properties/:id/reject`
- **Headers:** `Authorization: Bearer JWT_TOKEN` (Admin only)
- **Body:**
  ```json
  {
    "reason": "Does not meet quality standards"
  }
  ```
- **Response:** `200 OK`

---

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error message"
}
```

Common HTTP status codes:
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource conflict (e.g., already exists)
- `500 Internal Server Error` - Server error
