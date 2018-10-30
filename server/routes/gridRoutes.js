module.exports = function(conn, loggedIn) {
    'use strict';
    var gridRoutes = require('express').Router();

    gridRoutes.get('/', (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/grid');
      // const userId = req.user
      conn.query('SELECT * FROM machines WHERE lineId IN (SELECT lineId FROM assemblyLines)', {}, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.send(result)
        }
      })
    })

    return gridRoutes;

};
