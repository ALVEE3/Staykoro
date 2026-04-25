import express from 'express';
import { query } from '../config/database.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// Admin only middleware
const adminOnly = [authenticateToken, authorizeRole('admin')];

// Get dashboard stats
router.get('/stats', adminOnly, async (req, res) => {
  try {
    const stats = {
      totalUsers: await query('SELECT COUNT(*) as count FROM users'),
      totalProperties: await query('SELECT COUNT(*) as count FROM properties'),
      totalBookings: await query('SELECT COUNT(*) as count FROM bookings'),
      totalRevenue: await query('SELECT SUM(total_price) as total FROM bookings WHERE status = ?', ['completed']),
      pendingProperties: await query('SELECT COUNT(*) as count FROM properties WHERE status = ?', ['pending']),
      usersByRole: await query('SELECT role, COUNT(*) as count FROM users GROUP BY role')
    };

    // Resolve all promises
    const resolvedStats = {};
    for (const [key, promise] of Object.entries(stats)) {
      const result = await promise;
      resolvedStats[key] = result.rows;
    }

    res.json(resolvedStats);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Get all users
router.get('/users', adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 10, role } = req.query;
    const offset = (page - 1) * limit;

    let sqlQuery = 'SELECT id, name, email, phone, role, created_at FROM users';
    const params = [];

    if (role) {
      sqlQuery += ' WHERE role = ?';
      params.push(role);
    }

    sqlQuery += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const result = await query(sqlQuery, params);
    const countResult = await query('SELECT COUNT(*) as count FROM users');

    res.json({
      users: result.rows,
      pagination: {
        total: parseInt(countResult.rows[0].count),
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get pending properties
router.get('/properties/pending', adminOnly, async (req, res) => {
  try {
    const result = await query(
      `SELECT p.*, u.name as host_name, u.email as host_email
       FROM properties p
       JOIN users u ON p.host_id = u.id
       WHERE p.status = ?
       ORDER BY p.created_at`,
      ['pending']
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get pending properties error:', error);
    res.status(500).json({ error: 'Failed to fetch pending properties' });
  }
});

// Approve property
router.post('/properties/:id/approve', adminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    await query(
      'UPDATE properties SET status = ? WHERE id = ?',
      ['approved', id]
    );

    const updatedResult = await query('SELECT * FROM properties WHERE id = ?', [id]);

    if (updatedResult.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json({
      message: 'Property approved successfully',
      property: updatedResult.rows[0]
    });
  } catch (error) {
    console.error('Approve property error:', error);
    res.status(500).json({ error: 'Failed to approve property' });
  }
});

// Reject property
router.post('/properties/:id/reject', adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    await query(
      'UPDATE properties SET status = ? WHERE id = ?',
      ['rejected', id]
    );

    const updatedResult = await query('SELECT * FROM properties WHERE id = ?', [id]);

    if (updatedResult.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json({
      message: 'Property rejected',
      property: updatedResult.rows[0],
      rejectionReason: reason
    });
  } catch (error) {
    console.error('Reject property error:', error);
    res.status(500).json({ error: 'Failed to reject property' });
  }
});

// Suspend user
router.post('/users/:id/suspend', adminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    await query(
      'UPDATE users SET is_active = ? WHERE id = ?',
      [0, id]
    );

    res.json({ message: 'User suspended successfully' });
  } catch (error) {
    console.error('Suspend user error:', error);
    res.status(500).json({ error: 'Failed to suspend user' });
  }
});

// Unsuspend user
router.post('/users/:id/unsuspend', adminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    await query(
      'UPDATE users SET is_active = ? WHERE id = ?',
      [1, id]
    );

    res.json({ message: 'User unsuspended successfully' });
  } catch (error) {
    console.error('Unsuspend user error:', error);
    res.status(500).json({ error: 'Failed to unsuspend user' });
  }
});

// Get all bookings (admin)
router.get('/bookings', adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    let sqlQuery = `
      SELECT b.*, p.title, u.name as guest_name
      FROM bookings b
      JOIN properties p ON b.property_id = p.id
      JOIN users u ON b.user_id = u.id
    `;
    const params = [];

    if (status) {
      sqlQuery += ' WHERE b.status = ?';
      params.push(status);
    }

    sqlQuery += ' ORDER BY b.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const result = await query(sqlQuery, params);

    res.json({
      bookings: result.rows,
      pagination: {
        total: result.rows.length, // This is only for the current page, should probably be total count
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

export default router;
