const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET products
router.get('/all-products', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// POST /api/products
router.post('/add-product', async (req, res) => {
  try {
    const { name, description, price } = req.body;

    // Simple validation
    if (!name || !description || price === undefined) {
      return res.status(400).json({ error: 'Please provide name, description, and price' });
    }

    const newProduct = new Product({ name, description, price });
    await newProduct.save();

    res.status(201).json(newProduct);
  } catch (err) {
    console.error('Failed to create product:', err);
    res.status(500).json({ error: 'Failed to create product' });
  }
});


module.exports = router;
