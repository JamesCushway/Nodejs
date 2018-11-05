const path= require('path');

const express = require('express');

const routes = require('./routes/index');

const app = express();

app.use(routes);
app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000);