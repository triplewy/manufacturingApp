module.exports = function(passport, conn, loggedIn) {
    'use strict';
    var authRoutes = require('express').Router();
    var LocalStrategy = require('passport-local').Strategy
    var bcrypt = require('bcrypt');

    passport.use('local-login', new LocalStrategy(
     function(username, password, done) {
       conn.query('SELECT * FROM logins WHERE username=?', [username], function(err, result) {
          if (err) {
            return done(err)
          }
          if (result.length == 0) {
            return done(null, false)
          }
          bcrypt.compare(password, result[0].passwordHash, (err, isValid) => {
            if (err) {
              return done(err)
            }
            if (!isValid) {
              return done(null, false)
            }
            return done(null, result[0].userId)
          })
        })
      }
    ))

    passport.use('local-signup', new LocalStrategy(
      function(username, password, done) {
        bcrypt.hash(password, 10, function(err, passwordHash) {
          conn.query('INSERT INTO users () VALUES ()', [], function(err, result) {
            if (err) {
              return done(err)
            } else {
              const userId = result.insertId
              conn.query('INSERT INTO logins (username, userId, passwordHash) VALUES (?,?,?)', [username, userId, passwordHash], function(err, result) {
                if (err) {
                  return done(err)
                } else {
                  return done(null, userId)
                }
              })
            }
          })
        })
      }
    ))

    authRoutes.post('/signup', passport.authenticate('local-signup'), (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/auth/signup');
      const userId = req.user
      res.send({userId: userId});
    })

    authRoutes.post('/signin', passport.authenticate('local-login'), (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/auth/signin');
      const userId = req.user
      res.send({userId: userId});
    })

    authRoutes.post('/checkUsername', (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/auth/checkUsername');
      const username = req.body.username.toLowerCase()
      conn.query('SELECT 1 FROM logins WHERE username = ?', [username], function(err, result) {
        if (err) {
          console.log(err);
        } else {
          if (result.length > 0) {
            res.send({message: 'exists'})
          } else {
            res.send({message: 'unique'})
          }
        }
      })
    })

    // authRoutes.post('/name', loggedIn, function(req, res) {
    //   console.log('- Request received:', req.method.cyan, '/api/auth/name');
    //   const userId = req.user
    //   conn.query('INSERT INTO usersNames (userId, name) VALUES (?, ?)', [userId, req.body.name], function(err, result) {
    //     if (err) {
    //       console.log(err);
    //       res.send({message: "fail"});
    //     } else {
    //       res.send({message: "success"});
    //     }
    //   })
    // })

    authRoutes.post('/logout', loggedIn, function(req, res) {
      console.log('- Request received:', req.method.cyan, '/api/auth/logout');
      req.logout()
      req.session.destroy();
      res.send({message: 'success'})
    })

    return authRoutes;


};
