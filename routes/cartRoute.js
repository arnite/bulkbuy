const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../controllers/authController');
const {
  cartExtra,
  cartMiidleWare,
  addToCart,
  getCart,
  updateCart,
  deleteCart,
} = require('../controllers/cartController');

router.use(protect, restrictTo('user'));

router.get('/getMyCart', cartExtra, getCart);
router.route('/').post(cartMiidleWare, addToCart);
router.route('/:id').patch(updateCart).delete(deleteCart);

module.exports = router;
