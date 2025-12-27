import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: (process.env.DB_HOST || 'localhost').trim(),
    user: (process.env.DB_USER || 'root').trim(),
    password: (process.env.DB_PASSWORD || 'Prem31@@').trim(),
    database: (process.env.DB_NAME || 'visitor_management').trim(),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export const initDB = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Database connected successfully.');

        // Create Users Table (Matches server.js)
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role ENUM('Resident', 'Security Guard', 'Admin') NOT NULL,
                contact_info VARCHAR(255),
                unit_number VARCHAR(50),
                badge_number VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create Visitors & Parcels Table (Matches server.js)
        await connection.query(`
            CREATE TABLE IF NOT EXISTS visitors_parcels (
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
            )
        `);

        console.log('Tables initialized.');
        connection.release();
    } catch (error) {
        console.error('Database initialization failed:', error);
    }
};

export default pool;
