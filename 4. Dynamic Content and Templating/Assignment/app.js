const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const userData = require('./routes/users');
const addUserRoutes = require('./routes/add-user');