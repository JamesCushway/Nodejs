const path = require('path');

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const MongoDbStore = require('connect-mongodb-session')(session);

const errorController = require('./controllers/errors');
const User = require('./models/user');

const MONGO_DB_URI = 'mongodb+srv://jamescushway:jpcushway2018!@cluster0-hi4if.mongodb.net/shop';

const app = express();
const store = new MongoDbStore({
  uri: MONGO_DB_URI,
  collection: 'sessions'
});
app.set('view engine', 'ejs');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'MyVeryLongSessionSecret',
  resave: false,
  saveUninitialized: false,
  store: store
}));

app.use((req, res, next) => {
  if (!req.session.user) {
    console.log("hello");
    next();
  } else {
    User.findById(req.session.user._id)
      .then(user => {
        req.user = user;
        next();
      })
      .catch(err => {console.log(err)});
  }
});
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);


mongoose.connect(MONGO_DB_URI)
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


