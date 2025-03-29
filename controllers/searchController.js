const Product = require('../models/productModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.findProducts = catchAsync(async (req, res, next) => {
  const query = req.query.keyword;
  if (!query) {
    return next(new AppError('Keyword parameter is required', 400));
  }

  // Case-insensitive regex search
  const products = await Product.find({
    name: { $regex: query, $options: 'i' },
  });

  if (products.length === 0) {
    return next(new AppError('No products found', 404));
  }

  res.status(200).json({
    status: 'success',
    products,
  });
});
