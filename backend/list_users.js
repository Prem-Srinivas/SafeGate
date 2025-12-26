const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) throw err;
    db.query('SELECT name, role, contact_info FROM users', (err, results) => {
        if (err) throw err;
        console.log('Current Users:');
        require('fs').writeFileSync('users.txt', JSON.stringify(results, null, 2));
        process.exit();
    });
});
