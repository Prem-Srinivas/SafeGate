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
    SELECT contact_info, GROUP_CONCAT(id ORDER BY id DESC) as ids
    FROM users 
    GROUP BY contact_info 
    HAVING COUNT(*) > 1
  `, async (err, duplicates) => {
        if (err) throw err;

        if (duplicates.length === 0) {
            console.log('No duplicates found.');
            addConstraint();
            return;
        }

        console.log(`Found ${duplicates.length} duplicate groups.`);

        for (const dup of duplicates) {
            const allIds = dup.ids.split(',').map(Number);
            const keepId = allIds[0]; // Max ID because of ORDER BY DESC
            const deleteIds = allIds.slice(1);

            if (deleteIds.length === 0) continue;

            console.log(`Processing ${dup.contact_info}: Keeping ${keepId}, deleting ${deleteIds.length} users.`);

            const deleteIdsStr = deleteIds.join(',');

            // Update resident_id
            try {
                await queryPromise(`UPDATE activity_logs SET resident_id = ? WHERE resident_id IN (${deleteIdsStr})`, [keepId]);
                await queryPromise(`UPDATE activity_logs SET security_guard_id = ? WHERE security_guard_id IN (${deleteIdsStr})`, [keepId]);
                await queryPromise(`DELETE FROM users WHERE id IN (${deleteIdsStr})`);
                console.log(`Cleaned ${dup.contact_info}`);
            } catch (e) {
                console.error(`Failed to clean ${dup.contact_info}:`, e);
            }
        }

        addConstraint();
    });
});

function queryPromise(sql, args = []) {
    return new Promise((resolve, reject) => {
        db.query(sql, args, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        });
    });
}

function addConstraint() {
    db.query(`
     ALTER TABLE users ADD UNIQUE (contact_info);
  `, (err) => {
        if (err) console.log('Could not add unique constraint (might already exist):', err.message);
        else console.log('Added UNIQUE constraint to contact_info');
        process.exit();
    });
}
