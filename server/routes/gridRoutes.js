module.exports = function(conn, loggedIn) {
    'use strict';
    var gridRoutes = require('express').Router();

    gridRoutes.get('/', (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/grid');
      console.log(req.sessionID);
      const userId = req.user
      conn.query('SELECT * FROM machines WHERE lineId IN (SELECT lineId FROM assemblyLines WHERE userId = :userId) ORDER BY name', {userId: userId}, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.send(result)
        }
      })
    })

    gridRoutes.get('/line/:lineId', (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/grid/line/' + req.params.lineId);
      const userId = req.user
      conn.query('SELECT * FROM machines WHERE lineId = :lineId ORDER BY name', {userId: userId, lineId: req.params.lineId}, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.send(result)
        }
      })
    })

    return gridRoutes;

};
