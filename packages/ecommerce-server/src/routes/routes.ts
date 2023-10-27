import { Router } from 'express';
import customerRoutes from './customerRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import woocommerceRoutes from './woocommerceRoutes.js';

const router = Router();

router.use('/customer', customerRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/woocommerce', woocommerceRoutes);

export default router;
