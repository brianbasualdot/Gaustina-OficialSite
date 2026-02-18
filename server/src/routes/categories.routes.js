import { Router } from 'express';
import { createCategory, getAllCategories, deleteCategory } from '../controllers/categories.controller.js';

const router = Router();

// Rutas: /api/categories
router.get('/', getAllCategories);
router.post('/', createCategory); // Idealmente agregar middleware de auth/admin aquí
router.delete('/:id', deleteCategory);

export default router;
