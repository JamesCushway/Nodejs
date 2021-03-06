const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  let errorMessage = req.flash('error');
  if (errorMessage.length) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    errorMessage
  });
};

exports.getSignup = (req, res, next) => {
  let errorMessage = req.flash('error');
  if (errorMessage.length) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }

  res.render('auth/signup', {
    pageTitle: 'Sign Up',
    path: '/signup',
    errorMessage
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email })
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid email or password');
        return res.redirect('/login');
      }
      return bcrypt.compare(password, user.password)
        .then(passwordMatch => {
          if (passwordMatch) {
            req.session.user = user;
            req.session.isLoggedIn = true;
            return req.session.save((err) => {
              console.log(err);
              res.redirect('/');
            });
          }
          req.flash('error', 'Invalid email or password');
          return res.redirect('/login');
        })
        .catch(err => {
          console.log(err);
          return res.redirect('/login');
        })
    })
    .catch(err => {console.log(err)});
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  User.findOne({email: req.body.email})
    .then((user) => {
      if (user) {
        req.flash('error', 'Email already exists');
        return res.redirect('/signup');
      }
      return bcrypt.hash(password, 12)
        .then(hashedPassword => {
          const newUser = new User({
            email,
            password: hashedPassword,
            cart: { items: [] }
          })
          newUser.save()
        })
        .then(result => {
          res.redirect('/login');
        })
    })
    .catch(err => {
      console.log(err);
    })
}

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    res.redirect('/');
  });
};