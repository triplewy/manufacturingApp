module.exports = function(conn, loggedIn, upload, client) {
    'use strict';
    var inputRoutes = require('express').Router();
    var sms = require('../sms')
    var ses = require('../ses')
    var APN = require('../apn')
    var expireFunctions = {}

    inputRoutes.post('/', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/input');
      const userId = req.user
      const expireDate = Date.now() + 1000*60*20
      client.HMSET(userId, {
        activeLine: req.body.lineId,
        activeMachine: req.body.machineId,
        expire: expireDate
      }, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          if (result == 'OK') {
            expireFunctions[userId] = setTimeout(function() {
              notifyMechanic(userId)
            }, expireDate - Date.now())
            res.send({ expireDate: expireDate })
          } else {
            res.send({ message: 'failed' })
          }
        }
      })
    })

    inputRoutes.post('/notify', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/input/notify');
      const userId = req.user
      client.HMSET(userId, {
        expire: Date.now()
      }, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          if (result == 'OK') {
            client.HGETALL(userId, function(err, result) {
              clearTimeout(expireFunctions[userId])
              notifyMechanic(userId)
              res.send({ expireDate: result.expire })
            })
          } else {
            res.send({ message: 'failed' })
          }
        }
      })
    })

    inputRoutes.post('/delete', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/input/delete');
      const userId = req.user
      client.HDEL(req.user, 'expire', 'activeLine', 'activeMachine', function(err, result) {
        if (err) {
          console.log(err);
        } else {
          if (result) {
            console.log('Expire function deleted');
            clearTimeout(expireFunctions[userId])
            res.send({ message: 'success' })
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
            client.HDEL(req.user, 'expire', 'activeLine', 'activeMachine')
            console.log('Expire function deleted');
            res.send({message: 'success'})
          })
          .catch(e => {
            console.log(e);
            res.send({message: 'fail'})
          })
        }
      })
    })

    inputRoutes.post('/submit/workorder', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/input/submit/workorder');
      upload(req, res, function(err) {
        if (err) {
          console.log(req);
          console.log(err);
          res.send({message: err.message})
        } else {
          uploadWorkOrder(req).then(data => {
            if (data.message == 'success') {
              console.log("Records added successfully");
              res.send({message: 'success'})
            }
          }).catch(err => {
            console.log(err);
            res.send({message: 'fail'})
          })
        }
      })
    })

    function uploadDowntimeMetadata(req) {
      return new Promise(function(resolve, reject) {
        var insertQuery = req.body.availableMin ? [req.body.machineId, req.body.lineLeaderName, req.body.downtime, req.body.description, req.body.availableMin] : [req.body.machineId, req.body.lineLeaderName, req.body.downtime, req.body.description]
        var fields = req.body.availableMin ? '(machineId, lineLeaderName, downtime, description, availableMin)' : '(machineId, lineLeaderName, downtime, description)'
        conn.query('INSERT INTO downtime ' + fields + ' VALUES ?', [[insertQuery]], function(err, result) {
          if (err) {
            console.log("upload error");
            return reject(err);
          } else {
            insertDowntimeImages(result.insertId, req)
            .then(() => {
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

    function uploadWorkOrder(req) {
      return new Promise(function(resolve, reject) {
        const body = req.body
        conn.query('START TRANSACTION', [], function(err, result) {
          if (err) {
            conn.query('ROLLBACK')
            return reject(err)
          } else {
            conn.query('INSERT INTO workOrders (lineId, machineId, stars, description) VALUES (?,?,?,?)', [body.lineId, body.machineId, body.rating, body.description], function(err, result) {
              if (err) {
                conn.query('ROLLBACK')
                return reject(err)
              } else {
                if (req.files.length) {
                  const workOrderImages = req.files.map(item => [result.insertId, item.location])
                  conn.query('INSERT INTO workOrderImages (workOrderId, imageUrl) VALUES ?', [workOrderImages], function(err, result) {
                    if (err) {
                      conn.query('ROLLBACK')
                      return reject(err)
                    } else {
                      conn.query('COMMIT', [], function(err, result) {
                        if (err) {
                          conn.query('ROLLBACK')
                          return reject(err)
                        } else {
                          ses.sendEmail('admin@streamlineanalytica.com', body, req.files.map(item => item.key))
                          return resolve({ message: 'success' })
                        }
                      })
                    }
                  })
                } else {
                  conn.query('COMMIT', [], function(err, result) {
                    if (err) {
                      conn.query('ROLLBACK')
                      return reject(err)
                    } else {
                      return resolve({ message: 'success' })
                    }
                  })
                }
              }
            })
          }
        })

      })
    }

    function notifyMechanic(userId) {
      const hour = new Date().getHours()
      client.HGETALL(userId, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
          if (result.expire <= Date.now()) {
            getAvailableMechanics(result.activeLine, result.activeMachine, hour).then(mechanics => {
              APN.sendNotification(userId, `Mechanic notified for ${mechanics[0].machine} on LINE ${mechanics[0].line}`).then(data => {
                console.log(data);
              }).catch(err => {
                console.log(err);
              })
              var promises = mechanics.map(mechanic => {
                sms.sendSMS(mechanic.phone, `${mechanic.company.toUpperCase()}: ${mechanic.machine} on LINE ${mechanic.line} has been down 20 minutes`)
              })
              Promise.all(promises).then(allData => {

              }).catch(err => {
                console.log(err);
              })
            }).catch(err => {
              console.log(err);
            })
          }
        }
      })
    }

    function getAvailableMechanics(lineId, machineId, hour) {
      return new Promise(function(resolve, reject) {
        conn.query('SELECT b.*, c.name AS line, d.name AS company, (SELECT name FROM machines WHERE machineId = :machineId LIMIT 1) AS machine ' +
        'FROM assemblyLineMechanics AS a ' +
        'JOIN mechanics AS b ON b.mechanicId = a.mechanicId AND ' +
        '((:hour >= b.startHour AND :hour < b.endHour) OR (b.endHour < b.startHour AND (:hour < b.endHour XOR :hour > b.startHour))) ' +
        'JOIN assemblyLines AS c ON c.lineId = a.lineId ' +
        'JOIN companies AS d ON d.companyId = b.companyId WHERE a.lineId = :lineId',
        { lineId: lineId, machineId: machineId, hour: hour }, function(err, result) {
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
