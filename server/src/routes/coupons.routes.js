import { Router } from 'express';
import { 
    getCoupons, 
    createCoupon, 
    updateCoupon, 
    deleteCoupon, 
    validateCoupon 
} from '../controllers/couponController.js';

const router = Router();

// Rutas de administración
router.get('/', getCoupons);
router.post('/', createCoupon);
router.put('/:id', updateCoupon);
router.delete('/:id', deleteCoupon);

// Ruta pública para validación
router.post('/validate', validateCoupon);

export default router;
