const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../controllers/authController');
const {
  orderMiidleWare,
  createOrder,
  getAllOrders,
  getOrder,
  getMyOrders,
} = require('../controllers/ordersController');

router.use(protect);
router.get('/getMyOrders', restrictTo('user'), getMyOrders);

router
  .route('/')
  .post(restrictTo('user'), orderMiidleWare, createOrder)
  .get(restrictTo('admin'), getAllOrders);

router.route('/:userId').get(restrictTo('admin'), getOrder);

module.exports = router;
