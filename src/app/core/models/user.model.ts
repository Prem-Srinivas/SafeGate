export interface User {
    id?: number;
    name: string;
    role: 'Resident' | 'Security Guard' | 'Admin';
    contact_info: string;
    token?: string;
}
