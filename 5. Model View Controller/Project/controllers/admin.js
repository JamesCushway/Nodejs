const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/add-product', {
    path: '/admin/add-product',
    pageTitle: 'Add Products'
  });
}

exports.getProducts = (req, res, next) => {
  const products = Product.fetchAll((products) => {
    res.render('admin/products', {
      products: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  });
};

exports.getEditProduct = (req, res, next) => {
  const products = Product.fetchAll((products) => {
    res.render('admin/edit-product', {
      products: products,
      pageTitle: 'Edit Products',
      path: '/admin/edit-product'
    });
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const product = new Product(title, imageUrl, price, description);
  product.save();
  res.redirect('/');
}

exports.postEditProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const product = new Product(title, imageUrl, price, description);
  product.save();
  res.redirect('/admin/products');
}