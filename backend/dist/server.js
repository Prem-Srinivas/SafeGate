"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const activity_routes_1 = __importDefault(require("./routes/activity.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Initialize Database
(0, db_1.initDB)();
// Routes
app.use('/api/users', user_routes_1.default);
app.use('/api/activities', activity_routes_1.default);
app.get('/', (req, res) => {
    res.send('SafeGate Visitor & Parcel Management System API');
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
