const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    path: '/admin/add-product',
    pageTitle: 'Add Products',
    editing: false
  });
}

exports.getProducts = (req, res, next) => {
  const products = Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render('admin/products', {
        products: rows,
        pageTitle: 'Products',
        path: '/admin/products'
      });
    })
    .catch(err => {console.log(err)});
};

exports.getEditProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId, product => {
    if (!product) {
      res.redirect('/');
    }
    res.render('admin/edit-product', {
      path: '/admin/edit-product',
      pageTitle: 'Edit Products',
      editing: true,
      product: product
    });
  });
};

exports.postAddProduct = (req, res, next) => {
  const id = null;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const product = new Product(id, title, imageUrl, price, description);
  product.save()
    .then(() => {
      res.redirect('/');
    })
    .catch(err => {console.log(err)});

}

exports.postEditProduct = (req, res, next) => {
  const id = req.body.id;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const product = new Product(id, title, imageUrl, price, description);
  product.save();
  res.redirect('/admin/products');
}

exports.postDeleteProduct = (req, res, next) => {
  const id = req.body.id;
  Product.deleteById(id)
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch(err => {console.log(err)});

}