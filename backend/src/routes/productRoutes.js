const { Router } = require('express');
const {
  getProducts,
  getProduct,
  postProduct,
  putProduct,
  removeProduct,
} = require('../controllers/productController');
const { requireAuth, requireRole } = require('../middleware/jwt');
const {
  productCreateValidators,
  productQueryValidators,
  productUpdateValidators,
} = require('../utils/validators');

const router = Router();

router.use(requireAuth);
router.get('/', productQueryValidators, getProducts);
router.get('/:id', getProduct);
router.post('/', requireRole('admin'), productCreateValidators, postProduct);
router.put('/:id', requireRole('admin'), productUpdateValidators, putProduct);
router.delete('/:id', requireRole('admin'), removeProduct);

module.exports = router;
