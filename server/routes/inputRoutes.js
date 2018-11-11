module.exports = function(conn, loggedIn, upload) {
    'use strict';
    var inputRoutes = require('express').Router();

    inputRoutes.post('/submit', loggedIn, (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/input/submit');
      upload(req, res, function(err) {
        if (err) {
          console.log(err);
          res.send({message: err.message})
        } else {
          uploadDowntimeMetadata(req).then(function() {
            console.log("Records added successfully");
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

    return inputRoutes;

};
