import { Router } from 'express';
// import { authenticateToken, authorizeRole } from '../middleware/authMiddleware';
import productController from '../controllers/ProductController';

const router = Router();

// router.get('/', authenticateToken, authorizeRole('admin', 'customer'), productController.getAllProducts);
// router.get('/:id', authenticateToken, authorizeRole('admin', 'customer'), productController.getProductById);
// router.post('/', authenticateToken, authorizeRole('admin'), productController.createProduct);
// router.put('/:id', authenticateToken, authorizeRole('admin'), productController.updateProduct);
// router.delete('/:id', authenticateToken, authorizeRole('admin'), productController.deleteProduct);
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);


export default router;
