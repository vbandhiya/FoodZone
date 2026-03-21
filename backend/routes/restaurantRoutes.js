const express = require('express');
const router = express.Router();
const { db } = require('../config/firebaseSetup');

// @route   GET /api/restaurants
// @desc    Get all restaurants
router.get('/', async (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: "Database not initialized" });
    
    const snapshot = await db.collection('restaurants').get();
    let restaurants = [];
    snapshot.forEach(doc => {
      restaurants.push({ id: doc.id, ...doc.data() });
    });
    
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/restaurants/:id
// @desc    Get a single restaurant by ID
router.get('/:id', async (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: "Database not initialized" });
    
    const docRef = await db.collection('restaurants').doc(req.params.id).get();
    if (!docRef.exists) return res.status(404).json({ error: "Restaurant not found" });
    
    res.json({ id: docRef.id, ...docRef.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
