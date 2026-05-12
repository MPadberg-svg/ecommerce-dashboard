const {
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
} = require('../models/productModel');

async function getProducts(req, res, next) {
  try {
    const result = await listProducts({
      page: Number(req.query.page || 1),
      limit: Number(req.query.limit || 10),
      search: req.query.search,
      category: req.query.category,
    });
    return res.json(result);
  } catch (error) {
    return next(error);
  }
}

async function getProduct(req, res, next) {
  try {
    const product = await getProductById(Number(req.params.id));
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.json(product);
  } catch (error) {
    return next(error);
  }
}

async function postProduct(req, res, next) {
  try {
    const product = await createProduct(req.body);
    return res.status(201).json(product);
  } catch (error) {
    return next(error);
  }
}

async function putProduct(req, res, next) {
  try {
    const product = await updateProduct(Number(req.params.id), req.body);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.json(product);
  } catch (error) {
    return next(error);
  }
}

async function removeProduct(req, res, next) {
  try {
    const deleted = await deleteProduct(Number(req.params.id));
    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getProducts,
  getProduct,
  postProduct,
  putProduct,
  removeProduct,
};
