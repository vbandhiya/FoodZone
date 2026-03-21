const express = require('express');
const router = express.Router();
const { db, admin } = require('../config/firebaseSetup');

// @route   GET /api/users
// @desc    Get all users (admin only)
router.get('/', async (req, res) => {
  try {
    // Basic implementation structure - no auth middleware yet
    if (!db) return res.status(503).json({ error: "Database not initialized" });
    
    const usersSnapshot = await db.collection('users').get();
    let users = [];
    usersSnapshot.forEach(doc => {
      users.push({ id: doc.id, ...doc.data() });
    });
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
router.get('/:id', async (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: "Database not initialized" });
    
    const userDoc = await db.collection('users').doc(req.params.id).get();
    if (!userDoc.exists) return res.status(404).json({ error: "User not found" });
    
    res.json({ id: userDoc.id, ...userDoc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
