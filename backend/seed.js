const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const seedDatabase = async () => {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        console.log('Connected to database for seeding...');
        const hashedPassword = await bcrypt.hash('password123', 10);

        // Seed Users (Admin, Residents, Security Guards)
        const seedUser = async (role, name, email, contact, unit = null, badge = null) => {
            const [existing] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
            if (existing.length === 0) {
                await connection.execute(`
                    INSERT INTO users (name, email, password, role, contact_info, unit_number, badge_number) 
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `, [name, email, hashedPassword, role, contact, unit, badge]);
                console.log(`Seeded ${role}: ${name}`);
            } else {
                console.log(`${role} ${name} already exists.`);
            }
        };

        await seedUser('Resident', 'John Resident', 'john@example.com', '9876543210', 'A-101');
        await seedUser('Resident', 'Alice Resident', 'alice@example.com', '1234567890', 'B-202');
        await seedUser('Security Guard', 'Mike Guard', 'guard@safegate.com', '5555555555', null, 'SEC-001');
        await seedUser('Admin', 'Super Admin', 'admin@safegate.com', '123-ADMIN');

        // Seed Sample Activities (Visitors & Parcels)
        console.log('Seeding Activities...');
        const [john] = await connection.execute('SELECT id FROM users WHERE email = ?', ['john@example.com']);
        const [mike] = await connection.execute('SELECT id FROM users WHERE email = ?', ['guard@safegate.com']);

        if (john.length > 0 && mike.length > 0) {
            const residentId = john[0].id;
            const guardId = mike[0].id;

            // Check if already seeded to avoid duplicates (checking first log)
            const [activities] = await connection.execute('SELECT * FROM visitors_parcels WHERE resident_id = ?', [residentId]);
            if (activities.length === 0) {
                await connection.execute(`
                    INSERT INTO visitors_parcels (resident_id, security_guard_id, type, name_details, purpose_description, status) 
                    VALUES 
                    (?, ?, 'Visitor', 'Jane Doe', 'Family Visit', 'New'),
                    (?, ?, 'Parcel', 'Amazon Delivery', 'Book Package', 'Received')
                 `, [residentId, guardId, residentId, guardId]);
                console.log('Seeded Sample Visitor and Parcel for John');
            } else {
                console.log('Activities for John already exist, skipping.');
            }
        }

        console.log('Seeding completed successfully.');
    } catch (error) {
        console.error('Seeding failed:', error);
    } finally {
        await connection.end();
    }
};

seedDatabase();
