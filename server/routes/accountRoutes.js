module.exports = function(conn, loggedIn) {
    'use strict';
    var accountRoutes = require('express').Router();

    accountRoutes.get('/', (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/account');
      // const userId = req.user
      conn.query('SELECT a.*, b.name AS companyName FROM users AS a JOIN companies AS b ON b.companyId = a.companyId LIMIT 1', {}, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.send(result[0])
        }
      })
    })

    return accountRoutes;

};
