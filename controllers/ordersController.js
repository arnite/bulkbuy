const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const Order = require('./../models/orderModel');
const Product = require('./../models/productModel');

exports.orderMiidleWare = catchAsync(async (req, res, next) => {
  req.body.userId = req.user.id;
  next();
});

exports.orderExtra = catchAsync(async (req, res, next) => {
  req.params.userId = req.user.id;
  next();
});

exports.createOrder = catchAsync(async (req, res, next) => {
  const { userId, products, paymentInfo, shippingAddress } = req.body;

  let totalPrice = 0;

  for (const product of products) {
    const productDetails = await Product.findById(product.productId);
    if (!productDetails) return next(new AppError('Product not found', 404));

    totalPrice += productDetails.price * product.quantity;
  }

  const order = new Order({
    userId,
    products,
    totalPrice,
    paymentInfo,
    shippingAddress,
  });

  await order.save();
  res.status(201).json(order);
});

exports.getAllOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find().populate('products.productId');
  if (!orders) return next(new AppError('Order not found', 404));

  res.status(200).json(orders);
});

exports.getOrder = catchAsync(async (req, res, next) => {
  const { userId } = req.params;

  const orders = await Order.find({ userId }).populate('products.productId');
  if (!orders) return next(new AppError('Order not found', 404));

  res.status(200).json(orders);
});

exports.getMyOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ userId: req.user.id }).populate(
    'products.productId'
  );
  if (!orders) return next(new AppError('Order not found', 404));

  res.status(200).json(orders);
});
