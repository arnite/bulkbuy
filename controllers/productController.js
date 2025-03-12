const Product = require('../models/productModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const { deleteOne, updateOne, getOne, getAll } = require('./handlerFactory');

exports.productMiddle = catchAsync(async (req, res, next) => {
  req.body.createdBy = req.user.id;
  next();
});

exports.createProduct = catchAsync(async (req, res) => {
  const newProduct = await Product.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      data: newProduct,
    },
  });
});
exports.getProduct = getOne(Product);
exports.getAllProducts = getAll(Product);
exports.updateProduct = updateOne(Product);
exports.deleteProduct = deleteOne(Product);
