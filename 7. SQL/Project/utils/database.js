const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  users: 'root',
  database: 'node-complete',
  password: 'jpcushway2018!'
});

module.exports = pool.promise();