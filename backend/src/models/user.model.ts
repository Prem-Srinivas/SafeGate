import pool from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface User {
    id?: number;
    name: string;
    role: 'Resident' | 'Security Guard' | 'Admin';
    contact_info: string;
    password?: string;
    created_at?: Date;
}

export const findUserByEmail = async (email: string): Promise<User | null> => {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM users WHERE contact_info = ?', [email]);
    return (rows[0] as User) || null;
};

export const createUser = async (user: User): Promise<number> => {
    const { name, role, contact_info, password } = user;
    const [result] = await pool.query<ResultSetHeader>(
        'INSERT INTO users (name, role, contact_info, password) VALUES (?, ?, ?, ?)',
        [name, role, contact_info, password]
    );
    return result.insertId;
};

export const getAllUsers = async (): Promise<User[]> => {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT id, name, role, contact_info FROM users');
    return rows as User[];
};
