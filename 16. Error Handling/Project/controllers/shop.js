const Product = require('../models/product');
const Order = require('../models/order');

exports.getShop = (req, res, next) => {
  Product.find()
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
  Product.find()
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
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      console.log(user);
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: user.cart.items
      })
    })
    .catch(err => {console.log(err)});
};

exports.getOrders = (req, res, next) => {
  Order.find({userId: req.user._id})
    .populate('items.productId')
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
    .removeFromCart(id)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => {console.log(err)})
}

exports.postCreateOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(item => {
        return {
          productData: { ...item.productId._doc },
          quantity: item.quantity
        }
      });
      const order = new Order({
        products,
        userId: user._id
      });
      return order.save();
    })
    .then(result => {
      return req.user.clearCart();
    })
    .then(result => {
      res.redirect('/orders');
    })
    .catch(er => {
      console.log(er);
    })
}