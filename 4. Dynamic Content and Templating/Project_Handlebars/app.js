const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('express-handlebars');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();
app.engine('hbs', hbs({
  layoutsDir: 'views/layouts/',
  defaultLayout: 'base',
  extname: 'hbs'
}));
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData.router);
app.use(shopRoutes);

app.use((req, res, next) => {
  res.status(404).render('404', { pageTitle: 'Error 404'});
});

app.listen(3000);