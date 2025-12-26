const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

module.exports = (db) => {
  const router = express.Router();

  // Register
  router.post('/register', async (req, res) => {
    const { name, role, contact_info, password, email, unit_number, badge_number } = req.body;

    const userEmail = email || contact_info; // Fallback

    if (!userEmail || !password || !name || !role) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Role validation
    if (!['Admin', 'Resident', 'Security Guard'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const query = 'INSERT INTO users (name, email, password, role, contact_info, unit_number, badge_number) VALUES (?, ?, ?, ?, ?, ?, ?)';
      const params = [
        name,
        userEmail,
        hashedPassword,
        role,
        contact_info || null,
        unit_number || null,
        badge_number || null
      ];

      db.query(query, params, (err) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Email already exists' });
          }
          return res.status(500).json({ message: err.message });
        }
        res.json({ message: 'User registered successfully' });
      });
    } catch (err) {
      res.status(500).json({ message: 'Server error during registration' });
    }
  });

  // Login
  router.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

      const user = results[0];

      // Verify password (allowing direct comparison for legacy hashes if needed, but standardizing on bcrypt)
      // Assuming all passwords are now bcrypt hased or we accept "test" hack.
      // Re-enabling bcrypt check properly.
      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(401).json({ message: 'Invalid credentials' });

      const token = jwt.sign({ id: user.id, role: user.role }, 'secretkey');
      const { password: _, ...userWithoutPassword } = user;
      res.json({ token, user: userWithoutPassword });
    });
  });

  // Get users
  router.get('/', auth, (req, res) => {
    // Optional query param to filter by role
    const { role } = req.query;
    let query = 'SELECT id, name, email, role, contact_info, unit_number, badge_number FROM users';
    let params = [];

    if (role) {
      query += ' WHERE role = ?';
      params.push(role);
    }

    query += ' ORDER BY created_at DESC';

    db.query(query, params, (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    });
  });

  // Delete user
  router.delete('/:id', auth, (req, res) => {
    db.query('DELETE FROM users WHERE id = ?', [req.params.id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
      res.json({ message: 'User deleted' });
    });
  });

  return router;
};
