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
    console.log('Connected to MySQL to remove sample users');

    const emailsToDelete = [
        'admin@safegate.com',
        'john@example.com',
        'guard@safegate.com'
    ];

    // Delete related logs first
    const deleteLogsQuery = `
        DELETE FROM activity_logs 
        WHERE resident_id IN (SELECT id FROM users WHERE contact_info IN (?))
        OR security_guard_id IN (SELECT id FROM users WHERE contact_info IN (?))
    `;

    db.query(deleteLogsQuery, [emailsToDelete, emailsToDelete], (err) => {
        if (err) {
            console.error('Error deleting activity logs:', err);
            process.exit(1);
        }
        console.log('Related activity logs deleted');

        // Delete users
        const deleteUsersQuery = 'DELETE FROM users WHERE contact_info IN (?)';
        db.query(deleteUsersQuery, [emailsToDelete], (err, result) => {
            if (err) {
                console.error('Error deleting users:', err);
                process.exit(1);
            }
            console.log(`Deleted ${result.affectedRows} sample user(s)`);
            process.exit(0);
        });
    });
});
