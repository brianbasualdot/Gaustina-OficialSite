import { Router } from 'express';
import { getAllOrders, updateOrderStatus, downloadInvoice } from '../controllers/orders.controller.js';
import isAdmin from '../middleware/isAdmin.js';

const router = Router();

// Get all orders
router.get('/', isAdmin, getAllOrders);

// Update order status
router.patch('/:id/status', isAdmin, updateOrderStatus);

// Download Invoice
router.get('/:id/invoice', isAdmin, downloadInvoice);

export default router;
