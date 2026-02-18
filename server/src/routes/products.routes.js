import express from 'express';
import * as productController from '../controllers/products.controller.js';
//import isAdmin from '../middleware/isAdmin.js';//
const router = express.Router();

// Public Routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Protected Admin Routes
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

export default router;
