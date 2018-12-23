const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.get('/reset-password', authController.getResetPassword);

router.get('/reset-password/:token', authController.getUpdatePassword);

router.post('/login', authController.postLogin);

router.post('/signup', authController.postSignup);

router.post('/logout', authController.postLogout);

router.post('/reset-password', authController.postResetpassword);

router.post('/update-password', authController.postUpdatePassword);

module.exports = router;