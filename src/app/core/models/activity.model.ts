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
    // Extended properties from joins
    resident_unit?: string;
    resident_name?: string;
}
