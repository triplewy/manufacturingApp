module.exports = function(conn, loggedIn) {
    'use strict';
    var reportsRoutes = require('express').Router();

    reportsRoutes.get('/', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/reports');
      const userId = req.user
      conn.query('SELECT a.*, a.createdDate AS reportedDate, b.*, c.*, d.images, (SELECT name FROM usersNames WHERE userId = :userId AND loggedInDate < a.createdDate ORDER BY loggedInDate DESC LIMIT 1) AS leaderName ' +
      'FROM downtime AS a ' +
      'JOIN machines AS b ON b.machineId = a.machineId ' +
      'JOIN assemblyLines AS c ON c.lineId = b.lineId ' +
      'LEFT JOIN (SELECT downtimeId, JSON_ARRAYAGG(JSON_OBJECT(\'url\', imageUrl)) AS images FROM downtimeImages GROUP BY downtimeId) AS d ON d.downtimeId = a.downtimeId ' +
      'WHERE a.lineId IN (SELECT lineId FROM assemblyLines WHERE userId = :userId) ORDER BY reportedDate DESC',
      {userId: userId}, function(err, result) {
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

    reportsRoutes.get('/line/:lineId', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/reports/line/' + req.params.lineId);
      const userId = req.user
      conn.query('SELECT a.*, a.createdDate AS reportedDate, b.*, c.*, d.images, (SELECT name FROM usersNames WHERE userId = :userId AND loggedInDate < a.createdDate ORDER BY loggedInDate DESC LIMIT 1) AS leaderName ' +
      'FROM downtime AS a ' +
      'JOIN machines AS b ON b.machineId = a.machineId ' +
      'JOIN assemblyLines AS c ON c.lineId = b.lineId ' +
      'LEFT JOIN (SELECT downtimeId, JSON_ARRAYAGG(JSON_OBJECT(\'url\', imageUrl)) AS images FROM downtimeImages GROUP BY downtimeId) AS d ON d.downtimeId = a.downtimeId ' +
      'WHERE a.lineId = :lineId ORDER BY reportedDate DESC',
      {userId: userId, lineId: req.params.lineId}, function(err, result) {
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
