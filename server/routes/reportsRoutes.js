module.exports = function(conn, loggedIn) {
    'use strict';
    var reportsRoutes = require('express').Router();

    reportsRoutes.get('/', (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/reports');
      // const userId = req.user
      conn.query('SELECT a.*, a.createdDate AS reportedDate, b.*, c.*, d.images FROM downtime AS a ' +
      'JOIN machines AS b ON b.machineId = a.machineId ' +
      'JOIN assemblyLines AS c ON c.lineId = b.lineId ' +
      'LEFT JOIN (SELECT downtimeId, JSON_ARRAYAGG(JSON_OBJECT(\'url\', imageUrl)) AS images FROM downtimeImages GROUP BY downtimeId) AS d ON d.downtimeId = a.downtimeId ' +
      'ORDER BY reportedDate DESC',
      {}, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          for (var i = 0; i < result.length; i++) {
            if (result[i].images) {
              result[i].images = JSON.parse(result[i].images)
            }
          }
          res.send(result)
        }
      })
    })

    return reportsRoutes;

};
