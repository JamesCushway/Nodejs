const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');

const router = express.Router();

router.get('/', shopController.getShop);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart', shopController.getCart);
//
router.get('/orders', shopController.getOrders);
//
router.post('/add-to-cart', shopController.postAddToCart);
//
router.post('/remove-from-cart', shopController.postRemoveFromCart);
//
router.post('/create-order', shopController.postCreateOrder);

module.exports = router;