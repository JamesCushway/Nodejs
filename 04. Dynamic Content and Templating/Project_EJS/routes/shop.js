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
    pageTitle: 'Shop',
    path: '/'
  });
});

module.exports = router;