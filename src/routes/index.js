import { Router } from 'express';
import authRoutes from './auth.routes.js';
import categoryRoutes from './category.routes.js';
import productRoutes from './product.route.js';
import reviewRoutes from './review.route.js';
import cartRoutes from './cart.route.js'; 
import orderRoutes from './order.routes.js';
import stripeRoutes from './stripe.routes.js';
const router = Router();

router.use('/auth', authRoutes);
router.use('/category', categoryRoutes);
router.use('/product', productRoutes);
router.use('/review', reviewRoutes);
router.use('/cart', cartRoutes);
router.use('/order', orderRoutes);
router.use('/stripe', stripeRoutes);

router.get('/health', (req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

export default router;
