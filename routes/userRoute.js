const express = require('express');
const {
  signUp,
  login,
  protect,
  restrictTo,
  forgotPassword,
  resetPassword,
  updateMyPassword,
} = require('../controllers/authController');
const {
  updateUser,
  createAdmin,
  getUser,
  getMe,
  getAllUsers,
  deleteMe,
  updateMe,
  deleteUser,
} = require('./../controllers/userController');
const router = express.Router();

//Routes
router.post('/signUp', signUp);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.post('/resetPassword/:token', resetPassword);

//Routes that require login access
router.use(protect);

router.post('/createAdmin', restrictTo('superAdmin'), createAdmin);
router.post('/updateMyPassword', updateMyPassword);
router.post('/updateMe', updateMe);
router.get('/me', getMe, getUser);
router.delete('/deleteMe', deleteMe);

router.route('/').get(restrictTo('admin', 'superAdmin'), getAllUsers);
router
  .route('/:id')
  .get(restrictTo('admin', 'superAdmin'), getUser)
  .patch(restrictTo('admin', 'superAdmin'), updateUser)
  .delete(restrictTo('admin', 'superAdmin'), deleteUser);

module.exports = router;
