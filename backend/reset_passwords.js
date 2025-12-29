const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(async (err) => {
    if (err) throw err;
    console.log('Connected to MySQL');

    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query('UPDATE users SET password = ?', [hashedPassword], (err, result) => {
        if (err) throw err;
        console.log(`Updated users with password: ${password}`);
        process.exit();
    });
});
