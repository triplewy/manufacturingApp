module.exports = function(conn, loggedIn) {
    'use strict';
    var inputRoutes = require('express').Router();

    inputRoutes.post('/submit', (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/input/submit');
      // const userId = req.user
      conn.query('INSERT INTO downtime (machineId, downtime, description) VALUES (:machineId, :downtime, :description)',
      {machineId: req.body.machineId, downtime: req.body.downtime, description: req.body.description}, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          if (result.affectedRows) {
            console.log("Inserted successfully");
            res.send({message: 'success'})
          } else {
            console.log("Insert failed");
            res.send({message: 'fail'})
          }
        }
      })
    })

    return inputRoutes;

};
