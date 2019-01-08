module.exports = function(conn, loggedIn, csvUpload, client) {
    'use strict';

    var adminRoutes = require('express').Router();
    var parse = require('csv-parse')
    var APN = require('../apn')

    adminRoutes.get('/companies', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/admin/companies');
      const userId = req.user
      conn.query('SELECT * FROM companies', [], function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.send(result)
        }
      })
    })

    adminRoutes.get('/unregisteredUsers', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/admin/companies');
      const userId = req.user
      conn.query('SELECT a.*, b.username AS name FROM users AS a JOIN logins AS b ON b.userId = a.userId WHERE a.companyId IS NULL', [], function(err, result) {
        if (err) {
          console.log(err);
        } else {
          for (var i = 0; i < result.length; i++) {
            if (result[i].userId == 1) {
              result.splice(i,1)
            }
          }
          res.send(result)
        }
      })
    })

    adminRoutes.get('/user=:userId', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/admin/user=' + req.params.userId);
      const userId = req.user
      conn.query('SELECT a.*, b.lineId FROM users AS a JOIN assemblyLineUsers AS b ON b.userId = a.userId WHERE a.userId = :userId', {userId: req.params.userId}, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.send(result)
        }
      })
    })

    adminRoutes.get('/company/:companyId/users', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/admin/companies/' + req.params.companyId + '/users');
      const userId = req.user
      conn.query('SELECT a.*, a.userId AS id, b.username AS name FROM users AS a JOIN logins AS b ON b.userId = a.userId WHERE a.companyId = :companyId', {companyId: req.params.companyId}, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          for (var i = 0; i < result.length; i++) {
            if (result[i].id == 1) {
              result.splice(i,1)
            }
          }
          res.send(result)
        }
      })
    })

    adminRoutes.get('/company/:companyId/lines', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/admin/companies/' + req.params.companyId + '/lines');
      const userId = req.user
      conn.query('SELECT *, lineId AS id FROM assemblyLines WHERE companyId = :companyId', {companyId: req.params.companyId}, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.send(result)
        }
      })
    })

    adminRoutes.get('/company/:companyId/machines', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/admin/companies/' + req.params.companyId + '/machines');
      const userId = req.user
      conn.query('SELECT *, machineId AS id FROM machines WHERE lineId IN (SELECT lineId FROM assemblyLines WHERE companyId = :companyId)', {companyId: req.params.companyId}, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.send(result)
        }
      })
    })

    adminRoutes.post('/registerUser', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/admin/registerUser');
      const userId = req.user
      conn.query('START TRANSACTION', [], function(err, result) {
        if (err) {
          conn.query('ROLLBACK')
        } else {
          conn.query('UPDATE users SET companyId = :companyId, isAdmin = :isAdmin WHERE userId = :userId',
          {companyId: req.body.companyId, isAdmin: req.body.isAdmin, userId: req.body.userId}, function(err, result) {
            if (err) {
              conn.query('ROLLBACK')
            } else {
              var assemblyLineUsers = []
              for (var i = 0; i < req.body.lineIds.length; i++) {
                assemblyLineUsers.push([req.body.userId, req.body.lineIds[i]])
              }
              conn.query('INSERT INTO assemblyLineUsers (userId, lineId) VALUES ?', [assemblyLineUsers], function(err, result) {
                if (err) {
                  conn.query('ROLLBACK')
                } else {
                  conn.query('COMMIT', [], function(err, result) {
                    if (err) {
                      conn.query('ROLLBACK')
                    } else {
                      console.log("Registered user successfully");
                      res.send({message: 'success'})
                    }
                  })
                }
              })
            }
          })
        }
      })
    })

    adminRoutes.post('/notification', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/admin/notification');
      const userId = req.user
      conn.query('START TRANSACTION', [], function(err, result) {
        if (err) {
          console.log(err);
          conn.query('ROLLBACK')
        } else {
          conn.query('INSERT INTO notifications (companyId, isGlobal, message) VALUES (?,?,?)', [req.body.companyId, true, req.body.message], function(err, result) {
            if (err) {
              console.log(err);
              conn.query('ROLLBACK')
            } else {
              conn.query('SELECT userId, deviceToken FROM users WHERE companyId = :companyId AND deviceToken IS NOT NULL', { companyId: req.body.companyId }, function(err, result) {
                if (err) {
                  console.log(err);
                  conn.query('ROLLBACK')
                } else {
                  var devices = []
                  var deviceTokens = []
                  var userIds = []

                  var multi = client.multi()

                  result.forEach(function(row) {
                    multi.HGETALL(row.userId, function(err, obj) {
                      if (err) {
                        console.log(err);
                      } else {
                        if (obj) {
                          devices.push({token: row.deviceToken, badge: parseInt(obj.badge, 10) + 1})
                          client.HMSET(row.userId, {
                            badge: (parseInt(obj.badge, 10) + 1).toString()
                          })
                        } else {
                          devices.push({token: row.deviceToken, badge: 1})
                          client.HMSET(row.userId, {
                            badge: '1'
                          })
                        }
                      }
                    })
                  })

                  conn.query('COMMIT', [], function(err, result) {
                    if (err) {
                      console.log(err);
                      conn.query('ROLLBACK')
                    } else {
                      multi.exec(function(err, result) {
                        if (err) {
                          console.log(err);
                        } else {
                          console.log(result);
                          APN.sendNotifications(devices, req.body.message).then(data => {
                            console.log(data);
                            if (data.failed == 0) {
                              res.send({ message: 'All succeeded'})
                            } else {
                              res.send({ message: data.failed + ' failed'})
                            }
                          })
                        }
                      })
                    }
                  })
                }
              })
            }
          })
        }
      })
    })

    adminRoutes.post('/editUser', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/admin/editUser');
      const userId = req.user
      var assemblyLineUsers = []
      for (var i = 0; i < req.body.lineIds.length; i++) {
        assemblyLineUsers.push([req.body.userId, req.body.lineIds[i]])
      }
      conn.query('UPDATE users SET isAdmin = :isAdmin WHERE userId = :userId', { isAdmin: req.body.isAdmin, userId: req.body.userId }, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          conn.query('INSERT IGNORE INTO assemblyLineUsers (userId, lineId) VALUES ?', [assemblyLineUsers], function(err, result) {
            if (err) {
              console.log(err);
            } else {
              console.log("Edited user successfully");
              res.send({message: 'success'})
            }
          })
        }
      })
    })

    adminRoutes.delete('/deleteUser', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/admin/editUser');
      const userId = req.user
      conn.query('DELETE FROM users WHERE userId = :userId', {userId: req.body.userId}, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log("Deleted user successfully");
          res.send({message: 'success'})
        }
      })
    })

    adminRoutes.post('/company/new', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/admin/company/new');
      const userId = req.user
      conn.query('INSERT INTO companies (name) VALUES (?)', [req.body.name], function(err, result) {
        if (err) {
          console.log(err);
        } else {
          if (result.affectedRows) {
            console.log('Records added successfully');
            res.send({message: 'success'})
          } else {
            console.log('Records added faded');
            res.send({message: 'fail'})
          }
        }
      })
    })

    adminRoutes.post('/company/:companyId/lines/new', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/admin/company/' + req.params.companyId + '/lines/new');
      const userId = req.user
      const companyId = req.params.companyId
      conn.query('INSERT INTO assemblyLines (companyId, name, availableMin, morningShift, eveningShift) VALUES (?,?,?,?,?)', [companyId, req.body.name, req.body.availableMin, req.body.morningShift, req.body.eveningShift], function(err, result) {
        if (err) {
          console.log(err);
        } else {
          if (result.affectedRows) {
            console.log('Records added successfully');
            res.send({message: 'success'})
          } else {
            console.log('Records added faded');
            res.send({message: 'fail'})
          }
        }
      })
    })

    adminRoutes.post('/company/:companyId/machines/new', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/admin/company/' + req.params.companyId + '/machines/new');
      const userId = req.user
      const companyId = req.params.companyId
      conn.query('INSERT INTO machines (lineId, name, icon_url) VALUES (?,?,?)', [userId, req.body.name, 'https://s3.us-east-2.amazonaws.com/manufacturing-app-icons/example-icon.png'], function(err, result) {
        if (err) {
          console.log(err);
        } else {
          if (result.affectedRows) {
            res.send({message: 'success'})
          } else {
            res.send({message: 'fail'})
          }
        }
      })
    })

    adminRoutes.post('/company/:companyId/upload/csv', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/admin/company/' + req.params.companyId + '/upload/csv');
      const userId = req.user
      const companyId = req.params.companyId
      const parser = parse({delimiter: ','})
      csvUpload(req, res, function(err) {
        if (err) {
          console.log(err);
          res.send({message: err.message})
        } else {

          var output = []
          var lineMachines = []
          var machines = []

          parser.on('readable', function() {
            let record
            while (record = parser.read()) {
              // date, line, lineLeaderName, downtime, description, machineId
              var downtimeEntry = [parseDate(record[0], record[1]), record[2].substring(2), record[5], record[7], record[9], record[6]]

              var line = record[2].substring(2)

              if (lineMachines[line]) {
                if (!lineMachines[line].includes(record[6])) {
                  lineMachines[line].push(record[6])
                }
              } else {
                var temp = []
                temp.push(record[6])
                lineMachines[line] = temp
              }

              output.push(downtimeEntry)
            }
          })

          parser.on('error', function(err){
            console.error(err.message)
          })

          parser.on('end', function(){
            conn.query('SELECT * FROM assemblyLines WHERE companyId = :companyId', {companyId: companyId}, function(err, result) {
              if (err) {
                console.log(err);
              } else {
                var lines = []
                for (var i = 0; i < result.length; i++) {
                  lines[result[i].name] = result[i].lineId
                }

                var machineInsertArr = []

                for (var line in lineMachines) {
                  for (var i = 0; i < lineMachines[line].length; i++) {
                    machineInsertArr.push([lines[line], lineMachines[line][i], 'https://s3.us-east-2.amazonaws.com/manufacturing-app-icons/example-icon.png'])
                  }
                }

                conn.query('INSERT IGNORE INTO machines (lineId, name, icon_url) VALUES ?', [machineInsertArr], function(err, result) {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log('Machine records added successfully');
                    conn.query('SELECT b.*, a.name AS lineName FROM assemblyLines AS a JOIN machines AS b ON b.lineId = a.lineId WHERE a.companyId  = :companyId', {companyId: companyId}, function(err, result) {
                      if (err) {
                        console.log(err);
                      } else {
                        lineMachines = []
                        for (var i = 0; i < result.length; i++) {
                          var lineName = result[i].lineName
                          if (lineMachines[lineName]) {
                            lineMachines[lineName][result[i].name] = result[i].machineId
                          } else {
                            lineMachines[lineName] = []
                            lineMachines[lineName][result[i].name] = result[i].machineId
                          }
                        }

                        var insertDowntime = []

                        for (var i = 0; i < output.length; i++) {
                          insertDowntime.push([output[i][0], output[i][2], output[i][3], output[i][4], output[i][5]])
                          insertDowntime[i][4] = lineMachines[output[i][1]][output[i][5]]
                        }

                        conn.query('INSERT INTO downtime (createdDate, lineLeaderName, downtime, description, machineId) VALUES ?', [insertDowntime], function(err, result) {
                          if (err) {
                            console.log(err);
                          } else {
                            if (result.affectedRows) {
                              console.log('Downtime records added successfully');
                            }
                          }
                        })
                      }
                    })
                  }
                })
              }
            })
          })

          parser.write(req.file.buffer)
          parser.end()
        }
      })
    })

    function parseDate(date, shift) {
      const dateArr1 = date.split(' ')
      const dateArr2 = dateArr1[1].split('/')
      const months = {
        'Jan' : 1,
        'Feb' : 2,
        'Mar' : 3,
        'Apr' : 4,
        'May' : 5,
        'Jun' : 6,
        'Jul' : 7,
        'Aug' : 8,
        'Sep' : 9,
        'Oct' : 10,
        'Nov' : 11,
        'Dec' : 12
      }
      var output = '20' + dateArr2[1] + '-' + months[dateArr2[0]] + '-' + dateArr1[0]
      if (shift == 'Day') {
        output += 'T10:00'
      } else {
        output += 'T22:00'
      }

      return output
    }

    function insertLine(companyId, lineName) {
      return new Promise(function(resolve, reject) {
        conn.query('INSERT INTO assemblyLines (companyId, userId, name) VALUES (?,?,?)', [companyId, 1, lineName], function(err, result) {
          if (err) {
            return reject(err);
          } else {
            if (result.insertId) {
              return resolve(result.insertId)
            } else {
              return reject(null)
            }
          }
        })
      })
    }

    function insertMachine(lineId, machineName) {
      return new Promise(function(resolve, reject) {
        conn.query('INSERT INTO machines (lineId, name, icon_url) VALUES (?,?,?)', [lineId, machineName, 'https://s3.us-east-2.amazonaws.com/manufacturing-app-icons/example-icon.png'], function(err, result) {
          if (err) {
            return reject(err);
          } else {
            if (result.insertId) {
              return resolve(result.insertId)
            } else {
              return reject(null)
            }
          }
        })
      })
    }

    return adminRoutes;

};
