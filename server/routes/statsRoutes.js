module.exports = function(conn, loggedIn) {
    'use strict';
    var statsRoutes = require('express').Router();

    statsRoutes.get('/totalDowntime/:timePeriod/:lineId', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/stats/totalDowntime/' + req.params.timePeriod + '/' + req.params.lineId);
      const userId = req.user
      const timePeriodQuery = parseTotalTimePeriod(req.params.timePeriod * 1)
      conn.query('SELECT SUM(b.downtime) AS totalDowntime FROM downtime AS b WHERE b.lineId = :lineId AND b.createdDate <= CURRENT_TIMESTAMP' + timePeriodQuery, {userId: userId, lineId: req.params.lineId}, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.send(result[0])
        }
      })
    })

    statsRoutes.get('/totalDowntime/:timePeriod', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/stats/totalDowntime/' + req.params.timePeriod);
      const userId = req.user
      const timePeriodQuery = parseTotalTimePeriod(req.params.timePeriod * 1)
      conn.query('SELECT SUM(b.downtime) AS totalDowntime FROM downtime AS b WHERE b.lineId = (SELECT lineId FROM assemblyLineUsers WHERE userId = :userId ORDER BY lineId ASC LIMIT 1) ' +
      'AND b.createdDate <= CURRENT_TIMESTAMP' + timePeriodQuery, {userId: userId}, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.send(result[0])
        }
      })
    })

    statsRoutes.get('/downtime/time/:timePeriod/line/:lineId', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/stats/downtime/time/' + req.params.timePeriod + '/line/' + req.params.lineId);
      const userId = req.user
      const timePeriodQuery = parseTimePeriodLine(req.params.timePeriod * 1)
      conn.query(timePeriodQuery, {userId: userId, lineId: req.params.lineId}, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.send(result)
        }
      })
    })

    statsRoutes.get('/downtime/time/:timePeriod', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/stats/downtime/time/' + req.params.timePeriod);
      const userId = req.user
      const timePeriodQuery = parseTimePeriod(req.params.timePeriod * 1)
      conn.query(timePeriodQuery, {userId: userId}, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.send(result)
        }
      })
    })

    statsRoutes.get('/downtime/machines/:timePeriod/line/:lineId', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/stats/downtime/machines/' + req.params.timePeriod + '/line/' + req.params.lineId);
      const userId = req.user
      const timePeriodQuery = parseTotalTimePeriod(req.params.timePeriod * 1)
      conn.query(
      'SELECT a.*, SUM(b.downtime) AS totalDowntime FROM machines AS a ' +
      'JOIN downtime AS b ON b.machineId = a.machineId AND b.createdDate <= CURRENT_TIMESTAMP' + timePeriodQuery +
      'WHERE a.lineId = :lineId GROUP BY a.machineId ORDER BY totalDowntime DESC', {userId: userId, lineId: req.params.lineId}, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.send(result)
        }
      })
    })

    statsRoutes.get('/downtime/machines/:timePeriod', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/stats/downtime/machines/' + req.params.timePeriod);
      const userId = req.user
      const timePeriodQuery = parseTotalTimePeriod(req.params.timePeriod * 1)
      conn.query(
      'SELECT a.*, SUM(b.downtime) AS totalDowntime FROM machines AS a ' +
      'JOIN downtime AS b ON b.machineId = a.machineId AND b.createdDate <= CURRENT_TIMESTAMP' + timePeriodQuery +
      'WHERE a.lineId = (SELECT lineId FROM assemblyLineUsers WHERE userId = :userId ORDER BY lineId ASC LIMIT 1) GROUP BY a.machineId ORDER BY totalDowntime DESC', {userId: userId}, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.send(result)
        }
      })
    })

    statsRoutes.get('/downtime/machines/line/:lineId/:timePeriod/:date', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/stats/downtime/machines/' + req.params.lineId + '/' + req.params.timePeriod + '/' + req.params.date);
      const userId = req.user
      const timePeriodQuery = parseTimePeriodDate(req.params.timePeriod * 1)
      conn.query(
      'SELECT a.*, SUM(b.downtime) AS totalDowntime FROM machines AS a ' +
      'JOIN downtime AS b ON b.machineId = a.machineId' + timePeriodQuery +
      'WHERE a.lineId = :lineId GROUP BY a.machineId ORDER BY totalDowntime DESC', {userId: userId, date: req.params.date, lineId: req.params.lineId}, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.send(result)
        }
      })
    })

    // statsRoutes.get('/downtime/machines/:timePeriod/:date', loggedIn, (req, res) => {
    //   console.log('- Request received:', req.method.cyan, '/api/stats/downtime/machines/' + req.params.timePeriod + '/' + req.params.date);
    //   const userId = req.user
    //   const timePeriodQuery = parseTimePeriodDate(req.params.timePeriod * 1)
    //   conn.query(
    //   'SELECT a.*, SUM(b.downtime) AS totalDowntime FROM machines AS a ' +
    //   'JOIN downtime AS b ON b.machineId = a.machineId' + timePeriodQuery +
    //   'WHERE a.lineId IN (SELECT lineId FROM assemblyLines WHERE userId = :userId) GROUP BY a.machineId ORDER BY totalDowntime DESC', {userId: userId, date: req.params.date}, function(err, result) {
    //     if (err) {
    //       console.log(err);
    //     } else {
    //       res.send(result)
    //     }
    //   })
    // })

    statsRoutes.get('/downtime/lines/:timePeriod/:date', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/stats/downtime/lines/' + req.params.timePeriod + '/' + req.params.date);
      const userId = req.user
      const timePeriodQuery = parseTimePeriodDate(req.params.timePeriod * 1)
      conn.query(
        'SELECT a.*, CONCAT(\'Line\', \' \', a.lineId) AS name, SUM(b.downtime) AS totalDowntime FROM assemblyLines AS a ' +
        'JOIN downtime AS b ON b.lineId = a.lineId' + timePeriodQuery +
        'WHERE a.userId = :userId GROUP BY a.lineId ORDER BY totalDowntime DESC', {userId: userId, date: req.params.date}, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.send(result)
        }
      })
    })

    statsRoutes.get('/downtime/shifts/line=:lineId/:timePeriod/:date', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/stats/downtime/shifts/line=' + req.params.lineId + '/' + req.params.timePeriod + '/' + req.params.date);
      const userId = req.user
      const timePeriodQuery = parseTimePeriodDate(req.params.timePeriod * 1)
      conn.query(
      'SELECT SUM(b.downtime) AS totalDowntime, \'Day Shift\' AS name FROM downtime AS b ' +
      'JOIN assemblyLines AS a ON a.lineId = b.lineId ' +
      'WHERE b.lineId = :lineId AND (HOUR(b.createdDate) >= a.morningShift AND HOUR(b.createdDate) < a.eveningShift)' + timePeriodQuery + 'UNION ALL ' +
      'SELECT SUM(b.downtime) AS totalDowntime, \'Night Shift\' AS name FROM downtime AS b ' +
      'JOIN assemblyLines AS a ON a.lineId = b.lineId ' +
      'WHERE b.lineId = :lineId AND (HOUR(b.createdDate) < a.morningShift OR HOUR(b.createdDate) >= a.eveningShift)' + timePeriodQuery,
      {userId: userId, lineId: req.params.lineId, date: req.params.date}, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.send(result)
        }
      })
    })

    function parseTotalTimePeriod(timePeriod) {
      switch (timePeriod) {
        case 0:
          return ' AND b.createdDate >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 DAY)'
        case 1:
          return ' AND b.createdDate >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 WEEK)'
        case 2:
          return ' AND b.createdDate >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 MONTH)'
        case 3:
          return ' AND b.createdDate >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 YEAR)'
        case 4:
          return ' '
        default:
          return ' AND b.createdDate >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 WEEK)'
      }
    }

    function parseTimePeriodDate(timePeriod) {
      switch (timePeriod) {
        case 0:
          return ' AND b.createdDate >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 DAY) AND HOUR(b.createdDate) = :date '
        case 1:
          return ' AND DATE(b.createdDate) = DATE(:date) '
        case 2:
          return ' AND DATE(b.createdDate) = DATE(:date) '
        case 3:
          return ' AND b.createdDate >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 YEAR) AND MONTH(b.createdDate) = :date '
        case 4:
          return ' AND YEAR(b.createdDate) = :date '
        default:
          return ' AND DATE(b.createdDate) = DATE(:date) '
      }
    }

    function parseTimePeriod(timePeriod) {
      switch (timePeriod) {
        case 0:
          return 'SELECT SUM(a.downtime) AS totalDowntime, b.availableMin, HOUR(a.createdDate) AS time FROM downtime AS a JOIN assemblyLines AS b ON b.lineId = a.lineId WHERE a.createdDate >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 DAY) AND a.lineId = (SELECT lineId FROM assemblyLineUsers WHERE userId = :userId ORDER BY lineId ASC LIMIT 1) GROUP BY HOUR(a.createdDate) ORDER BY time ASC'
        case 1:
          return 'SELECT SUM(a.downtime) AS totalDowntime, b.availableMin, DATE(a.createdDate) AS time FROM downtime AS a JOIN assemblyLines AS b ON b.lineId = a.lineId WHERE a.createdDate >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 WEEK) AND a.lineId = (SELECT lineId FROM assemblyLineUsers WHERE userId = :userId ORDER BY lineId ASC LIMIT 1) GROUP BY DATE(a.createdDate) ORDER BY time ASC'
        case 2:
          return 'SELECT SUM(a.downtime) AS totalDowntime, b.availableMin, DATE(a.createdDate) AS time FROM downtime AS a JOIN assemblyLines AS b ON b.lineId = a.lineId WHERE a.createdDate >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 30 DAY) AND a.lineId = (SELECT lineId FROM assemblyLineUsers WHERE userId = :userId ORDER BY lineId ASC LIMIT 1) GROUP BY DATE(a.createdDate) ORDER BY time ASC'
        case 3:
          return 'SELECT SUM(a.downtime) AS totalDowntime, b.availableMin, MONTH(a.createdDate) AS time FROM downtime AS a JOIN assemblyLines AS b ON b.lineId = a.lineId WHERE a.createdDate >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 YEAR) AND a.lineId = (SELECT lineId FROM assemblyLineUsers WHERE userId = :userId ORDER BY lineId ASC LIMIT 1) GROUP BY MONTH(a.createdDate) ORDER BY time ASC'
        case 4:
          return 'SELECT SUM(a.downtime) AS totalDowntime, b.availableMin, YEAR(a.createdDate) AS time FROM downtime AS a JOIN assemblyLines AS b ON b.lineId = a.lineId WHERE a.createdDate >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 2 YEAR) AND a.lineId = (SELECT lineId FROM assemblyLineUsers WHERE userId = :userId ORDER BY lineId ASC LIMIT 1) GROUP BY YEAR(a.createdDate) ORDER BY time ASC'
        default:
          return 'SELECT SUM(a.downtime) AS totalDowntime, b.availableMin, DATE(a.createdDate) AS time FROM downtime AS a JOIN assemblyLines AS b ON b.lineId = a.lineId WHERE a.createdDate >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 WEEK) AND a.lineId = (SELECT lineId FROM assemblyLineUsers WHERE userId = :userId ORDER BY lineId ASC LIMIT 1) GROUP BY DATE(a.createdDate) ORDER BY time ASC'
      }
    }

    function parseTimePeriodLine(timePeriod) {
      switch (timePeriod) {
        case 0:
          return 'SELECT SUM(a.downtime) AS totalDowntime, b.availableMin, HOUR(a.createdDate) AS time FROM downtime AS a JOIN assemblyLines AS b ON b.lineId = a.lineId WHERE a.createdDate >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 DAY) AND a.lineId = :lineId GROUP BY HOUR(a.createdDate) ORDER BY time ASC'
        case 1:
          return 'SELECT SUM(a.downtime) AS totalDowntime, b.availableMin, DATE(a.createdDate) AS time FROM downtime AS a JOIN assemblyLines AS b ON b.lineId = a.lineId WHERE a.createdDate >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 WEEK) AND a.lineId = :lineId GROUP BY DATE(a.createdDate) ORDER BY time ASC'
        case 2:
          return 'SELECT SUM(a.downtime) AS totalDowntime, b.availableMin, DATE(a.createdDate) AS time FROM downtime AS a JOIN assemblyLines AS b ON b.lineId = a.lineId WHERE a.createdDate >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 30 DAY) AND a.lineId = :lineId GROUP BY DATE(a.createdDate) ORDER BY time ASC'
        case 3:
          return 'SELECT SUM(a.downtime) AS totalDowntime, b.availableMin, MONTH(a.createdDate) AS time FROM downtime AS a JOIN assemblyLines AS b ON b.lineId = a.lineId WHERE a.createdDate >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 YEAR) AND a.lineId = :lineId GROUP BY MONTH(a.createdDate) ORDER BY time ASC'
        case 4:
          return 'SELECT SUM(a.downtime) AS totalDowntime, b.availableMin, YEAR(a.createdDate) AS time FROM downtime AS a JOIN assemblyLines AS b ON b.lineId = a.lineId WHERE a.createdDate >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 2 YEAR) AND a.lineId = :lineId GROUP BY YEAR(a.createdDate) ORDER BY time ASC'
        default:
          return 'SELECT SUM(a.downtime) AS totalDowntime, b.availableMin, DATE(a.createdDate) AS time FROM downtime AS a JOIN assemblyLines AS b ON b.lineId = a.lineId WHERE a.createdDate >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 WEEK) AND a.lineId = :lineId GROUP BY DATE(a.createdDate) ORDER BY time ASC'
      }
    }

    return statsRoutes;
};
