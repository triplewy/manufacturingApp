module.exports = function(conn, loggedIn) {
    'use strict';
    var reportsRoutes = require('express').Router();

    reportsRoutes.get('/line=:lineId/page=:page', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/reports/line=' + req.params.lineId + '/page=' + req.params.page);
      const userId = req.user
      const page = req.params.page * 10
      conn.query('SELECT a.*, a.createdDate AS reportedDate, b.*, b.name AS machineName, c.*, d.imageUrl ' +
      'FROM downtime AS a ' +
      'JOIN machines AS b ON b.machineId = a.machineId ' +
      'JOIN assemblyLines AS c ON c.lineId = b.lineId ' +
      'LEFT JOIN downtimeImages AS d ON d.downtimeId = a.downtimeId ' +
      'WHERE a.lineId = :lineId ORDER BY reportedDate DESC LIMIT ' + page + ',10',
      {userId: userId, lineId: req.params.lineId}, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.send(parseReports(result))
        }
      })
    })

    reportsRoutes.get('/line=:lineId/date=:date/page=:page', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/reports/line=' + req.params.lineId + '/date=' + req.params.date + '/page=' + req.params.page);
      const userId = req.user
      const page = req.params.page * 10
      conn.query('SELECT a.*, a.createdDate AS reportedDate, b.*, b.name AS machineName, c.*, d.imageUrl ' +
      'FROM downtime AS a ' +
      'JOIN machines AS b ON b.machineId = a.machineId ' +
      'JOIN assemblyLines AS c ON c.lineId = b.lineId ' +
      'LEFT JOIN downtimeImages AS d ON d.downtimeId = a.downtimeId ' +
      'WHERE a.lineId = :lineId AND DATE(DATE_SUB(a.createdDate, INTERVAL 5 HOUR)) = DATE(:date) ORDER BY reportedDate DESC LIMIT ' + page + ',10',
      {userId: userId, lineId: req.params.lineId, date: req.params.date}, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.send(parseReports(result))
        }
      })
    })

    reportsRoutes.get('/machine=:machineId/page=:page', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/reports/machine=' + req.params.machineId + '/page=' + req.params.page);
      const userId = req.user
      const page = req.params.page * 10
      conn.query('SELECT a.*, a.createdDate AS reportedDate, b.*, b.name AS machineName, c.*, d.imageUrl ' +
      'FROM downtime AS a ' +
      'JOIN machines AS b ON b.machineId = a.machineId ' +
      'JOIN assemblyLines AS c ON c.lineId = b.lineId ' +
      'LEFT JOIN downtimeImages AS d ON d.downtimeId = a.downtimeId ' +
      'WHERE a.machineId = :machineId ORDER BY reportedDate DESC LIMIT ' + page + ',10',
      {userId: userId, lineId: req.params.lineId, machineId: req.params.machineId}, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.send(parseReports(result))
        }
      })
    })

    reportsRoutes.get('/machine=:machineId/date=:date/page=:page', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/reports/machine=' + req.params.machineId + '/date=' + req.params.date + '/page=' + req.params.page);
      const userId = req.user
      const page = req.params.page * 10
      conn.query('SELECT a.*, a.createdDate AS reportedDate, b.*, b.name AS machineName, c.*, d.imageUrl ' +
      'FROM downtime AS a ' +
      'JOIN machines AS b ON b.machineId = a.machineId ' +
      'JOIN assemblyLines AS c ON c.lineId = b.lineId ' +
      'LEFT JOIN downtimeImages AS d ON d.downtimeId = a.downtimeId ' +
      'WHERE a.machineId = :machineId AND DATE(DATE_SUB(a.createdDate, INTERVAL 5 HOUR)) = DATE(:date) ORDER BY reportedDate DESC LIMIT ' + page + ',10',
      {userId: userId, lineId: req.params.lineId, machineId: req.params.machineId, date: req.params.date}, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.send(parseReports(result))
        }
      })
    })

    function parseReports(result) {
      var reports = []
      var index = -1
      for (var i = 0; i < result.length; i++) {
        if (i > 0 && result[i - 1].downtimeId == result[i].downtimeId) {
          reports[index].images.push({ url: result[i].imageUrl })
        } else {
          index += 1
          reports[index] = result[i]
          reports[index].images = []
          if (result[i].imageUrl) {
            reports[index].images.push({ url: result[i].imageUrl })
          }
        }
      }

      return reports
    }

    return reportsRoutes;

};
