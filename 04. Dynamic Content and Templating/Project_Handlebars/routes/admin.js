const path = require('path');

const express = require('express');

const dir = require('../utils/path');

const router = express.Router();

const products = [];
router.get('/add-product', (req, res, next) => {
  res.render('add-product', {
    path: '/admin/add-product',
    pageTitle: 'Add Products',
    activeAddProducts: true
  });
});

router.post('/add-product', (req, res, next) => {
  products.push( req.body );
  res.redirect('/');
})

module.exports = {
  router: router,
  products: products
}