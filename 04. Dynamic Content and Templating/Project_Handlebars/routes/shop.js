const path = require('path');

const express = require('express');

const adminData = require('./admin');

const dir = require('../utils/path');

const router = express.Router();

router.get('/', (req, res, next) => {
  const products = adminData.products;
  console.log(products);
  res.render('shop', {
    products: products,
    activeShop: true,
    pageTitle: 'Shop',
    hasProducts: (products.length > 0),
    productCSS: true
  });
});

module.exports = router;