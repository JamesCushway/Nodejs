const path = require('path');

const express = require('express');

const router = express.Router();
const users = [];

router.get('/', (req, res, next) => {
  res.render('add-user', {
    pageTitle: 'Add User',
    path: '/'
  });
});

router.post('/add-user', (req, res, next) => {
  users.push(req.body);
  res.redirect('/users');
});

module.exports = {
  router: router,
  users: users
}