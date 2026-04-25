import express from 'express';
import { query } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateBooking, handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

// Create booking
router.post('/', authenticateToken, validateBooking, handleValidationErrors, async (req, res) => {
  try {
    const { property_id, check_in, check_out, guests } = req.body;
    const userId = req.user.id;

    // Check property exists
    const propertyResult = await query('SELECT * FROM properties WHERE id = ?', [property_id]);
    if (propertyResult.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const property = propertyResult.rows[0];

    // Check availability
    const conflictResult = await query(
      `SELECT * FROM bookings 
       WHERE property_id = ? 
       AND status != ?
       AND check_in < ? 
       AND check_out > ?`,
      [property_id, 'cancelled', check_out, check_in]
    );

    if (conflictResult.rows.length > 0) {
      return res.status(409).json({ error: 'Property not available for selected dates' });
    }

    // Calculate total price
    const checkInDate = new Date(check_in);
    const checkOutDate = new Date(check_out);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * property.price_per_night;

    // Create booking
    const bookingResult = await query(
      `INSERT INTO bookings (user_id, property_id, check_in, check_out, total_price, guests, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, property_id, check_in, check_out, totalPrice, guests || 1, 'pending']
    );

    const bookingId = bookingResult.rows.insertId;
    const finalBookingResult = await query('SELECT * FROM bookings WHERE id = ?', [bookingId]);

    res.status(201).json({
      message: 'Booking created successfully',
      booking: finalBookingResult.rows[0]
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Get user bookings
router.get('/user/my-bookings', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;

    let sqlQuery = `
      SELECT b.*, p.title, p.image_url 
      FROM bookings b
      JOIN properties p ON b.property_id = p.id
      WHERE b.user_id = ?
    `;
    const params = [userId];

    if (status) {
      sqlQuery += ` AND b.status = ?`;
      params.push(status);
    }

    sqlQuery += ` ORDER BY b.created_at DESC`;

    const result = await query(sqlQuery, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Get booking details
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT b.*, p.title, p.description, p.image_url, u.name as host_name
       FROM bookings b
       JOIN properties p ON b.property_id = p.id
       JOIN users u ON p.host_id = u.id
       WHERE b.id = ?`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const booking = result.rows[0];

    // Check if user is owner or host
    if (booking.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

// Cancel booking
router.put('/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const bookingCheck = await query('SELECT * FROM bookings WHERE id = ?', [id]);
    if (bookingCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (bookingCheck.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await query(
      `UPDATE bookings SET status = ? WHERE id = ?`,
      ['cancelled', id]
    );

    const updatedBooking = await query('SELECT * FROM bookings WHERE id = ?', [id]);

    res.json({
      message: 'Booking cancelled successfully',
      booking: updatedBooking.rows[0]
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

export default router;
