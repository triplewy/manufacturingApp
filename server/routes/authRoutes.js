module.exports = function(passport, conn, loggedIn, client) {
    'use strict';
    var authRoutes = require('express').Router();
    var LocalStrategy = require('passport-local').Strategy
    var bcrypt = require('bcrypt');
    var sessionFunctions = require('../server.js')

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

    passport.use('local-admin-login', new LocalStrategy(
     function(username, password, done) {
       conn.query('SELECT a.*, b.* FROM logins AS a JOIN users AS b ON b.userId = a.userId WHERE a.username=?', [username], function(err, result) {
          if (err) {
            return done(err)
          }
          if (result.length == 0) {
            return done(false)
          }
          bcrypt.compare(password, result[0].passwordHash, (err, isValid) => {
            if (err) {
              return done(err)
            }
            if (!isValid) {
              return done('Incorrect credentials')
            }

            if (!result[0].isAdmin) {
              return done('Not admin')
            }
            return done(null, result[0].userId)
          })
        })
      }
    ))

    passport.use('local-signup', new LocalStrategy(
      function(username, password, done) {
        bcrypt.hash(password, 10, function(err, passwordHash) {
          conn.query('START TRANSACTION', [], function(err, result) {
            if (err) {
              conn.query('ROLLBACK')
              return done(err);
            }
            conn.query('INSERT INTO users () VALUES ()', [], function(err, result) {
              if (err) {
                conn.query('ROLLBACK')
                return done(err);
              } else {
                const userId = result.insertId
                conn.query('INSERT INTO logins (username, userId, passwordHash) VALUES (?,?,?)', [username, userId, passwordHash], function(err, result) {
                  if (err) {
                    conn.query('ROLLBACK')
                    return done(err);
                  } else {
                    conn.query('COMMIT', [], function(err, result) {
                      if (err) {
                        conn.query('ROLLBACK')
                        return done(err);
                      }
                      return done(null, userId)
                    })
                  }
                })
              }
            })
          })
        })
      }
    ))

    authRoutes.post('/signup', function(req, res, next) {
      console.log('- Request received:', req.method.cyan, '/api/auth/signup');
      passport.authenticate('local-signup', function(err, user) {
        if (err) {
          if (err.code == 'ER_DUP_ENTRY') {
            return res.send({message: 'Username already exists'})
          } else {
            return res.send({message: 'Unable to create account'})
          }
        } else {
          req.logIn(user, function(err) {
            if (err) {
              return res.send({message: 'Unable to create account'})
            } else {
              console.log(user);
              client.HMSET(user, {
                badge: '0'
              })
              return res.send({message: 'success'});
            }
          })
        }
      })(req, res, next)
    })

    authRoutes.post('/signin', passport.authenticate('local-login'), (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/auth/signin');
      Promise.all([
        sessionFunctions.getLines(req.user),
        sessionFunctions.getMachines(req.user),
        sessionFunctions.getNames(req.user),
        sessionFunctions.getShifts(req.user),
        sessionFunctions.getActiveLine(req.user)
      ]).then(allData => {
        res.send({lines: allData[0], machines: allData[1], names: allData[2], shifts: allData[3], activeLine: allData[4]})
      }).catch(err => {
        console.log(err);
      })
    })

    authRoutes.post('/signin/admin', function(req, res, next) {
      console.log('- Request received:', req.method.cyan, '/api/auth/signin/admin');
      passport.authenticate('local-admin-login', function(err, user) {
        if (err) {
          console.log(err);
          res.send({ message: err })
        } else {
          req.logIn(user, function(err) {
            if (err) {
              console.log(err);
            } else {
              Promise.all([
                sessionFunctions.getLines(req.user),
                sessionFunctions.getMachines(req.user),
                sessionFunctions.getNames(req.user)
              ]).then(allData => {
                res.send({lines: allData[0], machines: allData[1], names: allData[2]})
              }).catch(err => {
                console.log(err);
              })
            }
          })
        }
      })(req, res, next)
    })

    authRoutes.post('/logout', loggedIn, function(req, res) {
      console.log('- Request received:', req.method.cyan, '/api/auth/logout');
      req.logout()
      req.session.destroy();
      res.send({message: 'success'})
    })

    return authRoutes;


};
