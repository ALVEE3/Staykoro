import express from 'express';
import { query } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateReview, handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

// Create review
router.post('/', authenticateToken, validateReview, handleValidationErrors, async (req, res) => {
  try {
    const { property_id, booking_id, rating, comment } = req.body;
    const userId = req.user.id;

    // Check if user has completed booking
    if (booking_id) {
      const bookingResult = await query(
        'SELECT * FROM bookings WHERE id = ? AND user_id = ? AND status = ?',
        [booking_id, userId, 'completed']
      );

      if (bookingResult.rows.length === 0) {
        return res.status(403).json({ error: 'Only completed bookings can be reviewed' });
      }
    }

    // Check if already reviewed
    const existingReview = await query(
      'SELECT * FROM reviews WHERE property_id = ? AND user_id = ?',
      [property_id, userId]
    );

    if (existingReview.rows.length > 0) {
      return res.status(400).json({ error: 'You have already reviewed this property' });
    }

    const result = await query(
      'INSERT INTO reviews (user_id, property_id, rating, comment) VALUES (?, ?, ?, ?)',
      [userId, property_id, rating, comment]
    );

    const reviewId = result.rows.insertId;
    const finalReviewResult = await query('SELECT * FROM reviews WHERE id = ?', [reviewId]);

    res.status(201).json({
      message: 'Review created successfully',
      review: finalReviewResult.rows[0]
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ error: 'Failed to create review' });
  }
});

// Get property reviews
router.get('/property/:propertyId', async (req, res) => {
  try {
    const { propertyId } = req.params;

    const result = await query(
      `SELECT r.*, u.name, u.id as user_id 
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.property_id = ?
       ORDER BY r.created_at DESC`,
      [propertyId]
    );

    const ratingResult = await query(
      'SELECT AVG(rating) as average_rating FROM reviews WHERE property_id = ?',
      [propertyId]
    );

    res.json({
      reviews: result.rows,
      averageRating: parseFloat(ratingResult.rows[0].average_rating || 0).toFixed(1)
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Update review
router.put('/:id', authenticateToken, validateReview, handleValidationErrors, async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const reviewCheck = await query('SELECT * FROM reviews WHERE id = ?', [id]);
    if (reviewCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }

    if (reviewCheck.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await query(
      'UPDATE reviews SET rating = ?, comment = ? WHERE id = ?',
      [rating, comment, id]
    );

    const updatedReview = await query('SELECT * FROM reviews WHERE id = ?', [id]);

    res.json({
      message: 'Review updated successfully',
      review: updatedReview.rows[0]
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ error: 'Failed to update review' });
  }
});

// Delete review
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const reviewResult = await query('SELECT * FROM reviews WHERE id = ?', [id]);
    if (reviewResult.rows.length === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }

    if (reviewResult.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await query('DELETE FROM reviews WHERE id = ?', [id]);

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

export default router;
