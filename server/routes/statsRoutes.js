module.exports = function(conn, loggedIn) {
    'use strict';
    var statsRoutes = require('express').Router();

    statsRoutes.get('/totalDowntime/:timePeriod', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/stats/totalDowntime/' + req.params.timePeriod);
      const userId = req.user
      const timePeriodQuery = parseTotalTimePeriod(req.params.timePeriod * 1)
      conn.query('SELECT SUM(downtime) AS totalDowntime FROM downtime WHERE lineId IN (SELECT lineId FROM assemblyLines WHERE userId = :userId) ' +
      'AND createdDate <= CURRENT_TIMESTAMP' + timePeriodQuery, {userId: userId}, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.send(result[0])
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
          console.log(result);
          res.send(result)
        }
      })
    })

    statsRoutes.get('/downtime/machines/:timePeriod/:date', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/stats/downtime/machines/' + req.params.timePeriod + '/' + req.params.date);
      const userId = req.user
      const timePeriodQuery = parseTimePeriodDate(req.params.timePeriod * 1)
      conn.query(
      'SELECT a.*, SUM(b.downtime) AS totalDowntime FROM machines AS a ' +
      'JOIN downtime AS b ON b.machineId = a.machineId' + timePeriodQuery +
      'WHERE a.lineId IN (SELECT lineId FROM assemblyLines WHERE userId = :userId) GROUP BY a.machineId ORDER BY totalDowntime DESC', {userId: userId, date: req.params.date}, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.send(result)
        }
      })
    })

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

    statsRoutes.get('/downtime/shifts/:timePeriod/:date', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/stats/downtime/shifts/' + req.params.timePeriod + '/' + req.params.date);
      const userId = req.user
      const timePeriodQuery = parseTimePeriodDate(req.params.timePeriod * 1)
      conn.query(
      'SELECT SUM(b.downtime) AS totalDowntime, \'Day Shift\' AS name FROM downtime AS b ' +
      'JOIN assemblyLines AS a ON a.lineId = b.lineId AND a.userId = :userId ' +
      'JOIN companies AS c ON c.companyId = a.companyId ' +
      'WHERE (HOUR(b.createdDate) >= c.morningShift AND HOUR(b.createdDate) < c.eveningShift)' + timePeriodQuery + 'UNION ALL ' +
      'SELECT SUM(b.downtime) AS totalDowntime, \'Night Shift\' AS name FROM downtime AS b ' +
      'JOIN assemblyLines AS a ON a.lineId = b.lineId AND a.userId = :userId ' +
      'JOIN companies AS c ON c.companyId = a.companyId ' +
      'WHERE (HOUR(b.createdDate) < c.morningShift OR HOUR(b.createdDate) >= c.eveningShift)' + timePeriodQuery,
      {userId: userId, date: req.params.date}, function(err, result) {
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
          return ' AND createdDate >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 DAY)'
        case 1:
          return ' AND createdDate >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 WEEK)'
        case 2:
          return ' AND createdDate >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 MONTH)'
        case 3:
          return ' AND createdDate >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 YEAR)'
        case 4:
          return ''
        default:
          return ' AND createdDate >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 WEEK)'
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

    // function parseTotalTimePeriodDate(timePeriod) {
    //   switch (timePeriod) {
    //     case 0:
    //       return 'HOUR(createdDate) = HOUR(:date)'
    //     case 1:
    //       return 'DATE(createdDate) = DATE(:date)'
    //     case 2:
    //       return 'DATE(createdDate) = DATE(:date)'
    //     case 3:
    //       return 'MONTH(createdDate) = MONTH(:date)'
    //     case 4:
    //       return 'YEAR(createdDate) = YEAR(:date)'
    //     default:
    //       return 'DATE(createdDate) = DATE(:date)'
    //   }
    // }

    function parseTimePeriod(timePeriod) {
      switch (timePeriod) {
        case 0:
          return (
            'SELECT SUM(downtime) AS totalDowntime, HOUR(createdDate) AS time FROM downtime WHERE createdDate >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 DAY) AND lineId IN (SELECT lineId FROM assemblyLines WHERE userId = :userId) GROUP BY HOUR(createdDate) ORDER BY time ASC'
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 23 HOUR) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE createdDate >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 DAY) AND HOUR(createdDate) = HOUR(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 23 HOUR)) UNION ALL ' +
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 22 HOUR) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE createdDate >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 DAY) AND HOUR(createdDate) = HOUR(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 22 HOUR)) UNION ALL ' +
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 21 HOUR) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE createdDate >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 DAY) AND HOUR(createdDate) = HOUR(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 21 HOUR)) UNION ALL ' +
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 20 HOUR) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE createdDate >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 DAY) AND HOUR(createdDate) = HOUR(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 20 HOUR)) UNION ALL ' +
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 19 HOUR) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE createdDate >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 DAY) AND HOUR(createdDate) = HOUR(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 19 HOUR)) UNION ALL ' +
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 18 HOUR) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE createdDate >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 DAY) AND HOUR(createdDate) = HOUR(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 18 HOUR)) UNION ALL ' +
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 17 HOUR) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE createdDate >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 DAY) AND HOUR(createdDate) = HOUR(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 17 HOUR)) UNION ALL ' +
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 16 HOUR) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE createdDate >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 DAY) AND HOUR(createdDate) = HOUR(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 16 HOUR)) UNION ALL ' +
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 15 HOUR) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE createdDate >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 DAY) AND HOUR(createdDate) = HOUR(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 15 HOUR)) UNION ALL ' +
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 14 HOUR) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE createdDate >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 DAY) AND HOUR(createdDate) = HOUR(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 14 HOUR)) UNION ALL ' +
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 13 HOUR) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE createdDate >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 DAY) AND HOUR(createdDate) = HOUR(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 13 HOUR)) UNION ALL ' +
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 12 HOUR) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE createdDate >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 DAY) AND HOUR(createdDate) = HOUR(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 12 HOUR)) UNION ALL ' +
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 11 HOUR) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE createdDate >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 DAY) AND HOUR(createdDate) = HOUR(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 11 HOUR)) UNION ALL ' +
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 10 HOUR) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE createdDate >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 DAY) AND HOUR(createdDate) = HOUR(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 10 HOUR)) UNION ALL ' +
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 9 HOUR) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE createdDate >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 DAY) AND HOUR(createdDate) = HOUR(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 9 HOUR)) UNION ALL ' +
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 8 HOUR) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE createdDate >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 DAY) AND HOUR(createdDate) = HOUR(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 8 HOUR)) UNION ALL ' +
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 7 HOUR) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE createdDate >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 DAY) AND HOUR(createdDate) = HOUR(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 7 HOUR)) UNION ALL ' +
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 6 HOUR) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE createdDate >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 DAY) AND HOUR(createdDate) = HOUR(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 6 HOUR)) UNION ALL ' +
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 5 HOUR) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE createdDate >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 DAY) AND HOUR(createdDate) = HOUR(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 5 HOUR)) UNION ALL ' +
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 4 HOUR) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE createdDate >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 DAY) AND HOUR(createdDate) = HOUR(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 4 HOUR)) UNION ALL ' +
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 3 HOUR) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE createdDate >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 DAY) AND HOUR(createdDate) = HOUR(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 3 HOUR)) UNION ALL ' +
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 2 HOUR) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE createdDate >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 DAY) AND HOUR(createdDate) = HOUR(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 2 HOUR)) UNION ALL ' +
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 HOUR) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE createdDate >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 DAY) AND HOUR(createdDate) = HOUR(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 HOUR)) UNION ALL ' +
            // 'SELECT CURRENT_TIMESTAMP AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE createdDate >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 DAY) AND HOUR(createdDate) = HOUR(CURRENT_TIMESTAMP) ORDER BY time ASC'
          )
        case 1:
          return (
            'SELECT SUM(downtime) AS totalDowntime, DATE(createdDate) AS time FROM downtime WHERE createdDate >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 WEEK) AND lineId IN (SELECT lineId FROM assemblyLines WHERE userId = :userId) GROUP BY DATE(createdDate) ORDER BY time ASC'
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 6 DAY) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE DATE(createdDate) = DATE(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 6 DAY)) UNION ALL ' +
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 5 DAY) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE DATE(createdDate) = DATE(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 5 DAY)) UNION ALL ' +
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 4 DAY) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE DATE(createdDate) = DATE(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 4 DAY)) UNION ALL ' +
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 3 DAY) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE DATE(createdDate) = DATE(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 3 DAY)) UNION ALL ' +
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 2 DAY) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE DATE(createdDate) = DATE(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 2 DAY)) UNION ALL ' +
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 DAY) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE DATE(createdDate) = DATE(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 DAY)) UNION ALL ' +
            // 'SELECT CURRENT_TIMESTAMP AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE DATE(createdDate) = DATE(CURRENT_TIMESTAMP) ORDER BY time ASC'
          )
        case 2:
          return (
            'SELECT SUM(downtime) AS totalDowntime, DATE(createdDate) AS time FROM downtime WHERE createdDate >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 30 DAY) AND lineId IN (SELECT lineId FROM assemblyLines WHERE userId = :userId) GROUP BY DATE(createdDate) ORDER BY time ASC'
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 29 DAY) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE DATE(createdDate) = DATE(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 29 DAY)) UNION ALL ' +
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 28 DAY) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE DATE(createdDate) = DATE(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 28 DAY)) UNION ALL ' +
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 27 DAY) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE DATE(createdDate) = DATE(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 27 DAY)) UNION ALL ' +
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 26 DAY) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE DATE(createdDate) = DATE(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 26 DAY)) UNION ALL ' +
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 25 DAY) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE DATE(createdDate) = DATE(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 25 DAY)) UNION ALL ' +
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 24 DAY) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE DATE(createdDate) = DATE(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 24 DAY)) UNION ALL ' +
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 23 DAY) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE DATE(createdDate) = DATE(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 23 DAY)) UNION ALL ' +
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 22 DAY) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE DATE(createdDate) = DATE(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 22 DAY)) UNION ALL ' +
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 21 DAY) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE DATE(createdDate) = DATE(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 21 DAY)) UNION ALL ' +
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 20 DAY) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE DATE(createdDate) = DATE(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 20 DAY)) UNION ALL ' +
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 19 DAY) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE DATE(createdDate) = DATE(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 19 DAY)) UNION ALL ' +
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 18 DAY) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE DATE(createdDate) = DATE(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 18 DAY)) UNION ALL ' +
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 17 DAY) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE DATE(createdDate) = DATE(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 17 DAY)) UNION ALL ' +
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 16 DAY) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE DATE(createdDate) = DATE(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 16 DAY)) UNION ALL ' +
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 15 DAY) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE DATE(createdDate) = DATE(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 15 DAY)) UNION ALL ' +
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 14 DAY) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE DATE(createdDate) = DATE(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 14 DAY)) UNION ALL ' +
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 13 DAY) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE DATE(createdDate) = DATE(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 13 DAY)) UNION ALL ' +
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 12 DAY) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE DATE(createdDate) = DATE(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 12 DAY)) UNION ALL ' +
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 11 DAY) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE DATE(createdDate) = DATE(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 11 DAY)) UNION ALL ' +
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 10 DAY) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE DATE(createdDate) = DATE(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 10 DAY)) UNION ALL ' +
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 9 DAY) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE DATE(createdDate) = DATE(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 9 DAY)) UNION ALL ' +
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 8 DAY) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE DATE(createdDate) = DATE(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 8 DAY)) UNION ALL ' +
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 7 DAY) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE DATE(createdDate) = DATE(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 7 DAY)) UNION ALL ' +
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 6 DAY) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE DATE(createdDate) = DATE(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 6 DAY)) UNION ALL ' +
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 5 DAY) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE DATE(createdDate) = DATE(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 5 DAY)) UNION ALL ' +
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 4 DAY) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE DATE(createdDate) = DATE(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 4 DAY)) UNION ALL ' +
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 3 DAY) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE DATE(createdDate) = DATE(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 3 DAY)) UNION ALL ' +
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 2 DAY) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE DATE(createdDate) = DATE(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 2 DAY)) UNION ALL ' +
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 DAY) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE DATE(createdDate) = DATE(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 DAY)) UNION ALL ' +
            // 'SELECT CURRENT_TIMESTAMP AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE DATE(createdDate) = DATE(CURRENT_TIMESTAMP) ORDER BY time ASC'
          )
        case 3:
          return (
            'SELECT SUM(downtime) AS totalDowntime, MONTH(createdDate) AS time FROM downtime WHERE createdDate >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 YEAR) AND lineId IN (SELECT lineId FROM assemblyLines WHERE userId = :userId) GROUP BY MONTH(createdDate) ORDER BY time ASC'
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 11 MONTH) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE MONTH(createdDate) = MONTH(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 11 MONTH)) UNION ALL ' +
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 10 MONTH) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE MONTH(createdDate) = MONTH(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 10 MONTH)) UNION ALL ' +
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 9 MONTH) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE MONTH(createdDate) = MONTH(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 9 MONTH)) UNION ALL ' +
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 8 MONTH) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE MONTH(createdDate) = MONTH(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 8 MONTH)) UNION ALL ' +
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 7 MONTH) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE MONTH(createdDate) = MONTH(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 7 MONTH)) UNION ALL ' +
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 6 MONTH) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE MONTH(createdDate) = MONTH(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 6 MONTH)) UNION ALL ' +
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 5 MONTH) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE MONTH(createdDate) = MONTH(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 5 MONTH)) UNION ALL ' +
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 4 MONTH) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE MONTH(createdDate) = MONTH(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 4 MONTH)) UNION ALL ' +
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 3 MONTH) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE MONTH(createdDate) = MONTH(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 3 MONTH)) UNION ALL ' +
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 2 MONTH) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE MONTH(createdDate) = MONTH(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 2 MONTH)) UNION ALL ' +
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 MONTH) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE MONTH(createdDate) = MONTH(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 MONTH)) UNION ALL ' +
            // 'SELECT CURRENT_TIMESTAMP AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE MONTH(createdDate) = MONTH(CURRENT_TIMESTAMP) ORDER BY time ASC'
          )
        case 4:
          return (
            'SELECT SUM(downtime) AS totalDowntime, YEAR(createdDate) AS time FROM downtime WHERE createdDate >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 2 YEAR) AND lineId IN (SELECT lineId FROM assemblyLines WHERE userId = :userId) GROUP BY YEAR(createdDate) ORDER BY time ASC'
            // 'SELECT DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 YEAR) AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE YEAR(createdDate) = YEAR(DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 YEAR)) UNION ALL ' +
            // 'SELECT CURRENT_TIMESTAMP AS time, SUM(downtime) AS totalDowntime FROM downtime WHERE YEAR(createdDate) = YEAR(CURRENT_TIMESTAMP) ORDER BY time ASC'
          )
        default:
          return (
            'SELECT SUM(downtime) AS totalDowntime, DATE(createdDate) AS time FROM downtime WHERE createdDate >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 WEEK) AND lineId IN (SELECT lineId FROM assemblyLines WHERE userId = :userId) GROUP BY DATE(createdDate) ORDER BY time ASC'
          )
      }
    }

    return statsRoutes;
};
