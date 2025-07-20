const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const router = express.Router();
// POST /orders - create a new order
router.post('/create-order', auth, async (req, res) => {
    const { userId, products } = req.body;
    if (req.user._id !== userId) {
        return res.status(403).json({ error: 'Access denied.' });
    }
    if (!products || products.length === 0) {
        return res.status(400).json({ error: 'Order must include at least one product.' });
    }
  try {
    // Calculate total price
    let totalPrice = 0;
    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ error: 'Product not found' });
      totalPrice += product.price * item.quantity;
    }

    const order = new Order({
      userId,
      products,
      totalPrice
    });

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

// GET /orders/:userId - get orders for a user
router.get('/view/:userId', auth, async (req, res) => {
  try {
    if (req.user._id !== req.params.userId) {
        return res.status(403).json({ error: 'Access denied.' });
    }
    const orders = await Order.find({ userId: req.params.userId }).populate('products.productId');
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

module.exports = router;
