import { Router } from 'express';
import * as ActivityController from '../controllers/activity.controller';

const router = Router();

router.post('/', ActivityController.logActivity);
router.get('/', ActivityController.getAllActivities);
router.put('/:id/status', ActivityController.updateStatus);

export default router;
