const express = require('express');
const auth = require('../middleware/auth');

module.exports = (db) => {
  const router = express.Router();

  // Get all activity logs with filtering and JOINs
  router.get('/', auth, (req, res) => {
    const { type, resident_id } = req.query;

    let query = `
      SELECT vp.*, u.name as resident_name, u.unit_number as resident_unit 
      FROM visitors_parcels vp 
      LEFT JOIN users u ON vp.resident_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (type) {
      query += ' AND vp.type = ?';
      params.push(type);
    }

    if (resident_id) {
      query += ' AND vp.resident_id = ?';
      params.push(resident_id);
    }

    query += ' ORDER BY vp.created_at DESC';

    db.query(query, params, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  });

  // Add new activity log
  router.post('/', auth, (req, res) => {
    const { resident_id, unit_number, type, name_details, purpose_description, media, vehicle_details, status } = req.body;

    let finalResidentId = resident_id;

    // Use logged-in user as security guard if they are one
    let securityGuardId = req.user.role === 'Security Guard' ? req.user.id : (req.body.security_guard_id || null);

    const proceedWithLog = (resId, secId) => {
      // Validate we have IDs
      if (!resId) return res.status(400).json({ message: 'Resident not found or Unit Number invalid' });

      db.query('INSERT INTO visitors_parcels (resident_id, security_guard_id, type, name_details, purpose_description, media, vehicle_details, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [resId, secId, type, name_details, purpose_description, media, vehicle_details, status], (err) => {
          if (err) {
            console.error('Visitor/Parcel Insert Error:', err);
            return res.status(500).json({ error: err.message });
          }
          res.json({ message: 'Entry added successfully' });
        });
    };

    if (unit_number && !finalResidentId) {
      // Look up resident by unit_number in users table
      db.query("SELECT id FROM users WHERE unit_number = ? AND role = 'Resident'", [unit_number], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'Resident with this Unit Number not found' });
        finalResidentId = results[0].id;
        proceedWithLog(finalResidentId, securityGuardId);
      });
    } else {
      proceedWithLog(finalResidentId, securityGuardId);
    }
  });

  // Update status
  router.put('/:id', auth, (req, res) => {
    const { status } = req.body;
    db.query('UPDATE visitors_parcels SET status = ? WHERE id = ?', [status, req.params.id], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Status updated' });
    });
  });

  return router;
};
