const { findProducts } = require('../controllers/searchController');
const express = require('express');
const router = express.Router();

router.get('/product', findProducts);

module.exports = router;
