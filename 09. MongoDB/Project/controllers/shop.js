const Product = require('../models/product');

exports.getShop = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render('shop/index', {
        products: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err => {console.log(err)});
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render('shop/product-list', {
        products: products,
        pageTitle: 'Products',
        path: '/products'
      });
    })
    .catch(err => {console.log(err)});
};

exports.getProduct = (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .then((product) => {
      res.render('shop/product-details', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      })
    })
    .catch(err => {
      console.log(err);
    })
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then(products => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products
      })
    })
    .catch(err => {console.log(err)});
};

exports.getOrders = (req, res, next) => {
  const id = req.body.id;
  req.user.getOrders()
    .then(orders => {
        res.render('shop/orders', {
          orders: orders,
          pageTitle: 'Your Orders',
          path: '/orders'
        });
    })
    .catch(err => {console.log(err)});
};

exports.postAddToCart = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId)
    .then(product => {
      req.user.addToCart(product);
      res.redirect('/cart');
    })
    .catch(err =>{
      console.log(err);
    })
}

exports.postRemoveFromCart = (req, res, next) => {
  const id = req.body.id;
  req.user
    .deleteItemFromCart(id)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => {console.log(err)})
}

exports.postCreateOrder = (req, res, next) => {
  let fetchedCart;
  req.user.
    addOrder()
    .then(result => {
      res.redirect('/orders');
    })
    .catch(err => {console.log(err)});
}