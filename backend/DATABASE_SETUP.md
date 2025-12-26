# MySQL Database Connection Guide

## Prerequisites
You need to have MySQL installed on your system. If not installed, download from: https://dev.mysql.com/downloads/mysql/

## Step 1: Start MySQL Server
Make sure your MySQL server is running. You can:
- Open MySQL Workbench and start the server
- Or use Windows Services to start MySQL service
- Or use XAMPP/WAMP if you have those installed

## Step 2: Create Database Using MySQL Workbench (Recommended)

1. Open **MySQL Workbench**
2. Connect to your local MySQL instance (usually localhost:3306)
3. Enter your MySQL root password when prompted
4. Open the SQL script file: `backend/setup-database.sql`
5. Click the lightning bolt icon to execute the script
6. This will create the database, tables, and sample data

## Step 3: Alternative - Create Database Using Command Line

If you prefer command line, navigate to your MySQL installation bin folder and run:

```bash
# Navigate to MySQL bin folder (example path, adjust to your installation)
cd "C:\Program Files\MySQL\MySQL Server 8.0\bin"

# Login to MySQL
mysql -u root -p

# Enter your password when prompted, then run:
source C:\Users\pream\Downloads\matrimony\visitor-and-parcel-management-system-for-gated-communities-main\visitor-and-parcel-management-system-for-gated-communities-main\backend\setup-database.sql
```

## Step 4: Verify Database Configuration

The backend is configured to connect with these credentials (in `backend/.env`):
- **Host:** localhost
- **User:** root
- **Password:** Prem31@@
- **Database:** visitor_management
- **Port:** 3000 (backend server port)

**Important:** If your MySQL password is different, update the `DB_PASSWORD` in `backend/.env` file.

## Step 5: Start the Backend Server

Open a new terminal in the backend folder and run:

```bash
cd backend
npm run dev
```

This will start the backend server on http://localhost:3000

## Step 6: Test the Connection

Once the backend server starts, you should see:
- "Database connected successfully."
- "Tables initialized."
- "Server is running on port 3000"

You can test the API by visiting: http://localhost:3000

## Database Schema

### Users Table
- id (Primary Key)
- name
- role (Resident, Security Guard, Admin)
- contact_info
- password
- created_at

### Activity Logs Table
- id (Primary Key)
- resident_id (Foreign Key)
- security_guard_id (Foreign Key)
- type (Visitor, Parcel)
- name_details
- purpose_description
- media_url
- vehicle_details
- status
- created_at

## Sample Data Included

The setup script includes:
- 3 sample users (Admin, Resident, Security Guard)
- 2 sample activity logs (1 Visitor, 1 Parcel)

## Troubleshooting

### Connection Refused
- Make sure MySQL server is running
- Check if the port 3306 is not blocked by firewall

### Access Denied
- Verify your MySQL username and password in `.env` file
- Make sure the user has proper permissions

### Database Already Exists
- The script uses `CREATE IF NOT EXISTS`, so it's safe to run multiple times
- To start fresh, you can drop the database first:
  ```sql
  DROP DATABASE visitor_management;
  ```

## Next Steps

After the database is connected:
1. The Angular frontend (running on http://localhost:4200) will connect to the backend API
2. You can start using the application to manage visitors and parcels
3. All data will be stored in your MySQL database
