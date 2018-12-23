const express = require('express');
const { check, body } = require('express-validator/check');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();


router.get('/add-product', isAuth, adminController.getAddProduct);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.get('/products', isAuth, adminController.getProducts);

router.post('/add-product',
  isAuth,
  [
    check('title')
      .isString()
      .isLength({min: 1})
      .trim()
      .withMessage('Please enter a valid title'),
    body('price', 'Price must be a number')
      .isFloat(),
    body('imageUrl', 'Invalid URL')
      .isURL(),
    body('description')
      .isLength({ min: 5, max: 200 })
      .trim()
  ],
  adminController.postAddProduct);

router.post('/edit-product',
  isAuth,
  [
    check('title')
      .isString()
      .isLength({min: 1})
      .trim()
      .withMessage('Please enter a valid title'),
    body('price', 'Price must be a number')
      .isFloat(),
    body('imageUrl', 'Invalid URL')
      .isURL(),
    body('description')
      .isLength({ min: 5, max: 200 })
      .trim()
  ],
  adminController.postEditProduct);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;