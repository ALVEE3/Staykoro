import express from 'express';
import bcrypt from 'bcrypt';
import { query } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      'SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, phone } = req.body;

    await query(
      'UPDATE users SET name = ?, phone = ? WHERE id = ?',
      [name, phone, req.user.id]
    );

    const updatedUser = await query('SELECT id, name, email, phone, role FROM users WHERE id = ?', [req.user.id]);

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser.rows[0]
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Change password
router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Both passwords required' });
    }

    const userResult = await query('SELECT * FROM users WHERE id = ?', [req.user.id]);
    const user = userResult.rows[0];

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, req.user.id]
    );

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// Get user's properties (for hosts)
router.get('/properties', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM properties WHERE host_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// Get user stats (for dashboard)
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get booking stats
    const bookingStats = await query(
      `SELECT 
         COUNT(*) as total_bookings,
         SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_bookings,
         SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_bookings,
         SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_bookings
       FROM bookings WHERE user_id = ?`,
      [userId]
    );

    // Get total spent
    const spendStats = await query(
      'SELECT SUM(total_price) as total_spent FROM bookings WHERE user_id = ? AND status = ?',
      [userId, 'completed']
    );

    // Get host stats if host
    let hostStats = null;
    const userResult = await query('SELECT role FROM users WHERE id = ?', [userId]);
    if (userResult.rows[0].role === 'host') {
      hostStats = await query(
        `SELECT 
           COUNT(p.id) as total_properties,
           SUM(CASE WHEN p.status = 'approved' THEN 1 ELSE 0 END) as approved_properties,
           SUM(CASE WHEN p.status = 'pending' THEN 1 ELSE 0 END) as pending_properties
         FROM properties p WHERE p.host_id = ?`,
        [userId]
      );
    }

    res.json({
      bookingStats: bookingStats.rows[0],
      spendStats: spendStats.rows[0],
      hostStats: hostStats ? hostStats.rows[0] : null
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;
