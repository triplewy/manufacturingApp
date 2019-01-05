module.exports = function(conn, loggedIn) {
    'use strict';
    var statsRoutes = require('express').Router();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    statsRoutes.get('/totalDowntime/line=:lineId/timePeriod=:timePeriod', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/stats/totalDowntime/line=' + req.params.lineId + '/timePeriod=' + req.params.timePeriod);
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

    statsRoutes.get('/downtime/line=:lineId/timePeriod=:timePeriod', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/stats/downtime/line=' + req.params.lineId + '/timePeriod=' + req.params.timePeriod);
      const userId = req.user
      const timePeriodQuery = parseTimePeriodLine(req.params.timePeriod * 1)
      conn.query(timePeriodQuery, {userId: userId, lineId: req.params.lineId}, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          switch (req.params.timePeriod * 1) {
            case 0: {
              for (var i = 0; i < result.length; i++) {
                var dateLabel = result[i].downtimeHour % 12
                if (i == 0) {
                  dateLabel = '12 AM'
                } else if (i == 12) {
                  dateLabel = '12 PM'
                } else {
                  dateLabel += i < 12 ? ' AM' : ' PM'
                }
                result[i] = {dateLabel: dateLabel, totalDowntime: result[i].totalDowntime, availableMin: 60}
              }
              res.send(result)
              break;
            }
            case 1: {
              var downtime = []
              for (var i = 0; i < result.length; i++) {
                var row = result[i]
                row.time.setTime(row.time.getTime() + (5*60*60*1000))
                if (downtime[row.time]) {
                  downtime[row.time].availableMin += row.availableMin
                  downtime[row.time].totalDowntime += row.totalDowntime
                } else {
                  downtime[row.time] = {totalDowntime: row.totalDowntime, availableMin: row.availableMin, time: row.time}
                }
              }

              var downtimeResult = []
              for (var item in downtime) {
                var dateLabel = new Date(item).toLocaleDateString('en-US', {timeZone: 'UTC', weekday: 'short', month: 'numeric', day: 'numeric'})
                downtimeResult.push({dateLabel: dateLabel, time: downtime[item].time, totalDowntime: downtime[item].totalDowntime, availableMin: downtime[item].availableMin})
              }
              res.send(downtimeResult)
              break;
            }
            case 2: {
              var downtime = []
              for (var i = 0; i < result.length; i++) {
                var row = result[i]
                row.time.setTime(row.time.getTime() + (5*60*60*1000))
                if (downtime[row.time]) {
                  downtime[row.time].availableMin += row.availableMin
                  downtime[row.time].totalDowntime += row.totalDowntime
                } else {
                  downtime[row.time] = {totalDowntime: row.totalDowntime, availableMin: row.availableMin, time: row.time}
                }
              }

              var downtimeResult = []
              for (var item in downtime) {
                var dateLabel = new Date(item).toLocaleDateString('en-US', {timeZone: 'UTC', weekday: 'short', month: 'numeric', day: 'numeric'})
                downtimeResult.push({dateLabel: dateLabel, time: downtime[item].time, totalDowntime: downtime[item].totalDowntime, availableMin: downtime[item].availableMin})
              }
              res.send(downtimeResult)
              break;
            }
            case 3: {
              var monthDowntimes = []
              for (var i = 0; i < result.length; i++) {
                const month = result[i].time * 1
                if (!monthDowntimes[month]) {
                  monthDowntimes[month] = {
                    time: result[i].time,
                    dateLabel: months[month - 1],
                    totalDowntime: result[i].totalDowntime * 1,
                    availableMin: result[i].availableMin * 1
                  }
                } else {
                  monthDowntimes[month].totalDowntime += result[i].totalDowntime * 1
                  monthDowntimes[month].availableMin += result[i].availableMin * 1
                }
              }
              var monthResult = []
              for (var month in monthDowntimes) {
                monthResult.push(monthDowntimes[month])
              }
              res.send(monthResult)
              break;
            }
            case 4: {
              var yearDowntimes = []
              for (var i = 0; i < result.length; i++) {
                const year = result[i].time * 1
                if (!yearDowntimes[year]) {
                  yearDowntimes[year] = {
                    time: result[i].time,
                    dateLabel: result[i].time,
                    totalDowntime: result[i].totalDowntime * 1,
                    availableMin: result[i].availableMin * 1
                  }
                } else {
                  yearDowntimes[year].totalDowntime += result[i].totalDowntime * 1
                  yearDowntimes[year].availableMin += result[i].availableMin * 1
                }
              }
              var yearResult = []
              for (var year in yearDowntimes) {
                yearResult.push(yearDowntimes[year])
              }
              res.send(yearResult)
              break;
            }
            default: {
              res.send(null)
              break;
            }
          }
        }
      })
    })

    statsRoutes.get('/downtime/line=:lineId/timePeriod=:timePeriod/machines', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/stats/downtime/line=' + req.params.lineId + '/timePeriod=' + req.params.timePeriod + '/machines');
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

    statsRoutes.get('/downtime/line=:lineId/timePeriod=:timePeriod/machines/date=:date', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/stats/downtime/line=' + req.params.lineId + '/timePeriod=' + req.params.timePeriod + '/machines/date=' + req.params.date);
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

    statsRoutes.get('/downtime/line=:lineId/timePeriod=:timePeriod/shifts/date=:date', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/stats/downtime/line=' + req.params.lineId + '/timePeriod=' + req.params.timePeriod + '/shifts/date=' + req.params.date);
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

    statsRoutes.get('/downtime/line=:lineId/timePeriod=:timePeriod/workers', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/stats/downtime/line=' + req.params.lineId + '/timePeriod=' + req.params.timePeriod + '/workers');
      const userId = req.user
      const timePeriodQuery = parseTotalTimePeriod(req.params.timePeriod * 1)
      conn.query(
      'SELECT SUM(b.downtime) AS totalDowntime, b.lineLeaderName AS name, HOUR(b.createdDate) >= a.morningShift AND HOUR(b.createdDate) < a.eveningShift AS isDayShift ' +
      'FROM downtime AS b JOIN assemblyLines AS a ON a.lineId = b.lineId WHERE b.createdDate <= CURRENT_TIMESTAMP' + timePeriodQuery +
      'AND b.lineId = :lineId GROUP BY b.lineLeaderName, isDayShift, DATE(b.createdDate)', {userId: userId, lineId: req.params.lineId}, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.send(parseWorkers(result))
        }
      })
    })

    statsRoutes.get('/downtime/line=:lineId/timePeriod=:timePeriod/workers/date=:date', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/stats/downtime/line=' + req.params.lineId + '/timePeriod=' + req.params.timePeriod + '/workers/date=' + req.params.date);
      const userId = req.user
      const timePeriodQuery = parseTimePeriodDate(req.params.timePeriod * 1)
      conn.query(
      'SELECT SUM(b.downtime) AS totalDowntime, b.lineLeaderName AS name, HOUR(b.createdDate) >= a.morningShift AND HOUR(b.createdDate) < a.eveningShift AS isDayShift ' +
      'FROM downtime AS b JOIN assemblyLines AS a ON a.lineId = b.lineId WHERE b.lineId = :lineId' + timePeriodQuery +
      'GROUP BY b.lineLeaderName, isDayShift', {userId: userId, date: req.params.date, lineId: req.params.lineId}, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.send(parseWorkers(result))
        }
      })
    })

    function parseWorkers(result) {
      var workers = {}
      for (var i = 0; i < result.length; i++) {
        if (workers[result[i].name]) {
          workers[result[i].name].totalDowntime += result[i].totalDowntime
          workers[result[i].name].availableMin += 565
        } else {
          workers[result[i].name] = { totalDowntime: result[i].totalDowntime, availableMin: 565 }
        }
      }

      var resultWorkers = []
      for (var name in workers) {
        resultWorkers.push({ name: name, totalDowntime: workers[name].totalDowntime, availableMin: workers[name].availableMin })
      }

      resultWorkers.sort(function (a, b) {
        if (a.totalDowntime / a.availableMin < b.totalDowntime / b.availableMin) {
          return 1;
        }
        if (a.totalDowntime / a.availableMin > b.totalDowntime / b.availableMin) {
          return -1;
        }
        return 0;
      })

      return resultWorkers
    }

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
          return ' AND DATE(DATE_SUB(b.createdDate, INTERVAL 5 HOUR)) = DATE(:date) '
        case 2:
          return ' AND DATE(DATE_SUB(b.createdDate, INTERVAL 5 HOUR)) = DATE(:date) '
        case 3:
          return ' AND b.createdDate >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 YEAR) AND MONTH(b.createdDate) = :date '
        case 4:
          return ' AND YEAR(b.createdDate) = :date '
        default:
          return ' AND DATE(b.createdDate) = DATE(:date) '
      }
    }

    function parseTimePeriodLine(timePeriod) {
      switch (timePeriod) {
        case 0:
          return 'SELECT SUM(a.downtime) AS totalDowntime, b.availableMin, HOUR(a.createdDate) AS downtimeHour FROM downtime AS a JOIN assemblyLines AS b ON b.lineId = a.lineId WHERE a.createdDate >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 DAY) AND a.lineId = :lineId GROUP BY HOUR(a.createdDate) ORDER BY downtimeHour ASC'
        case 1:
          return 'SELECT SUM(a.downtime) AS totalDowntime, b.availableMin, DATE(DATE_SUB(a.createdDate, INTERVAL 5 HOUR)) AS time, HOUR(a.createdDate) >= b.morningShift AND HOUR(a.createdDate) < b.eveningShift AS isDayShift FROM downtime AS a JOIN assemblyLines AS b ON b.lineId = a.lineId WHERE a.createdDate >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 WEEK) AND a.lineId = :lineId GROUP BY time, isDayShift ORDER BY time ASC'
        case 2:
          return 'SELECT SUM(a.downtime) AS totalDowntime, b.availableMin, DATE(DATE_SUB(a.createdDate, INTERVAL 5 HOUR)) AS time, HOUR(a.createdDate) >= b.morningShift AND HOUR(a.createdDate) < b.eveningShift AS isDayShift FROM downtime AS a JOIN assemblyLines AS b ON b.lineId = a.lineId WHERE a.createdDate >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 30 DAY) AND a.lineId = :lineId GROUP BY time, isDayShift ORDER BY time ASC'
        case 3:
          return 'SELECT SUM(a.downtime) AS totalDowntime, MONTH(a.createdDate) AS time, DAY(a.createdDate) AS downtimeDay, b.availableMin, HOUR(a.createdDate) >= b.morningShift AND HOUR(a.createdDate) < b.eveningShift AS isDayShift FROM downtime AS a JOIN assemblyLines AS b ON b.lineId = a.lineId WHERE a.createdDate >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 YEAR) AND a.lineId = :lineId GROUP BY MONTH(a.createdDate), DAY(a.createdDate), isDayShift ORDER BY time ASC'
        case 4:
          return 'SELECT SUM(a.downtime) AS totalDowntime, YEAR(a.createdDate) AS time, MONTH(a.createdDate) AS downtimeMonth, DAY(a.createdDate) AS downtimeDay, b.availableMin, HOUR(a.createdDate) >= b.morningShift AND HOUR(a.createdDate) < b.eveningShift AS isDayShift FROM downtime AS a JOIN assemblyLines AS b ON b.lineId = a.lineId WHERE a.createdDate >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 2 YEAR) AND a.lineId = :lineId GROUP BY YEAR(a.createdDate), MONTH(a.createdDate), DAY(a.createdDate), isDayShift ORDER BY time ASC'
        default:
          return 'SELECT SUM(a.downtime) AS totalDowntime, b.availableMin, DATE(a.createdDate) AS time, HOUR(a.createdDate) >= b.morningShift AND HOUR(a.createdDate) < b.eveningShift AS isDayShift FROM downtime AS a JOIN assemblyLines AS b ON b.lineId = a.lineId WHERE a.createdDate >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 WEEK) AND a.lineId = :lineId GROUP BY time, isDayShift ORDER BY time ASC'
      }
    }

    return statsRoutes;
};
