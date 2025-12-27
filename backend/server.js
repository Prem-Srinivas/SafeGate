const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: (process.env.DB_HOST || 'localhost').trim(),
  user: (process.env.DB_USER || 'root').trim(),
  password: (process.env.DB_PASSWORD || 'Prem31@@').trim(),
  database: (process.env.DB_NAME || 'visitor_management').trim()
});

db.connect((err) => {
  if (err) {
    console.error('MySQL connection error details:');
    console.error('Host:', process.env.DB_HOST || 'localhost');
    console.error('User:', process.env.DB_USER || 'root');
    console.error('Error Code:', err.code);
    console.error('SQL State:', err.sqlState);
    throw err;
  }
  console.log('Connected to MySQL successfully');

  // Create tables if not exist
  const createTables = async () => {
    const queries = [
      `CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('Resident', 'Security Guard', 'Admin') NOT NULL,
        contact_info VARCHAR(255),
        unit_number VARCHAR(50),
        badge_number VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS visitors_parcels (
        id INT AUTO_INCREMENT PRIMARY KEY,
        resident_id INT,
        security_guard_id INT,
        type ENUM('Visitor', 'Parcel') NOT NULL,
        name_details VARCHAR(255) NOT NULL,
        purpose_description TEXT,
        media VARCHAR(255),
        vehicle_details VARCHAR(255),
        status VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (resident_id) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (security_guard_id) REFERENCES users(id) ON DELETE SET NULL
      )`
    ];

    for (const query of queries) {
      await db.promise().query(query).catch(err => console.error('Error creating table:', err));
    }

    // Ensure missing columns exist in users table (for existing installations)
    const alterQueries = [
      `ALTER TABLE users ADD COLUMN unit_number VARCHAR(50) AFTER contact_info`,
      `ALTER TABLE users ADD COLUMN badge_number VARCHAR(50) AFTER unit_number`
    ];

    for (const query of alterQueries) {
      await db.promise().query(query).catch(err => {
        // Suppress errors if column already exists
        if (err.code !== 'ER_DUP_COLUMN_NAME' && err.errno !== 1060) {
          console.error('Info: Column already exists or other minor DB notice.');
        }
      });
    }

    console.log('All tables checked/created');
  };

  createTables();

  // Root route
  app.get('/', (req, res) => {
    res.json({
      message: 'SafeGate API Server is running',
      status: 'success',
      frontend_url: 'http://localhost:4200'
    });
  });

  // Start server after DB is ready
  app.use('/api/users', require('./routes/users')(db));
  app.use('/api/activity-logs', require('./routes/activityLogs')(db));

  app.listen(process.env.PORT || 3000, '0.0.0.0', () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
  });
});
