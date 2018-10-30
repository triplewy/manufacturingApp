module.exports = function(conn, loggedIn) {
    'use strict';
    var statsRoutes = require('express').Router();

    statsRoutes.get('/totalDowntime', (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/stats/totalDowntime');
      // const userId = req.user
      conn.query('SELECT SUM(downtime) AS totalDowntime FROM downtime', {}, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.send(result[0])
        }
      })
    })

    statsRoutes.get('/downtime/time', (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/stats/downtime/time');
      conn.query(
      'SELECT DATE(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 6 DAY)) AS day, SUM(downtime) AS totalDowntime FROM downtime WHERE DATE(createdDate) = DATE(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 6 DAY)) UNION ALL ' +
      'SELECT DATE(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 5 DAY)) AS day, SUM(downtime) AS totalDowntime FROM downtime WHERE DATE(createdDate) = DATE(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 5 DAY)) UNION ALL ' +
      'SELECT DATE(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 4 DAY)) AS day, SUM(downtime) AS totalDowntime FROM downtime WHERE DATE(createdDate) = DATE(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 4 DAY)) UNION ALL ' +
      'SELECT DATE(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 3 DAY)) AS day, SUM(downtime) AS totalDowntime FROM downtime WHERE DATE(createdDate) = DATE(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 3 DAY)) UNION ALL ' +
      'SELECT DATE(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 2 DAY)) AS day, SUM(downtime) AS totalDowntime FROM downtime WHERE DATE(createdDate) = DATE(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 2 DAY)) UNION ALL ' +
      'SELECT DATE(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 DAY)) AS day, SUM(downtime) AS totalDowntime FROM downtime WHERE DATE(createdDate) = DATE(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 DAY)) UNION ALL ' +
      'SELECT DATE(CURRENT_TIMESTAMP) AS day, SUM(downtime) AS totalDowntime FROM downtime WHERE DATE(createdDate) = DATE(CURRENT_TIMESTAMP) ORDER BY day ASC', {}, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.send(result)
        }
      })
    })

    statsRoutes.get('/downtime/lines', (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/stats/downtime/lines');
      conn.query(
      'SELECT a.*, SUM(b.downtime) AS totalDowntime FROM assemblyLines AS a ' +
      'JOIN downtime AS b ON b.lineId = a.lineId GROUP BY a.lineId', {}, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.send(result)
        }
      })
    })

    statsRoutes.get('/downtime/machines', (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/stats/downtime/machines');
      conn.query(
      'SELECT a.*, SUM(b.downtime) AS totalDowntime FROM machines AS a ' +
      'JOIN downtime AS b ON b.machineId = a.machineId GROUP BY a.machineId', {}, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.send(result)
        }
      })
    })



    return statsRoutes;

};
