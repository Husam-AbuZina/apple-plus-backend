import { Router } from 'express';
import { createProduct, deleteProduct, getProduct, listProducts, updateProduct, uploadImages } from '../controllers/productController.js';
import { requireAdmin } from '../middleware/auth.js';
import { uploadProductImages } from '../middleware/upload.js';

const router = Router();
router.get('/', listProducts);
router.get('/admin/all', requireAdmin, listProducts);
router.get('/admin/:id', requireAdmin, getProduct);
router.post('/', requireAdmin, createProduct);
router.post('/uploads/images', requireAdmin, uploadProductImages, uploadImages);
router.get('/:id', getProduct);
router.patch('/:id', requireAdmin, updateProduct);
router.delete('/:id', requireAdmin, deleteProduct);
export default router;
