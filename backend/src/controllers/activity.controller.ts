import { Request, Response } from 'express';
import * as ActivityModel from '../models/activity.model';

export const logActivity = async (req: Request, res: Response) => {
    const { resident_id, security_guard_id, type, name_details, purpose_description, media, vehicle_details } = req.body;

    if (!type || !name_details || !purpose_description) {
        return res.status(400).json({ message: 'Type, Name/Details, and Purpose/Description are required' });
    }

    let initialStatus = type === 'Visitor' ? 'New' : 'Received';

    try {
        const activityId = await ActivityModel.createActivity({
            resident_id,
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
