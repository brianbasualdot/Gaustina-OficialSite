
import express from 'express';
import { getMessages, replyMessage } from '../controllers/messages.controller.js';
// import { protect, admin } from '../middlewares/authMiddleware.js'; // Ensure you have auth middleware if needed

const router = express.Router();

// Routes should presumably be protected
// router.get('/', protect, admin, getMessages);
// router.post('/:id/reply', protect, admin, replyMessage);

// For now, assuming open or handled by app.js protection
router.get('/', getMessages);
router.post('/:id/reply', replyMessage);

export default router;
