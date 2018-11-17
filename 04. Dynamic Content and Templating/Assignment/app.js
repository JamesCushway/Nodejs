const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const userData = require('./routes/add-user');
const userRoutes = require('./routes/users');

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(userData.router);
app.use(userRoutes);

app.listen(3000);