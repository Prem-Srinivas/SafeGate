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
exports.updateActivityStatus = exports.getActivities = exports.createActivity = void 0;
const db_1 = __importDefault(require("../config/db"));
const createActivity = (activity) => __awaiter(void 0, void 0, void 0, function* () {
    const { resident_id, security_guard_id, type, name_details, purpose_description, media, vehicle_details, status } = activity;
    const [result] = yield db_1.default.query('INSERT INTO visitors_parcels (resident_id, security_guard_id, type, name_details, purpose_description, media, vehicle_details, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [resident_id, security_guard_id, type, name_details, purpose_description, media, vehicle_details, status]);
    return result.insertId;
});
exports.createActivity = createActivity;
const getActivities = (filters) => __awaiter(void 0, void 0, void 0, function* () {
    let query = 'SELECT * FROM visitors_parcels';
    const params = [];
    const constraints = [];
    if (filters === null || filters === void 0 ? void 0 : filters.type) {
        constraints.push('type = ?');
        params.push(filters.type);
    }
    if (filters === null || filters === void 0 ? void 0 : filters.resident_id) {
        constraints.push('resident_id = ?');
        params.push(filters.resident_id);
    }
    if (constraints.length > 0) {
        query += ' WHERE ' + constraints.join(' AND ');
    }
    query += ' ORDER BY created_at DESC';
    const [rows] = yield db_1.default.query(query, params);
    return rows;
});
exports.getActivities = getActivities;
const updateActivityStatus = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    const [result] = yield db_1.default.query('UPDATE visitors_parcels SET status = ? WHERE id = ?', [status, id]);
    return result.affectedRows > 0;
});
exports.updateActivityStatus = updateActivityStatus;
