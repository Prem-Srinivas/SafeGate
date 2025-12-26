const mysql = require('mysql2');
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

    // Step 1: Find duplicates
    db.query(`
    SELECT contact_info, COUNT(*) as count 
    FROM users 
    GROUP BY contact_info 
    HAVING count > 1
  `, (err, duplicates) => {
        if (err) throw err;

        if (duplicates.length === 0) {
            console.log('No duplicates found.');
            process.exit();
        }

        console.log(`Found ${duplicates.length} duplicate groups.`);

        // Step 2: Delete duplicates
        let completed = 0;
        duplicates.forEach(dup => {
            db.query(`
        DELETE FROM users 
        WHERE contact_info = ? 
        AND id NOT IN (
          SELECT id FROM (
            SELECT MAX(id) as id FROM users WHERE contact_info = ?
          ) as tmp
        )
      `, [dup.contact_info, dup.contact_info], (err) => {
                if (err) console.error(err);
                else console.log(`Cleaned duplicates for ${dup.contact_info}`);

                completed++;
                if (completed === duplicates.length) {
                    console.log('Deduplication complete.');

                    // Step 3: Add Unique Constraint safely
                    db.query(`
             ALTER TABLE users ADD UNIQUE (contact_info);
          `, (err) => {
                        if (err) console.log('Could not add unique constraint (might already exist or other issue):', err.message);
                        else console.log('Added UNIQUE constraint to contact_info');
                        process.exit();
                    });
                }
            });
        });
    });
});
