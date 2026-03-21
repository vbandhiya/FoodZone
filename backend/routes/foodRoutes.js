const express = require('express');
const router = express.Router();
const { db } = require('../config/firebaseSetup');

// @route   GET /api/food
// @desc    Get all food items
router.get('/', async (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: "Database not initialized" });
    
    const snapshot = await db.collection('food_items').get();
    let foods = [];
    snapshot.forEach(doc => {
      foods.push({ id: doc.id, ...doc.data() });
    });
    
    res.json(foods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
