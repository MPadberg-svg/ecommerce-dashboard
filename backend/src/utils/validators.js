const { body, param, query, validationResult } = require('express-validator');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }
  return next();
};

const authValidators = [
  body('email').isEmail().normalizeEmail(),
  body('password').isString().isLength({ min: 6 }),
  handleValidation,
];

const productCreateValidators = [
  body('name').isString().trim().notEmpty(),
  body('category').isString().trim().notEmpty(),
  body('price').isFloat({ min: 0 }),
  body('stock').isInt({ min: 0 }),
  body('image_url').optional({ nullable: true }).isURL(),
  handleValidation,
];

const productUpdateValidators = [
  param('id').isInt({ min: 1 }),
  body('name').optional().isString().trim().notEmpty(),
  body('category').optional().isString().trim().notEmpty(),
  body('price').optional().isFloat({ min: 0 }),
  body('stock').optional().isInt({ min: 0 }),
  body('image_url').optional({ nullable: true }).isURL(),
  handleValidation,
];

const productQueryValidators = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().isString(),
  query('category').optional().isString(),
  handleValidation,
];

const orderCreateValidators = [
  body('items').isArray({ min: 1 }),
  body('items.*.product_id').isInt({ min: 1 }),
  body('items.*.quantity').isInt({ min: 1 }),
  handleValidation,
];

const orderStatusValidators = [
  param('id').isInt({ min: 1 }),
  body('status').isIn(['Pending', 'Shipped', 'Delivered']),
  handleValidation,
];

module.exports = {
  authValidators,
  productCreateValidators,
  productUpdateValidators,
  productQueryValidators,
  orderCreateValidators,
  orderStatusValidators,
};
