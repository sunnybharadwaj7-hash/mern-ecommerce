const express = require('express');
const router = express.Router();
const {
  getStats,
  getUsers,
  updateUserRole,
  deleteUser,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// Every route in this file needs login + admin role
router.use(protect, admin);

router.get('/stats', getStats);
router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

module.exports = router;