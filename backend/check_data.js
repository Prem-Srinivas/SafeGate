const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const checkData = async () => {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        console.log('Checking Residents...');
        const [residents] = await connection.query('SELECT id, name, email, unit_number FROM residents');
        console.table(residents);

        console.log('Checking Security Guards...');
        const [guards] = await connection.query('SELECT id, name, email FROM security_guards');
        console.table(guards);

        console.log('Checking Admins...');
        const [admins] = await connection.query('SELECT id, name, email FROM admins');
        console.table(admins);

    } catch (error) {
        console.error('Check failed:', error);
    } finally {
        await connection.end();
    }
};

checkData();
