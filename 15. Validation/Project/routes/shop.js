const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', shopController.getShop);

router.get('/products', shopController.getProducts);
//
router.get('/products/:productId', shopController.getProduct);
//
router.get('/cart', isAuth, shopController.getCart);
// //
router.get('/orders', isAuth, shopController.getOrders);
// //
router.post('/add-to-cart', isAuth, shopController.postAddToCart);
// //
router.post('/remove-from-cart', isAuth, shopController.postRemoveFromCart);
// //
router.post('/create-order', isAuth, shopController.postCreateOrder);

module.exports = router;