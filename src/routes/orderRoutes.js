const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { authenticateToken } = require('../middleware/auth');

// POST /api/orders
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { items, totalAmount } = req.body;
    const userId = req.user.userId;

    const order = new Order({
      user: userId,
      items: items.map(item => ({
        product: item.productId,
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount,
      status: 'pending'
    });

    await order.save();
    res.status(201).json({ orderId: order._id, message: 'Order placed successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/orders
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/orders/:id
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const order = await Order.findOne({ _id: id, user: userId }).populate('items.product');
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/orders/:id (Cancel order)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const order = await Order.findOneAndUpdate(
      { _id: id, user: userId, status: { $ne: 'cancelled' } },
      { status: 'cancelled' },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ error: 'Order not found or already cancelled' });
    }
    res.json({ message: 'Order cancelled successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;