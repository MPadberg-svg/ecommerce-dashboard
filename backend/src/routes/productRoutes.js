const { Router } = require('express');
const {
  getProducts,
  getProduct,
  createProduct, // Fixed name
  updateProduct, // Fixed name
  deleteProduct, // Fixed name
} = require('../controllers/productController');
const { authenticate, requireRole } = require('../middleware/auth'); // Keeping the fixed path
const { apiLimiter } = require('../middleware/rateLimit');
const {
  productCreateValidators,
  productQueryValidators,
  productUpdateValidators,
} = require('../utils/validators');

const router = Router();

router.use(authenticate, apiLimiter);
router.get('/', productQueryValidators, getProducts);
router.get('/:id', getProduct);
// Updated to use the correct function names below:
router.post('/', requireRole('admin'), productCreateValidators, createProduct);
router.put('/:id', requireRole('admin'), productUpdateValidators, updateProduct);
router.delete('/:id', requireRole('admin'), deleteProduct);

module.exports = router;