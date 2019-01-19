module.exports = function(conn, loggedIn) {
    'use strict';
    var workorderRoutes = require('express').Router();

    workorderRoutes.get('/', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/workorder');
      const userId = req.user

      conn.query('SELECT a.*, b.name AS line, c.name AS machine, d.* FROM workOrders AS a ' +
      'JOIN assemblyLines AS b ON b.lineId = a.lineId AND b.companyId = (SELECT companyId FROM users WHERE userId = :userId) ' +
      'JOIN machines AS c ON c.machineId = a.machineId ' +
      'LEFT JOIN workOrderImages AS d ON d.workOrderId = a.workOrderId ' +
      'WHERE a.approved = TRUE ' +
      'ORDER BY a.createdDate', { userId: userId }, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          var workOrders = {}

          for (var row of result) {
            if (workOrders[row.workOrderId]) {
              workOrders[row.workOrderId].images.push({ url: row.imageUrl })
            } else {
              workOrders[row.workOrderId] = {...row, images: [{ url: row.imageUrl}]}
            }
          }

          res.send(Object.keys(workOrders).map(i => workOrders[i]))
        }
      })
    })

    workorderRoutes.put('/approve', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/workorder/approve');
      const hash = req.body.hash
      if (hash) {
        conn.query('UPDATE workOrders SET approved = TRUE WHERE approvalHash = :hash', { hash: hash }, function(err, result) {
          if (err) {
            console.log(err);
          } else {
            if (result.affectedRows) {
              console.log('Work order approved');
              res.send({message: 'success'})
            } else {
              res.send({message: 'Failed to approve'})
            }
          }
        })
      } else {
        res.send({message: 'Failed to approve'})
      }
    })

    workorderRoutes.put('/', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/workorder');
      conn.query('UPDATE workOrders SET finishedDate = CURRENT_TIMESTAMP WHERE workOrderId = :workOrderId', { workOrderId: req.body.workOrderId }, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          if (result.affectedRows) {
            res.send({ finishedDate: Date.now() })
          } else {
            res.send({ message: 'fail'})
          }
        }
      })
    })

    return workorderRoutes;

};
