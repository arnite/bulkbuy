const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const Cart = require('./../models/cartModel');
const Product = require('./../models/productModel');

exports.cartExtra = catchAsync(async (req, res, next) => {
  req.params.userId = req.user.id;
  next();
});

exports.cartMiidleWare = catchAsync(async (req, res, next) => {
  req.body.userId = req.user.id;
  next();
});

exports.addToCart = catchAsync(async (req, res, next) => {
  const { userId, products } = req.body; // Expecting an array of products

  // Ensure products is an array
  if (!Array.isArray(products) || products.length === 0) {
    return next(
      new AppError('Products must be an array with at least one item', 400)
    );
  }

  // Validate all product IDs and quantities
  const validProducts = [];
  for (const item of products) {
    const { productId, quantity } = item;
    const product = await Product.findById(productId);
    if (!product)
      return next(new AppError(`Product with ID ${productId} not found`, 404));

    validProducts.push({
      productId,
      quantity: Number(quantity) || 1, // Default to 1 if quantity is invalid
    });
  }

  // Find the user's cart
  let cart = await Cart.findOne({ userId });

  if (!cart) {
    // Create a new cart if the user doesn't have one
    cart = await Cart.create({
      userId,
      products: validProducts,
    });
  } else {
    // Loop through the new products and update the cart
    for (const newProduct of validProducts) {
      const productIndex = cart.products.findIndex(
        (p) => p.productId.toString() === newProduct.productId
      );

      if (productIndex > -1) {
        // If product exists, update quantity
        cart.products[productIndex].quantity += newProduct.quantity;
      } else {
        // Otherwise, add new product
        cart.products.push(newProduct);
      }
    }
  }

  // Save the updated cart
  await cart.save();

  res.status(200).json({
    status: 'success',
    data: { cart },
  });
});

exports.getCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findOne({ userId: req.user.id }).populate(
    'products.productId'
  );
  if (!cart) return next(new AppError('Cart not found', 404));

  res.status(200).json(cart);
});

exports.updateCart = catchAsync(async (req, res, next) => {
  const { id } = req.params; // Cart ID from URL
  const { products } = req.body; // Array of products with updated quantities

  // Ensure products is an array
  if (!Array.isArray(products) || products.length === 0) {
    return next(
      new AppError('Products must be an array with at least one item', 400)
    );
  }

  // Find the user's cart
  let cart = await Cart.findById(id);
  if (!cart) return next(new AppError('Cart not found', 404));

  // Update product quantities
  for (const updateItem of products) {
    const { productId, quantity } = updateItem;

    const productIndex = cart.products.findIndex(
      (p) => p.productId.toString() === productId
    );

    if (productIndex > -1) {
      // If product exists, update the quantity
      cart.products[productIndex].quantity = Number(quantity) || 1;
    }
  }

  await cart.save();

  res.status(200).json({
    status: 'success',
    data: { cart },
  });
});

exports.deleteCart = catchAsync(async (req, res, next) => {
  const { id } = req.params; // Cart ID from URL
  const { productIds } = req.body; // Array of product IDs to remove

  // Ensure productIds is an array
  if (!Array.isArray(productIds) || productIds.length === 0) {
    return next(
      new AppError('Product IDs must be an array with at least one item', 400)
    );
  }

  // Find the cart
  let cart = await Cart.findById(id);
  if (!cart) return next(new AppError('Cart not found', 404));

  // Remove the products that match the IDs in productIds
  cart.products = cart.products.filter(
    (p) => !productIds.includes(p.productId.toString())
  );

  await cart.save();

  res.status(200).json({
    status: 'success',
    data: { cart },
  });
});
