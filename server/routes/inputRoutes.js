module.exports = function(conn, loggedIn, upload, client) {
    'use strict';
    var inputRoutes = require('express').Router();
    var sms = require('../sms.js')
    var APN = require('../apn')
    var expireFunctions = {}

    inputRoutes.post('/', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/input');
      const userId = req.user
      const expireDate = Date.now() + 1000*60*20
      client.HMSET(userId, {
        activeLine: req.body.lineId,
        expire: expireDate
      }, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          if (result == 'OK') {
            expireFunctions[userId] = setTimeout(function() {
              notifyMechanic(req.body.lineId, userId)
            }, expireDate - Date.now())
            res.send({ expireDate: expireDate })
          } else {
            res.send({ message: 'failed' })
          }
        }
      })
    })

    inputRoutes.post('/submit', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/input/submit');
      upload(req, res, function(err) {
        if (err) {
          console.log(err);
          res.send({message: err.message})
        } else {
          uploadDowntimeMetadata(req).then(function() {
            console.log("Records added successfully");
            clearTimeout(expireFunctions[req.user])
            client.HDEL(req.user, 'expire', 'activeLine')
            res.send({message: 'success'})
          })
          .catch(e => {
            console.log(e);
            res.send({message: 'fail'})
          })
        }
      })
    })

    function uploadDowntimeMetadata(req) {
      return new Promise(function(resolve, reject) {
        var insertQuery = [req.body.machineId, req.body.lineLeaderName, req.body.downtime, req.body.description];
        conn.query('INSERT INTO downtime (machineId, lineLeaderName, downtime, description) VALUES (?, ?, ?, ?)', insertQuery, function(err, result) {
          if (err) {
            console.log("upload error");
            return reject(err);
          } else {
            Promise.all([insertDowntimeImages(result.insertId, req)])
            .then(function() {
              return resolve({message: 'success'})
            }).catch(e => {
              return reject(e);
            })
          }
        })
      });
    }

    function insertDowntimeImages(downtimeId, req) {
      return new Promise(function(resolve, reject) {
        const files = req.files
        if (files.length > 0) {
          var question_query = ''
          var insertQuery = [];
          for (var i = 0; i < files.length; i++) {
            const file = files[i]
            insertQuery.push(downtimeId, file.location);
            question_query += '(?, ?),';
          }
          question_query = question_query.slice(0, -1);
          conn.query('INSERT INTO downtimeImages (downtimeId, imageUrl) VALUES ' + question_query, insertQuery, function(err, result) {
            if (err) {
              return reject(err);
            } else {
              return resolve({message: 'success'})
            }
          })
        } else {
          return resolve({message: 'success'})
        }

      })
    }

    function notifyMechanic(lineId, userId) {
      const hour = new Date().getHours()
      getAvailableMechanics(lineId, hour).then(mechanics => {
        APN.sendNotification(userId, `Mechanic notified for LINE ${mechanics[0].line}`).then(data => {
          sms.sendSMS(mechanics[0].phone, `${mechanics[0].company.toUpperCase()}: LINE ${mechanics[0].line} has been down for 20 minutes`).then(smsData => {
            console.log(smsData);
          }).catch(err => {
            console.log(err);
          })
        }).catch(err => {
          console.log(err);
        })
      })
      .catch(err => {
        console.log(err);
      })
    }

    function getAvailableMechanics(lineId, hour) {
      return new Promise(function(resolve, reject) {
        conn.query('SELECT b.*, c.name AS line, d.name AS company FROM assemblyLineMechanics AS a ' +
        'JOIN mechanics AS b ON b.mechanicId = a.mechanicId AND ' +
        '((:hour >= b.startHour AND :hour < b.endHour) OR (b.endHour < b.startHour AND (:hour < b.endHour XOR :hour > b.startHour))) ' +
        'JOIN assemblyLines AS c ON c.lineId = a.lineId ' +
        'JOIN companies AS d ON d.companyId = b.companyId WHERE a.lineId = :lineId',
        { lineId: lineId, hour: hour }, function(err, result) {
          if (err) {
            return reject(err)
          } else {
            return resolve(result)
          }
        })
      })
    }

    return inputRoutes;

};
