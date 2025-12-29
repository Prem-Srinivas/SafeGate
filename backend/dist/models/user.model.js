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
exports.getAllUsers = exports.createUser = exports.findUserByEmail = void 0;
const db_1 = __importDefault(require("../config/db"));
const findUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const [rows] = yield db_1.default.query('SELECT * FROM users WHERE contact_info = ?', [email]);
    return rows[0] || null;
});
exports.findUserByEmail = findUserByEmail;
const createUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, role, contact_info, password } = user;
    const [result] = yield db_1.default.query('INSERT INTO users (name, role, contact_info, password) VALUES (?, ?, ?, ?)', [name, role, contact_info, password]);
    return result.insertId;
});
exports.createUser = createUser;
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const [rows] = yield db_1.default.query('SELECT id, name, role, contact_info FROM users');
    return rows;
});
exports.getAllUsers = getAllUsers;
