module.exports = function(conn, loggedIn) {
    'use strict';
    var reportsRoutes = require('express').Router();

    reportsRoutes.get('/', (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/reports');
      // const userId = req.user
      conn.query('SELECT a.*, a.createdDate AS reportedDate, b.*, c.* FROM downtime AS a ' +
      'JOIN machines AS b ON b.machineId = a.machineId JOIN assemblyLines AS c ON c.lineId = b.lineId ORDER BY reportedDate DESC',
      {}, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.send(result)
        }
      })
    })

    return reportsRoutes;

};
