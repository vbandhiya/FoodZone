const express = require('express');
const router = express.Router();
const { db } = require('../config/firebaseSetup');

// Simple middleware for admin check
const verifyAdmin = (req, res, next) => {
  // In a real app, verify the Firebase token's custom claims here
  next();
};

/* --- DASHBOARD STATS --- */
router.get('/stats', verifyAdmin, async (req, res) => {
  try {
    const [ordersSnap, usersSnap, restaurantsSnap] = await Promise.all([
      db.collection('orders').get(),
      db.collection('users').get(),
      db.collection('restaurants').get()
    ]);

    const orders = [];
    ordersSnap.forEach(doc => orders.push({ id: doc.id, ...doc.data() }));

    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
    const activeOrders = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;

    res.json({
      totalOrders: orders.length,
      totalRevenue,
      totalUsers: usersSnap.size,
      totalRestaurants: restaurantsSnap.size,
      activeOrders
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* --- FOOD CRUD --- */
router.post('/food', verifyAdmin, async (req, res) => {
  try {
    const docRef = await db.collection('food_items').add(req.body);
    res.status(201).json({ id: docRef.id, ...req.body });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/food/:id', verifyAdmin, async (req, res) => {
  try {
    await db.collection('food_items').doc(req.params.id).update(req.body);
    res.json({ id: req.params.id, ...req.body });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/food/:id', verifyAdmin, async (req, res) => {
  try {
    await db.collection('food_items').doc(req.params.id).delete();
    res.json({ message: "Deleted successfully" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* --- RESTAURANT CRUD --- */
router.post('/restaurants', verifyAdmin, async (req, res) => {
  try {
    const docRef = await db.collection('restaurants').add(req.body);
    res.status(201).json({ id: docRef.id, ...req.body });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/restaurants/:id', verifyAdmin, async (req, res) => {
  try {
    await db.collection('restaurants').doc(req.params.id).update(req.body);
    res.json({ id: req.params.id, ...req.body });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/restaurants/:id', verifyAdmin, async (req, res) => {
  try {
    await db.collection('restaurants').doc(req.params.id).delete();
    res.json({ message: "Deleted successfully" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* --- ORDERS MANAGEMENT --- */
router.put('/orders/:id/status', verifyAdmin, async (req, res) => {
  try {
    await db.collection('orders').doc(req.params.id).update({ status: req.body.status });
    res.json({ message: "Order status updated" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* --- USER MANAGEMENT --- */
router.get('/users', verifyAdmin, async (req, res) => {
  try {
    const snapshot = await db.collection('users').get();
    const users = [];
    snapshot.forEach(doc => users.push({ id: doc.id, ...doc.data() }));
    res.json(users);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/users/:id/status', verifyAdmin, async (req, res) => {
  try {
    await db.collection('users').doc(req.params.id).update({ isBlocked: req.body.isBlocked });
    res.json({ message: "User status updated" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* --- ANALYTICS --- */
router.get('/analytics', verifyAdmin, async (req, res) => {
  try {
    const ordersSnap = await db.collection('orders').get();
    const orders = [];
    ordersSnap.forEach(doc => orders.push({ id: doc.id, ...doc.data() }));

    const ordersByDay = {};
    orders.forEach(o => {
      let date = 'Unknown';
      if (o.createdAt) {
        if (typeof o.createdAt === 'string') {
          date = o.createdAt.split('T')[0];
        } else if (o.createdAt instanceof Date) {
          date = o.createdAt.toISOString().split('T')[0];
        } else if (o.createdAt.toDate) { // Check for Firestore Timestamp
          date = o.createdAt.toDate().toISOString().split('T')[0];
        }
      }
      ordersByDay[date] = (ordersByDay[date] || 0) + 1;
    });

    // Popular items
    const itemCounts = {};
    orders.forEach(o => {
      (o.items || []).forEach(item => {
        itemCounts[item.name] = (itemCounts[item.name] || 0) + (item.quantity || 1);
      });
    });

    const popularItems = Object.entries(itemCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a,b) => b.count - a.count)
      .slice(0, 5);

    // Most active users
    const userOrderCounts = {};
    orders.forEach(o => {
      if (o.userName) {
        userOrderCounts[o.userName] = (userOrderCounts[o.userName] || 0) + 1;
      }
    });
    const activeUsers = Object.entries(userOrderCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a,b) => b.count - a.count)
      .slice(0, 5);

    res.json({ ordersByDay, popularItems, activeUsers });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
