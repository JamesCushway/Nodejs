const Product = require('../models/product');

exports.getShop = (req, res, next) => {
  const products = Product.fetchAll((products) => {
    res.render('shop/index', {
      products: products,
      pageTitle: 'Shop',
      path: '/'
    });
  });
};

exports.getProducts = (req, res, next) => {
  const products = Product.fetchAll((products) => {
    res.render('shop/product-list', {
      products: products,
      pageTitle: 'Products',
      path: '/products'
    });
  });
};

exports.getCart = (req, res, next) => {
  const products = Product.fetchAll((products) => {
    res.render('shop/cart', {
      products: products,
      pageTitle: 'Cart',
      path: '/cart'
    });
  });
};

exports.getOrders = (req, res, next) => {
  const products = Product.fetchAll((products) => {
    res.render('shop/orders', {
      products: products,
      pageTitle: 'Your Orders',
      path: '/orders'
    });
  });
};

exports.getCheckout = (req, res, next) => {
  const products = Product.fetchAll((products) => {
    res.render('shop/checkout', {
      products: products,
      pageTitle: 'Checkout',
      path: '/checkout'
    });
  });
};