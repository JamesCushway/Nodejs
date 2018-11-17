const Sequilize = require('sequelize');

const db = require('../utils/database');

const Order = db.define('order', {
  id: {
    type: Sequilize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  }
});

module.exports = Order;