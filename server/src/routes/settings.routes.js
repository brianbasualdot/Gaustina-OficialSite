import { Router } from 'express';
import { getSetting, updateSetting } from '../controllers/settings.controller.js';
import isAdmin from '../middleware/isAdmin.js';

const router = Router();

// Public: to check maintenance mode
router.get('/:key', getSetting);

// Protected: only admins can change settings
router.post('/', isAdmin, updateSetting);
router.patch('/', isAdmin, updateSetting);

export default router;
