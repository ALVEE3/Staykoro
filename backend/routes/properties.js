import express from 'express';
import { query } from '../config/database.js';
import { authenticateToken, authorizeRole, optionalAuth } from '../middleware/auth.js';
import { validateProperty, handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

// Get all properties with filters
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { location, minPrice, maxPrice, capacity, amenity, page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;

    let sqlQuery = 'SELECT * FROM properties WHERE status = ?';
    const params = ['approved'];

    if (location) {
      sqlQuery += ' AND location LIKE ?';
      params.push(`%${location}%`);
    }

    if (minPrice) {
      sqlQuery += ' AND price_per_night >= ?';
      params.push(parseFloat(minPrice));
    }

    if (maxPrice) {
      sqlQuery += ' AND price_per_night <= ?';
      params.push(parseFloat(maxPrice));
    }

    if (capacity) {
      sqlQuery += ' AND capacity >= ?';
      params.push(parseInt(capacity));
    }

    sqlQuery += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const result = await query(sqlQuery, params);
    const countResult = await query('SELECT COUNT(*) as total FROM properties WHERE status = ?', ['approved']);
    const totalCount = countResult.rows[0].total;

    res.json({
      properties: result.rows,
      pagination: {
        total: parseInt(totalCount),
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(parseInt(totalCount) / limit)
      }
    });
  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// Get single property
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const propertyResult = await query('SELECT * FROM properties WHERE id = ?', [id]);
    if (propertyResult.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const property = propertyResult.rows[0];

    // Get amenities
    const amenitiesResult = await query(
      `SELECT a.id, a.name FROM amenities a 
       JOIN property_amenities pa ON a.id = pa.amenity_id 
       WHERE pa.property_id = ?`,
      [id]
    );

    // Get reviews
    const reviewsResult = await query(
      'SELECT rating, comment, created_at FROM reviews WHERE property_id = ? ORDER BY created_at DESC LIMIT 5',
      [id]
    );

    res.json({
      ...property,
      amenities: amenitiesResult.rows,
      reviews: reviewsResult.rows
    });
  } catch (error) {
    console.error('Get property error:', error);
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});

// Create property (Host only)
router.post('/', authenticateToken, authorizeRole('host'), validateProperty, handleValidationErrors, async (req, res) => {
  try {
    const { title, description, price_per_night, location, capacity, amenities } = req.body;
    const hostId = req.user.id;

    // Create property
    const result = await query(
      `INSERT INTO properties (title, description, price_per_night, location, host_id, capacity, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, description, price_per_night, location, hostId, capacity, 'pending']
    );

    const propertyId = result.rows.insertId;
    const propertyResult = await query('SELECT * FROM properties WHERE id = ?', [propertyId]);
    const property = propertyResult.rows[0];

    // Add amenities if provided
    if (amenities && Array.isArray(amenities)) {
      for (const amenityId of amenities) {
        await query(
          'INSERT INTO property_amenities (property_id, amenity_id) VALUES (?, ?)',
          [property.id, amenityId]
        );
      }
    }

    res.status(201).json({
      message: 'Property created successfully. Pending admin approval.',
      property
    });
  } catch (error) {
    console.error('Create property error:', error);
    res.status(500).json({ error: 'Failed to create property' });
  }
});

// Update property (Host only)
router.put('/:id', authenticateToken, authorizeRole('host'), validateProperty, handleValidationErrors, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price_per_night, location, capacity } = req.body;

    // Check if property belongs to user
    const propertyCheck = await query('SELECT * FROM properties WHERE id = ?', [id]);
    if (propertyCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    if (propertyCheck.rows[0].host_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await query(
      `UPDATE properties 
       SET title = ?, description = ?, price_per_night = ?, location = ?, capacity = ?
       WHERE id = ?`,
      [title, description, price_per_night, location, capacity, id]
    );

    const updatedResult = await query('SELECT * FROM properties WHERE id = ?', [id]);

    res.json({
      message: 'Property updated successfully',
      property: updatedResult.rows[0]
    });
  } catch (error) {
    console.error('Update property error:', error);
    res.status(500).json({ error: 'Failed to update property' });
  }
});

// Delete property (Host only)
router.delete('/:id', authenticateToken, authorizeRole('host'), async (req, res) => {
  try {
    const { id } = req.params;

    const propertyResult = await query('SELECT * FROM properties WHERE id = ?', [id]);
    if (propertyResult.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    if (propertyResult.rows[0].host_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await query('DELETE FROM property_amenities WHERE property_id = ?', [id]);
    await query('DELETE FROM properties WHERE id = ?', [id]);

    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Delete property error:', error);
    res.status(500).json({ error: 'Failed to delete property' });
  }
});

export default router;
