module.exports = function(conn, loggedIn) {
    'use strict';
    var homeRoutes = require('express').Router();

    homeRoutes.get('/recap/yesterday', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/home/recap/yesterday');
      const userId = req.user
      Promise.all([getLines(userId, true), getMachines(userId, true), getReports(userId, true)])
      .then(allData => {
        res.send({ lines: allData[0], machines: allData[1], reports: allData[2] })
      })
      .catch(err => {
        console.log(err);
      })
    })

    homeRoutes.get('/recap/week', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/home/recap/week');
      const userId = req.user
      Promise.all([getLines(userId, false), getMachines(userId, false), getReports(userId, false)])
      .then(allData => {
        res.send({ lines: allData[0], machines: allData[1], reports: allData[2] })
      })
      .catch(err => {
        console.log(err);
      })
    })

    function getLines(userId, isYesterday) {
      return new Promise(function(resolve, reject) {
        const dateQuery = isYesterday ? 'DATE(a.createdDate) = DATE(DATE_SUB(NOW(), INTERVAL 1 DAY))' : 'DATE(a.createdDate) >= DATE(DATE_SUB(NOW(), INTERVAL 2 WEEK))'
        conn.query('SELECT b.lineId, b.name AS name, SUM(a.downtime) AS totalDowntime, DATE(a.createdDate) AS date, HOUR(a.createdDate) < b.eveningShift AND HOUR(a.createdDate) >= b.morningShift AS isDayShift ' +
        'FROM downtime AS a JOIN assemblyLines AS b ON b.lineId = a.lineId WHERE a.lineId IN (SELECT lineId FROM assemblyLineUsers ' +
        'WHERE userId = :userId) AND ' + dateQuery + ' GROUP BY b.lineId, isDayShift, DATE(a.createdDate)',
        {userId: userId}, function(err, result) {
          if (err) {
            return reject(err)
          } else {
            var lines = {}
            for (var i = 0; i < result.length; i++) {
              if (lines[result[i].lineId]) {
                lines[result[i].lineId].totalDowntime += result[i].totalDowntime
                lines[result[i].lineId].availableMin += 565
              } else {
                lines[result[i].lineId] = {name: result[i].name, totalDowntime: result[i].totalDowntime, availableMin: 565}
              }
            }

            var resultLines = []

            for (var i in lines) {
              resultLines.push({ name: lines[i].name, percentage: lines[i].totalDowntime / lines[i].availableMin * 100, totalDowntime: lines[i].totalDowntime })
            }

            resultLines.sort(function(a, b){
              var keyA = a.percentage,
                  keyB = b.percentage

              if(keyA < keyB) return 1;
              if(keyA > keyB) return -1;
              return 0;
            })

            return resolve(resultLines)
          }
        })
      })
    }

    function getMachines(userId, isYesterday) {
      return new Promise(function(resolve, reject) {
        const dateQuery = isYesterday ? 'DATE(a.createdDate) = DATE(DATE_SUB(NOW(), INTERVAL 1 DAY))' : 'DATE(a.createdDate) >= DATE(DATE_SUB(NOW(), INTERVAL 2 WEEK))'
        conn.query('SELECT b.machineId, b.name AS name, c.name AS line, SUM(a.downtime) AS totalDowntime, DATE(a.createdDate) AS date, HOUR(a.createdDate) < c.eveningShift AND HOUR(a.createdDate) >= c.morningShift AS isDayShift ' +
        'FROM downtime AS a JOIN machines AS b ON b.machineId = a.machineId JOIN assemblyLines AS c ON c.lineId = b.lineId ' +
        'WHERE a.lineId IN (SELECT lineId FROM assemblyLineUsers WHERE userId = :userId) AND ' + dateQuery + ' GROUP BY b.machineId, isDayShift, DATE(a.createdDate) ORDER BY totalDowntime DESC',
        {userId: userId}, function(err, result) {
          if (err) {
            return reject(err);
          } else {
            var machines = {}
            for (var i = 0; i < result.length; i++) {
              if (machines[result[i].machineId]) {
                machines[result[i].machineId].totalDowntime += result[i].totalDowntime
                machines[result[i].machineId].availableMin += 565
              } else {
                machines[result[i].machineId] = {name: result[i].name, line: result[i].line, totalDowntime: result[i].totalDowntime, availableMin: 565}
              }
            }

            var resultMachines = []

            for (var i in machines) {
              resultMachines.push({ name: machines[i].name, line: machines[i].line, percentage: machines[i].totalDowntime / machines[i].availableMin * 100, totalDowntime: machines[i].totalDowntime })
            }

            resultMachines.sort(function(a, b){
              var keyA = a.percentage,
                  keyB = b.percentage

              if(keyA < keyB) return 1;
              if(keyA > keyB) return -1;
              return 0;
            })

            return resolve(resultMachines)
          }
        })
      })
    }

    function getReports(userId, isYesterday) {
      return new Promise(function(resolve, reject) {
        const dateQuery = isYesterday ? 'DATE(a.createdDate) = DATE(DATE_SUB(NOW(), INTERVAL 1 DAY))' : 'DATE(a.createdDate) >= DATE(DATE_SUB(NOW(), INTERVAL 2 WEEK))'
        conn.query('SELECT a.*, a.createdDate AS reportedDate, b.name AS machineName, b.icon_url, c.name AS name FROM downtime AS a ' +
        'JOIN machines AS b ON b.machineId = a.machineId JOIN assemblyLines AS c ON c.lineId = a.lineId ' +
        'WHERE a.lineId IN (SELECT lineId FROM assemblyLineUsers WHERE userId = :userId) AND ' +
        dateQuery + ' ORDER BY a.downtime DESC LIMIT 10',
        {userId: userId}, function(err, result) {
          if (err) {
            return reject(err);
          } else {
            return resolve(result)
          }
        })
      })
    }




    return homeRoutes;

};
