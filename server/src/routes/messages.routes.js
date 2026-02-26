
import express from 'express';
import { getMessages, replyMessage } from '../controllers/messages.controller.js';
import isAdmin from '../middleware/isAdmin.js';

const router = express.Router();

// Protected Routes
router.get('/', isAdmin, getMessages);
router.post('/:id/reply', isAdmin, replyMessage);

export default router;
