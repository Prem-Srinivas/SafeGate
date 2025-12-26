"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStatus = exports.getAllActivities = exports.logActivity = void 0;
const ActivityModel = __importStar(require("../models/activity.model"));
const logActivity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { resident_id, security_guard_id, type, name_details, purpose_description, media, vehicle_details } = req.body;
    if (!type || !name_details || !purpose_description) {
        return res.status(400).json({ message: 'Type, Name/Details, and Purpose/Description are required' });
    }
    let initialStatus = type === 'Visitor' ? 'New' : 'Received';
    try {
        const activityId = yield ActivityModel.createActivity({
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
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
});
exports.logActivity = logActivity;
const getAllActivities = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { type, resident_id } = req.query;
    try {
        const activities = yield ActivityModel.getActivities({
            type: type,
            resident_id: resident_id ? parseInt(resident_id) : undefined
        });
        res.json(activities);
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
});
exports.getAllActivities = getAllActivities;
const updateStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
        return res.status(400).json({ message: 'Status is required' });
    }
    try {
        const success = yield ActivityModel.updateActivityStatus(parseInt(id), status);
        if (success) {
            res.json({ message: 'Status updated successfully' });
        }
        else {
            res.status(404).json({ message: 'Activity not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
});
exports.updateStatus = updateStatus;
