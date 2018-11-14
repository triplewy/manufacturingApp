module.exports = function(conn, loggedIn) {
    'use strict';
    var accountRoutes = require('express').Router();

    accountRoutes.get('/', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/account');
      const userId = req.user
      conn.query(
      'SELECT a.*, b.*, b.name AS companyName, (SELECT JSON_ARRAYAGG(lineId) FROM assemblyLineUsers WHERE userId = a.userId) AS lineNumbers ' +
      'FROM users AS a JOIN companies AS b ON b.companyId = a.companyId WHERE userId = :userId LIMIT 1', {userId: userId}, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          if (result.length > 0) {
            if (result[0].lineNumbers) {
              result[0].lineNumbers = JSON.parse(result[0].lineNumbers)
            }
            res.send(result[0])
          } else {
            res.send(result)
          }
        }
      })
    })

    accountRoutes.get('/lines', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/account/lines');
      const userId = req.user
      conn.query(
      'SELECT a.lineId, b.name FROM assemblyLineUsers AS a JOIN assemblyLines AS b ON b.lineId = a.lineId WHERE a.userId = :userId ORDER BY lineId ASC', {userId: userId}, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.send(result)
        }
      })
    })

    return accountRoutes;

};
