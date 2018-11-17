const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    path: '/admin/add-product',
    pageTitle: 'Add Products',
    editing: false
  });
}

exports.getProducts = (req, res, next) => {
  req.user
    .getProducts()
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
  req.user.getProducts({ where : { id: productId }})
    .then(products => {
      const product = products[0];
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
  req.user.createProduct({
    title,
    price,
    description,
    imageUrl
  })
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
  Product.findById(id)
    .then(product => {
      product.title = title;
      product.price = price;
      product.description = description;
      product.imageUrl = imageUrl;
      return product.save()
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
  Product.findById(id)
    .then(product => {
      return product.destroy()
    })
    .then(result => {
      console.log('Destroyed product');
      res.redirect('/admin/products');
    })
    .catch(err => {console.log(err)});

}