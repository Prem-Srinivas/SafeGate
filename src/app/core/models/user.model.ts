export interface User {
    id?: number;
    name: string;
    email: string;
    role: 'Resident' | 'Security Guard' | 'Admin';
    contact_info: string;
    unit_number?: string;
    badge_number?: string;
    token?: string;
    created_at?: string;
}
