const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/errors');
const User = require('./models/user');

const app = express();
app.set('view engine', 'ejs');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('5bf0287b8b1cfe03a9c3ce39')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => {console.log(err)});
});
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);


mongoose.connect('mongodb+srv://jamescushway:jpcushway2018!@cluster0-hi4if.mongodb.net/shop?retryWrites=true')
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'James',
          email: 'james@test.cc',
          cart: {
            items: []
          }
        })
        user.save();
      }
    })
    app.listen(3000)
  })
  .catch(err => {
    console.log(err)
  })


