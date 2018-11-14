module.exports = function(conn, loggedIn) {
    'use strict';
    var reportsRoutes = require('express').Router();

    reportsRoutes.get('/page=:page', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/reports/page=' + req.params.page);
      const userId = req.user
      const page = req.params.page * 10
      console.log("page is", page);
      conn.query('SELECT a.*, a.createdDate AS reportedDate, b.*, b.name AS machineName, c.*, d.images ' +
      'FROM downtime AS a ' +
      'JOIN machines AS b ON b.machineId = a.machineId ' +
      'JOIN assemblyLines AS c ON c.lineId = b.lineId ' +
      'LEFT JOIN (SELECT downtimeId, JSON_ARRAYAGG(JSON_OBJECT(\'url\', imageUrl)) AS images FROM downtimeImages GROUP BY downtimeId) AS d ON d.downtimeId = a.downtimeId ' +
      'WHERE a.lineId IN (SELECT lineId FROM assemblyLineUsers WHERE userId = :userId) ORDER BY reportedDate DESC LIMIT ' + page + ',10',
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

    reportsRoutes.get('/line/:lineId/page=:page', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/reports/line/' + req.params.lineId + '/page=' + req.params.page);
      const userId = req.user
      const page = req.params.page * 10
      conn.query('SELECT a.*, a.createdDate AS reportedDate, b.*, b.name AS machineName, c.*, d.images ' +
      'FROM downtime AS a ' +
      'JOIN machines AS b ON b.machineId = a.machineId ' +
      'JOIN assemblyLines AS c ON c.lineId = b.lineId ' +
      'LEFT JOIN (SELECT downtimeId, JSON_ARRAYAGG(JSON_OBJECT(\'url\', imageUrl)) AS images FROM downtimeImages GROUP BY downtimeId) AS d ON d.downtimeId = a.downtimeId ' +
      'WHERE a.lineId = :lineId ORDER BY reportedDate DESC LIMIT ' + page + ',10',
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
