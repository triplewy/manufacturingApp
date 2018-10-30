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

    passport.use('local-signup', new LocalStrategy({
      passReqToCallback : true
    },
      function(req, email, password, done) {
        if (!validator.isEmail(email)) {
          console.log("email is invalid");
          return done(null, false, { message: 'Email is invalid' })
        }
        bcrypt.hash(password, 10, function(err, passwordHash) {
          bcrypt.hash(randomstring.generate(), 10, function(err, verificationHash) {
            conn.query('INSERT INTO users (profileName) VALUES (?)', [shortId.generate()], function(err, result) {
              if (err) {
                return done(err)
              } else {
                var userId = result.insertId
                conn.query('INSERT INTO logins (email, passwordHash, verificationHash, userId) VALUES (?,?,?,?)',
                  [email, passwordHash, verificationHash, userId], function(err, result) {
                  if (err) {
                    return done(err)
                  } else {
                    return done(null, userId)
                    // var link = "localhost:3000/verify?id=" + verificationHash;
                    // var mailOptions={
                    //   to : email,
                    //   subject : "Please confirm your Email account",
                    //   html : "Hello,<br> Please click on the link to verify your email.<br><a href="+ link +">" + link + "</a>"
                    // }
                    // smtpTransport.sendMail(mailOptions, function(err, response) {
                    //   if (err) {
                    //     return done(err)
                    //   } else {
                    //     console.log("Message sent");
                    //     return done(null, {userId: userId, username: username.toLowerCase()})
                    //   }
                    // })
                  }
                })
              }
            })
          })
        })
      }
    ))

    authRoutes.post('/signup', passport.authenticate('local-signup'), (req, res) => {
      console.log('- Request received:', req.method.cyan, '/api/auth/signup');
      const userId = req.user
      res.send({userId: userId});
    })

    authRoutes.post('/signin', passport.authenticate('local-login'), function(req, res) {
      console.log('- Request received:', req.method.cyan, '/api/auth/signin');
      const userId = req.user
      res.send({userId: userId});
    })

    authRoutes.post('/name', loggedIn, function(req, res) {
      console.log('- Request received:', req.method.cyan, '/api/auth/name');
      const userId = req.user
      conn.query('INSERT INTO usersNames (userId, name) VALUES (?, ?)', [userId, req.body.name], function(err, result) {
        if (err) {
          console.log(err);
          res.send({message: "fail"});
        } else {
          res.send({message: "success"});
        }
      })
    })

    authRoutes.post('/logout', loggedIn, function(req, res) {
      console.log('- Request received:', req.method.cyan, '/api/auth/logout');
      req.logout()
      req.session.destroy();
      res.send({message: 'success'})
    })

    return authRoutes;


};
