const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');

const User = require('../models/user');

const transporter = nodemailer.createTransport(sendGridTransport({
  auth: {
    api_key: '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'
  }
}));

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

exports.getResetPassword = (req, res, next) => {
  let errorMessage = req.flash('error');
  if (errorMessage.length) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }
  res.render('auth/reset-password', {
    pageTitle: 'Reset password',
    path: '/reset-password',
    errorMessage
  });
}

exports.getUpdatePassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() }})
    .then(user => {
      let errorMessage = req.flash('error');
      if (errorMessage.length) {
        errorMessage = errorMessage[0];
      } else {
        errorMessage = null;
      }
      res.render('auth/update-password', {
        pageTitle: 'Update password',
        path: '/update-password',
        errorMessage,
        userId: user._id.toString(),
        passwordToken: token
      });
    })
    .catch(err => {
      console.log(err)
    });

}

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
          return transporter.sendMail({
            to: email,
            from: 'mynodeapp@node.js',
            subject: 'Signup successful!',
            html: 'You successfully signed up!'
          });
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

exports.postResetpassword = (req, res, next) => {
  const email = req.body.email;
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      return res.redirect('reset-password');
    }
    console.log(email);
    const token = buffer.toString('hex');
    User.findOne({ email: email })
      .then((user) => {
        if (!user) {
          req.flash('error', 'No account with that email!');
          return res.redirect('/reset-password');
        }
        user.resetToken = token;
        user.resetTokenExpiry = Date.now() + (60 * 60 * 1000);
        return user.save();
      })
      .then(result => {
        res.redirect('/');
        transporter.sendMail({
          to: email,
          from: 'mynodeapp@node.js',
          subject: 'Forgot Password',
          html: `
            <p>You requested a password reset!</p>
            <p>To reset your password, <a href="http://localhost:3000/reset-password/${token}">click here!</a></p>
          `
        });
      })
      .catch(err => {
        console.log(err);
      })
  })
};

exports.postUpdatePassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;

  User.findOne({ resetToken: passwordToken, resetTokenExpiry: { $gt: Date.now() }, _id: userId})
    .then(user => {
      if (!user) {
        res.redirect('/');
      }
      bcrypt.hash(newPassword, 12)
        .then(hashedPassword => {
          user.password = hashedPassword;
          user.resetToken = null;
          user.resetTokenExpiry = null;
          return user.save();
        })
    })
    .then(result => {
      res.redirect('/');
    })
    .catch(err => {
      console.log(err);
    })
}