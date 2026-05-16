const productModel = require('../models/productModel');

async function getProducts(req, res, next) {
  try {
    // Extract pagination and filters from the query string
    const { page = 1, limit = 10, search, category } = req.query;
    
    const result = await productModel.listProducts({ 
      page: Number(page), 
      limit: Number(limit), 
      search, 
      category 
    });
    
    return res.json(result);
  } catch (error) {
    return next(error);
  }
}

async function getProduct(req, res, next) {
  try {
    const { id } = req.params;
    const product = await productModel.getProductById(id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.json(product);
  } catch (error) {
    return next(error);
  }
}

async function createProduct(req, res, next) {
  try {
    const newProduct = await productModel.createProduct(req.body);
    return res.status(201).json(newProduct);
  } catch (error) {
    return next(error);
  }
}

async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;
    const updatedProduct = await productModel.updateProduct(id, req.body);
    
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.json(updatedProduct);
  } catch (error) {
    return next(error);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;
    const isDeleted = await productModel.deleteProduct(id);
    
    if (!isDeleted) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.status(204).send();
  } catch (error) {
    if (error.code === '23503') {
      return res.status(409).json({ 
        message: 'Cannot delete product because it is part of existing orders.' 
      });
    }
    return next(error);
  }
}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
};