"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDB = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pool = promise_1.default.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Prem31@@',
    database: process.env.DB_NAME || 'visitor_management',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
const initDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield pool.getConnection();
        console.log('Database connected successfully.');
        // Create Users Table (Matches server.js)
        yield connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role ENUM('Resident', 'Security Guard', 'Admin') NOT NULL,
                contact_info VARCHAR(255),
                unit_number VARCHAR(50),
                badge_number VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        // Create Visitors & Parcels Table (Matches server.js)
        yield connection.query(`
            CREATE TABLE IF NOT EXISTS visitors_parcels (
                id INT AUTO_INCREMENT PRIMARY KEY,
                resident_id INT,
                security_guard_id INT,
                type ENUM('Visitor', 'Parcel') NOT NULL,
                name_details VARCHAR(255) NOT NULL,
                purpose_description TEXT,
                media VARCHAR(255),
                vehicle_details VARCHAR(255),
                status VARCHAR(50) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (resident_id) REFERENCES users(id) ON DELETE SET NULL,
                FOREIGN KEY (security_guard_id) REFERENCES users(id) ON DELETE SET NULL
            )
        `);
        console.log('Tables initialized.');
        connection.release();
    }
    catch (error) {
        console.error('Database initialization failed:', error);
    }
});
exports.initDB = initDB;
exports.default = pool;
