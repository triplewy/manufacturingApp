module.exports = function(conn, loggedIn) {
    'use strict';
    var changeoverRoutes = require('express').Router();

    changeoverRoutes.get('/', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/changeover');
      const userId = req.user
      conn.query('SELECT b.*, a.name AS line FROM assemblyLines AS a JOIN changeovers AS b ON b.lineId = a.lineId WHERE a.companyId = ' +
      '(SELECT companyId FROM users WHERE userId = :userId)', { userId: userId }, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.send(result)
        }
      })
    })

    changeoverRoutes.post('/', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/changeover');
      conn.query('INSERT INTO changeovers (lineId, title) VALUES (?,?)', [req.body.lineId, req.body.title], function(err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log('Changeover added successfully');
          res.send({ changeoverId: result.insertId })
        }
      })
    })

    changeoverRoutes.get('/:changeoverId', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/changeover/' + req.params.changeoverId);
      conn.query('SELECT * FROM changeoverSteps WHERE changeoverId = :changeoverId ORDER BY step', { changeoverId: req.params.changeoverId }, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.send(result)
        }
      })
    })

    return changeoverRoutes;

};
