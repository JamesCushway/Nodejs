const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getShop = (req, res, next) => {
  const products = Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render('shop/index', {
        products: rows,
        pageTitle: 'Products',
        path: '/'
      });
    })
    .catch(err => {console.log(err)});
};

exports.getProducts = (req, res, next) => {
  const products = Product.fetchAll()
    .then(([rows]) => {
      res.render('shop/product-list', {
        products: rows,
        pageTitle: 'Products',
        path: '/products'
      });
    })
    .catch(err => {console.log(err)});
};

exports.getProduct = (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .then(([rows]) => {
      res.render('shop/product-details', {
        product: rows[0],
        pageTitle: 'Product Details',
        path: '/products'
      })
    })
    .catch(err => {
      console.log(err);
    })
};

exports.getCart = (req, res, next) => {
  Cart.getCart(cart => {
    Product.fetchAll()
      .then( ([products]) => {
        const cartProducts = [];
        for (product of products) {
          const cartProductData = cart.products.find(prod => prod.id === product.id);
          if (cartProductData) {
            cartProducts.push({ productData: product, qty: cartProductData.qty });
          }
        }
        console.log(cartProducts);
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
  Product.findById(productId)
    .then((product) => {
      Cart.addProduct(productId, product.price);
      res.redirect('/cart');
    })
    .catch((err) => {console.log(error)});
}

exports.postRemoveFromCart = (req, res, next) => {
  const id = req.body.id;
  Product.findById(id, product => {
    Cart.deleteProduct(id, product.price);
    res.redirect('/cart');
  });
}