module.exports = function(conn, loggedIn, csvUpload) {
    'use strict';

    var adminRoutes = require('express').Router();
    var parse = require('csv-parse')
    const parser = parse({delimiter: ','})

    adminRoutes.get('/companies', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/admin/companies');
      const userId = req.user
      if (userId == 1) {
        conn.query('SELECT * FROM companies', [], function(err, result) {
          if (err) {
            console.log(err);
          } else {
            res.send(result)
          }
        })
      } else {
        res.send({message: 'Unauthorized Access'})
      }
    })

    adminRoutes.get('/company/:companyId/users', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/admin/companies/' + req.params.companyId + '/users');
      const userId = req.user
      if (userId == 1) {
        conn.query('SELECT *, userId AS id, userId AS name FROM users WHERE companyId = :companyId', {companyId: req.params.companyId}, function(err, result) {
          if (err) {
            console.log(err);
          } else {
            res.send(result)
          }
        })
      } else {
        res.send({message: 'Unauthorized Access'})
      }
    })

    adminRoutes.get('/company/:companyId/lines', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/admin/companies/' + req.params.companyId + '/lines');
      const userId = req.user
      if (userId == 1) {
        conn.query('SELECT *, lineId AS id FROM assemblyLines WHERE companyId = :companyId', {companyId: req.params.companyId}, function(err, result) {
          if (err) {
            console.log(err);
          } else {
            res.send(result)
          }
        })
      } else {
        res.send({message: 'Unauthorized Access'})
      }
    })

    adminRoutes.get('/company/:companyId/machines', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/admin/companies/' + req.params.companyId + '/machines');
      const userId = req.user
      if (userId == 1) {
        conn.query('SELECT *, machineId AS id FROM machines WHERE lineId IN (SELECT lineId FROM assemblyLines WHERE companyId = :companyId)', {companyId: req.params.companyId}, function(err, result) {
          if (err) {
            console.log(err);
          } else {
            res.send(result)
          }
        })
      } else {
        res.send({message: 'Unauthorized Access'})
      }
    })

    adminRoutes.post('/company/:companyId/lines/new', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/admin/company/' + req.params.companyId + '/lines/new');
      const userId = req.user
      const companyId = req.params.companyId
      if (userId == 1) {
        conn.query('INSERT INTO assemblyLines (companyId, userId, name) VALUES (?,?,?)', [companyId, userId, req.body.name], function(err, result) {
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
      } else {
        res.send({message: 'Unauthorized Access'})
      }
    })

    adminRoutes.post('/company/:companyId/machines/new', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/admin/company/' + req.params.companyId + '/machines/new');
      const userId = req.user
      const companyId = req.params.companyId
      if (userId == 1) {
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
      } else {
        res.send({message: 'Unauthorized Access'})
      }
    })

    adminRoutes.post('/company/:companyId/upload/csv', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/admin/company/' + req.params.companyId + '/upload/csv');
      const userId = req.user
      const companyId = req.params.companyId
      if (userId == 1) {
        csvUpload(req, res, function(err) {
          if (err) {
            console.log(err);
            res.send({message: err.message})
          } else {

            var output = []
            var machines = []

            parser.on('readable', function() {
              let record
              while (record = parser.read()) {
                // date, lineLeaderName, downtime, description, machineId
                var downtimeEntry = [parseDate(record[0]), record[5], record[7], record[9], record[6]]

                if (!machines[record[6]]) {
                  machines[record[6]] = record[2].substring(2)
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
                  for (var machine in machines) {
                    machineInsertArr.push([lines[machines[machine]], machine, 'https://s3.us-east-2.amazonaws.com/manufacturing-app-icons/example-icon.png'])
                  }

                  conn.query('INSERT INTO machines (lineId, name, icon_url) VALUES ?', [machineInsertArr], function(err, result) {
                    if (err) {
                      console.log(err);
                    } else {
                      console.log('Machine records added successfully');
                      conn.query('SELECT * FROM machines WHERE lineId IN (SELECT lineId FROM assemblyLines WHERE companyId = :companyId)', {companyId: companyId}, function(err, result) {
                        if (err) {
                          console.log(err);
                        } else {
                          var machineIds = []
                          for (var i = 0; i < result.length; i++) {
                            machineIds[result[i].name] = result[i].machineId
                          }

                          for (var i = 0; i < output.length; i++) {
                            output[i][4] = machineIds[output[i][4]]
                          }

                          conn.query('INSERT INTO downtime (createdDate, lineLeaderName, downtime, description, machineId) VALUES ?', [output], function(err, result) {
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
      } else {
        res.send({message: 'Unauthorized Access'})
      }
    })

    function parseDate(date) {
      var output = ''
      const dateArr1 = date.split(' ')
      const dateArr2 = dateArr1[1].split('/')
      return '20' + dateArr2[1] + '-10-' + dateArr1[0]
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
