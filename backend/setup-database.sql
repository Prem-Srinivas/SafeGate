-- Create Database
CREATE DATABASE IF NOT EXISTS visitor_management;
USE visitor_management;

-- Users Table
-- Merges Resident, Security Guard, and Admin roles into one table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL, -- Necessary for login
    password VARCHAR(255) NOT NULL,     -- Necessary for login
    role ENUM('Resident', 'Security Guard', 'Admin') NOT NULL,
    contact_info VARCHAR(255),
    unit_number VARCHAR(50), 
    badge_number VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Visitors & Parcels Table
CREATE TABLE visitors_parcels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    resident_id INT,
    security_guard_id INT,
    type ENUM('Visitor', 'Parcel') NOT NULL,
    name_details VARCHAR(255) NOT NULL, -- Visitor Name or Parcel Details
    purpose_description TEXT,           -- Purpose of visit or Description of parcel
    media VARCHAR(255),                 -- Optional file path/URL
    vehicle_details VARCHAR(255),       -- Optional
    status VARCHAR(50) NOT NULL,        -- Visitor: New/Approved/Entered/Exited; Parcel: Received/Acknowledged/Collected
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (resident_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (security_guard_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Insert Sample Users
INSERT INTO users (name, email, password, role, contact_info) VALUES
('Admin User', 'admin@safegate.com', '$2a$10$g0FB.qTfqSV8hOlJ7EMyZe2XxUxirEGPZKQd2RgW9H8vvfVF41GFW', 'Admin', '123-ADMIN'),
('John Resident', 'john@example.com', '$2a$10$pEc45iY5LnMq/7dNfdL.8eMuYXCF5/hhxsjkzs2UrEWySKr/an00S', 'Resident', '1234567890'),
('Alice Resident', 'alice@example.com', '$2a$10$pEc45iY5LnMq/7dNfdL.8eMuYXCF5/hhxsjkzs2UrEWySKr/an00S', 'Resident', '9876543210'),
('Security Guard Mike', 'guard@safegate.com', '$2a$10$/4IbIFmDIXY7MDdH.Mc2JufKkLYpQx1/s9ulyIKbjpIj3g/mgLBdm', 'Security Guard', '5551234567');

-- Insert Sample Visitors & Parcels
INSERT INTO visitors_parcels (resident_id, security_guard_id, type, name_details, purpose_description, status) VALUES
(2, 4, 'Visitor', 'Jane Doe', 'Personal Visit', 'Approved'),
(2, 4, 'Parcel', 'Amazon Package', 'Delivery from Amazon', 'Received');

SELECT 'Database setup completed successfully!' as message;
