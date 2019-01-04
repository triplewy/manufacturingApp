module.exports = function(conn, loggedIn, client) {
    'use strict';
    var accountRoutes = require('express').Router();

    accountRoutes.get('/', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/account');
      const userId = req.user
      conn.query(
      'SELECT a.*, b.*, b.name AS companyName ' +
      'FROM users AS a JOIN companies AS b ON b.companyId = a.companyId WHERE userId = :userId LIMIT 1', {userId: userId}, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.send(result[0])
        }
      })
    })

    accountRoutes.post('/token', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/account/token');
      const userId = req.user
      conn.query('UPDATE users SET deviceToken = :token WHERE userId = :userId', {token: req.body.token, userId: userId}, function(err, result) {
        if (err) {
          console.log(err);
          res.send({ message: 'failure' })
        } else {
          if (result.affectedRows) {
            console.log('Token added successfully');
            res.send({ message: 'success' })
          } else {
            res.send({ message: 'failure' })
          }
        }
      })
    })

    accountRoutes.get('/notifications', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/account/notifications');
      const userId = req.user
      conn.query('SELECT b.* FROM users AS a JOIN notifications AS b ON b.userId = a.userId OR (b.isGlobal AND b.companyId = a.companyId) ' +
      'WHERE a.userId = :userId ORDER BY b.createdDate DESC', { userId: userId }, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.send(result)
        }
      })
    })

    accountRoutes.post('/notifications/read', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/account/notifications/read');
      const userId = req.user
      client.HMSET(userId, {
        badge: '0'
      }, function(err, result) {
        if (result == 'OK') {
          res.send({ message: 'success' })
        } else {
          res.send({ message: 'fail' })
        }
      })
    })

    return accountRoutes;

};
