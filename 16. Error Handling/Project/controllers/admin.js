const { validationResult } = require('express-validator/check');
const mongoose = require('mongoose');

const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    res.redirect('/login');
  }
  res.render('admin/edit-product', {
    path: '/admin/add-product',
    pageTitle: 'Add Products',
    editing: false,
    hasError: false,
    errorMessage: false,
    validationErrors: []
  });
}

exports.getProducts = (req, res, next) => {
  Product.find({userId: req.user._id})
    .then(products => {
      res.render('admin/products', {
        products: products,
        pageTitle: 'Products',
        path: '/admin/products'
      });
    })
    .catch(err => {console.log(err)});
};

exports.getEditProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId)
    .then(product => {
      if (!product) {
        res.redirect('/');
      }
      res.render('admin/edit-product', {
        path: '/admin/edit-product',
        pageTitle: 'Edit Products',
        editing: true,
        product: product,
        hasError: false,
        errorMessage: false,
        validationErrors: []
      });
    })
    .catch(err => {console.log(err)});
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      path: '/admin/add-product',
      pageTitle: 'Add Products',
      editing: false,
      hasError: true,
      product: {
        title,
        price,
        description,
        imageUrl
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }
  const product = new Product({
    title,
    price,
    description,
    imageUrl,
    userId: req.user
  });

  product.save()
    .then((result) => {
      res.redirect('/admin/products');
    })
    .catch(err => {
      let error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}

exports.postEditProduct = (req, res, next) => {
  const id = req.body.id;
  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.description;
  const imageUrl = req.body.imageUrl;
  const errors = validationResult(req);
  console.log(id);
  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      path: '/admin/edit-product',
      pageTitle: 'Edit Products',
      editing: true,
      hasError: true,
      product: {
        title,
        price,
        description,
        imageUrl,
        _id: id
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }
  Product.findById(id)
    .then(product => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/');
      }
      product.title = title;
      product.description = description;
      product.price = price;
      product.imageUrl = imageUrl;
      return product.save();
    })
    .then(result => {
      console.log('updated product')
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
      res.redirect('/admin/products');
    });

}

exports.postDeleteProduct = (req, res, next) => {
  const id = req.body.id;
  Product.deleteOne({ _id: id, userId: req.user._id})
    .then(product => {
      console.log('Destroyed product');
      res.redirect('/admin/products');
    })
    .catch(err => {console.log(err)});
}