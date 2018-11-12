const Product = require('../models/product');
const Cart = require('../models/cart');

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

exports.getProduct = (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id, product => {
    res.render('shop/product-details', {
      product: product,
      pageTitle: 'Product Details',
      path: '/products'
    })
  })
};

exports.getCart = (req, res, next) => {
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      const cartProducts = [];
      for (product of products) {
        const cartProductData = cart.products.find(prod => prod.id === product.id);
        if (cartProductData) {
          cartProducts.push({ productData: product, qty: cartProductData.qty });
        }
      }
      res.render('shop/cart', {
        path: 'cart',
        pageTitle: 'Your Cart',
        products: cartProducts
      });
    });
  })
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

exports.postAddToCart = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId, (product) => {
    Cart.addProduct(productId, product.price);
  });
  res.redirect('/cart');
}

exports.postRemoveFromCart = (req, res, next) => {
  const id = req.body.id;
  Product.findById(id, product => {
    Cart.deleteProduct(id, product.price);
    res.redirect('/cart');
  });
}