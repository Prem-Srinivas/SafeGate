const mysql = require('mysql2/promise');
require('dotenv').config();

const fixSchema = async () => {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        console.log('Connected to database. Cleaning up old schema...');

        // Drop old tables
        const tables = ['activity_logs', 'residents', 'security_guards', 'admins'];

        for (const table of tables) {
            console.log(`Dropping ${table}...`);
            await connection.query(`DROP TABLE IF EXISTS ${table}`);
        }

        console.log('Old schema cleanup done. Ensure new tables (users, visitors_parcels) are created by restarting server or running setup-database.sql.');
    } catch (error) {
        console.error('Schema fix failed:', error);
    } finally {
        await connection.end();
    }
};

fixSchema();
