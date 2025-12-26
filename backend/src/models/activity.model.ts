import pool from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface Activity {
    id?: number;
    resident_id?: number | null;
    security_guard_id?: number;
    type: 'Visitor' | 'Parcel';
    name_details: string;
    purpose_description: string;
    media?: string;
    vehicle_details?: string;
    status: string;
    created_at?: Date;
}

export const createActivity = async (activity: Activity): Promise<number> => {
    const { resident_id, security_guard_id, type, name_details, purpose_description, media, vehicle_details, status } = activity;
    const [result] = await pool.query<ResultSetHeader>(
        'INSERT INTO visitors_parcels (resident_id, security_guard_id, type, name_details, purpose_description, media, vehicle_details, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [resident_id, security_guard_id, type, name_details, purpose_description, media, vehicle_details, status]
    );
    return result.insertId;
};

export const getActivities = async (filters?: { type?: string; resident_id?: number }): Promise<Activity[]> => {
    let query = 'SELECT * FROM visitors_parcels';
    const params: any[] = [];
    const constraints: string[] = [];

    if (filters?.type) {
        constraints.push('type = ?');
        params.push(filters.type);
    }
    if (filters?.resident_id) {
        constraints.push('resident_id = ?');
        params.push(filters.resident_id);
    }

    if (constraints.length > 0) {
        query += ' WHERE ' + constraints.join(' AND ');
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await pool.query<RowDataPacket[]>(query, params);
    return rows as Activity[];
};

export const updateActivityStatus = async (id: number, status: string): Promise<boolean> => {
    const [result] = await pool.query<ResultSetHeader>('UPDATE visitors_parcels SET status = ? WHERE id = ?', [status, id]);
    return result.affectedRows > 0;
};
