const express = require('express');
const { check, body } = require('express-validator/check');
const User = require('../models/user');


const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.get('/reset-password', authController.getResetPassword);

router.get('/reset-password/:token', authController.getUpdatePassword);

router.post('/login',
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .normalizeEmail(),
    body('password', 'Password invalid')
      .trim()
      .isLength({min: 5})
      .isAlphanumeric()
  ],
  authController.postLogin);

router.post('/signup',
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .custom((value, { req }) => {
        return User.findOne({email: req.body.email})
          .then((user) => {
            console.log(user);
            if (user) {
              return Promise.reject('Email already taken');
            }
          })
      })
      .normalizeEmail(),
    body('password', 'Password invalid')
      .isLength({min: 5})
      .isAlphanumeric()
      .trim(),
    body('confirmPassword', 'Passwords must match')
      .custom((value, { req }) => {
        if (value === req.body.password) {
          return true;
        }
        throw new Error('Passwords must match');
      })
  ],
  authController.postSignup)


router.post('/logout', authController.postLogout);

router.post('/reset-password', authController.postResetpassword);

router.post('/update-password', authController.postUpdatePassword);

module.exports = router;