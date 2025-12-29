import { Request, Response } from 'express';
import * as ActivityModel from '../models/activity.model';
import pool from '../config/db';
import { RowDataPacket } from 'mysql2';

export const logActivity = async (req: Request, res: Response) => {
    // Destructure unit_number as well
    const { resident_id, security_guard_id, type, name_details, purpose_description, media, vehicle_details, unit_number } = req.body;

    if (!type || !name_details || !purpose_description) {
        return res.status(400).json({ message: 'Type, Name/Details, and Purpose/Description are required' });
    }

    let initialStatus = type === 'Visitor' ? 'Waiting for Approval' : 'Received';

    try {
        let finalResidentId = resident_id;

        // If unit_number provided but no resident_id, try to find resident
        if (!finalResidentId && unit_number) {
            const [users] = await pool.query<RowDataPacket[]>(
                "SELECT id FROM users WHERE unit_number = ? AND role = 'Resident'",
                [unit_number]
            );
            if (users.length > 0) {
                finalResidentId = users[0].id;
            } else {
                return res.status(404).json({ message: 'Resident with this Unit Number not found' });
            }
        }

        const activityId = await ActivityModel.createActivity({
            resident_id: finalResidentId,
            security_guard_id,
            type,
            name_details,
            purpose_description,
            media,
            vehicle_details,
            status: initialStatus
        });
        res.status(201).json({ message: `${type} logged successfully`, activityId });
    } catch (error) {
        console.error("Error logging activity:", error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};

export const getAllActivities = async (req: Request, res: Response) => {
    const { type, resident_id } = req.query;
    try {
        const activities = await ActivityModel.getActivities({
            type: type as string,
            resident_id: resident_id ? parseInt(resident_id as string) : undefined
        });
        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
};

export const updateStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ message: 'Status is required' });
    }

    try {
        const success = await ActivityModel.updateActivityStatus(parseInt(id), status);
        if (success) {
            res.json({ message: 'Status updated successfully' });
        } else {
            res.status(404).json({ message: 'Activity not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
};
