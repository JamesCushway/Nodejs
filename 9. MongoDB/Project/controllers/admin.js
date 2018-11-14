const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    path: '/admin/add-product',
    pageTitle: 'Add Products',
    editing: false
  });
}

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
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
        product: product
      });
    })
    .catch(err => {console.log(err)});
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const userId = req.user._id;
  const product = new Product(title, price, description, imageUrl, null, userId);

  product.save()
    .then((result) => {
      res.redirect('/admin/products');
    })
    .catch(err => {console.log(err)});
}

exports.postEditProduct = (req, res, next) => {
  const id = req.body.id;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  let product = new Product(title, price, description, imageUrl, id);
  console.log(product);
  product.save()
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
  Product.deleteById(id)
    .then(result => {
      console.log('Destroyed product');
      res.redirect('/admin/products');
    })
    .catch(err => {console.log(err)});
}