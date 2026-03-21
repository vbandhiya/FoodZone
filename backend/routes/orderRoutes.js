const express = require('express');
const router = express.Router();
const { db } = require('../config/firebaseSetup');

// @route   POST /api/orders
// @desc    Place a new order
router.post('/', async (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: "Database not initialized" });
    
    // Validate request logic here
    const newOrder = req.body;
    newOrder.createdAt = new Date().toISOString();
    newOrder.status = newOrder.status || 'Pending';
    
    const docRef = await db.collection('orders').add(newOrder);
    res.status(201).json({ id: docRef.id, message: "Order placed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/orders
// @desc    Get all orders
router.get('/', async (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: "Database not initialized" });
    
    const snapshot = await db.collection('orders').orderBy('createdAt', 'desc').get();
    const orders = [];
    snapshot.forEach(doc => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/orders/user/:uid
// @desc    Get all orders for a specific user
router.get('/user/:uid', async (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: "Database not initialized" });
    
    const snapshot = await db.collection('orders')
      .where('userId', '==', req.params.uid)
      .get();
      
    // Manual sort because composite index might be missing in Firestore
    const orders = [];
    snapshot.forEach(doc => orders.push({ id: doc.id, ...doc.data() }));
    orders.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
