// use strict compiling
"use strict";
require('dotenv').config()
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var named = require('named-placeholders')();
var path = require('path');
var colors = require('colors');
var cookieParser = require('cookie-parser')
var mysql = require('mysql')
var aws = require('aws-sdk')
var multer = require('multer');
var multerS3 = require('multer-s3')
var passport = require('passport');
var uuidv1 = require('uuid/v1');
var bcrypt = require('bcrypt');
var fs = require('fs')
var cors = require('cors')
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var Redis = require('redis')
var client = Redis.createClient();

var sessionStore = new RedisStore({
  host: process.env.REDIS_HOST,
  port: 6379,
  client: client
})

var app = express();
var s3 = new aws.S3()
var server = http.createServer(app)

app.use(cors({credentials: true, origin: true}))
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

var sessionMiddleware = session({
  store: sessionStore,
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: false,
    secure: false
  }
})

var passportInit = passport.initialize();
var passportSession = passport.session();

app.use(sessionMiddleware)
app.use(passportInit)
app.use(passportSession)

passport.serializeUser(function(user, done) {
  console.log("serializeUser userId is", user);
	done(null, user);
})

passport.deserializeUser(function(user, done) {
  done(null, user);
})

const originalQuery = require('mysql/lib/Connection').prototype.query;

require('mysql/lib/Connection').prototype.query = function (...args) {
    if (Array.isArray(args[0]) || !args[1]) {
        return originalQuery.apply(this, args);
    }
    ([
        args[0],
        args[1]
    ] = named(args[0], args[1]));

    return originalQuery.apply(this, args);
};

const db_config = {
  host     : process.env.MYSQL_HOST,
  user     : process.env.MYSQL_USER,
  password : process.env.MYSQL_PASSWORD,
  database : process.env.MYSQL_DATABASE,
  timezone: '+04:00'
}

var conn = mysql.createConnection(db_config);

conn.on('error', function(err) {
  console.log('db error', err);
  if(err.code === 'PROTOCOL_CONNECTION_LOST') {
    handleDisconnect()
  } else {
    throw err;
  }
})

function handleDisconnect() {
  conn = mysql.createConnection(db_config);
  conn.connect(function(err) {
    if(err) {
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000);
    }
  });
}

function serverAlive() {
  setTimeout(function() {
    conn.query('SELECT 1', [], function(err, result) {
      if (err) {
        console.log(err);
      } else {
        serverAlive()
      }
    })
  }, 25200000)
}

serverAlive()

var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET,
    key: function (req, file, cb) {
      cb(null, uuidv1() + '.jpg')
    }
  }),
  limits: {fileSize: 10000000, files: 4},
  fileFilter: function(request, file, callback) {
    var mime = file.mimetype
    if (mime !== 'image/png' && mime !== 'image/jpg' && mime !== 'image/jpeg') {
         return callback(new Error('Only images are allowed'), false);
     }
     callback(null, true)
  }
}).array('image', 4);

var csvUpload = multer({
  storage: multer.memoryStorage(),
  limits: {fileSize: 10000000, files: 1},
  fileFilter: function(request, file, callback) {
    var mime = file.mimetype
    if (mime !== 'text/csv') {
      return callback(new Error('Only csv is allowed'), false)
    }
    callback(null, true)
  }
}).single('csv')

var inputRoutes = require('./routes/inputRoutes')
var authRoutes = require('./routes/authRoutes')
var reportsRoutes = require('./routes/reportsRoutes')
var statsRoutes = require('./routes/statsRoutes')
var accountRoutes = require('./routes/accountRoutes')
var gridRoutes = require('./routes/gridRoutes')
var adminRoutes = require('./routes/adminRoutes')

app.get('/api/sessionLogin', loggedIn, (req, res) => {
  console.log('- Request received:', req.method.cyan, '/api/sessionLogin');
  Promise.all([module.exports.getLines(req.user), module.exports.getMachines(req.user), module.exports.getNames(req.user)]).then(allData => {
    res.send({lines: allData[0], machines: allData[1], names: allData[2]})
  }).catch(err => {
    console.log(err);
  })
})

module.exports = {
  getLines: function(userId) {
    return new Promise(function(resolve, reject) {
      conn.query('SELECT b.* FROM assemblyLineUsers AS a JOIN assemblyLines AS b ON b.lineId = a.lineId WHERE a.userId = :userId', {userId: userId}, function(err, result) {
        if (err) {
          return reject(err);
        } else {
          return resolve(result)
        }
      })
    });
  },

  getMachines: function(userId) {
    return new Promise(function(resolve, reject) {
      conn.query('SELECT * FROM machines WHERE lineId IN (SELECT lineId FROM assemblyLineUsers WHERE userId = :userId)', {userId: userId}, function(err, result) {
        if (err) {
          return reject(err);
        } else {
          var machines = []
          for (var i = 0; i < result.length; i++) {
            if (machines[result[i].lineId]) {
              machines[result[i].lineId].push(result[i])
            } else {
              machines[result[i].lineId] = [result[i]]
            }
          }
          return resolve(machines)
        }
      })
    })
  },

  getNames: function(userId) {
    return new Promise(function(resolve, reject) {
      conn.query('SELECT * FROM names WHERE companyId = (SELECT companyId FROM users WHERE userId = :userId)', {userId: userId}, function(err, result) {
        if (err) {
          return reject(err);
        } else {
          return resolve(result)
        }
      })
    })
  }
}


app.use('/api/input', inputRoutes(conn, loggedIn, upload))

app.use('/api/auth', authRoutes(passport, conn, loggedIn))

app.use('/api/reports', reportsRoutes(conn, loggedIn))

app.use('/api/stats', statsRoutes(conn, loggedIn))

app.use('/api/account', accountRoutes(conn, loggedIn))

app.use('/api/grid', gridRoutes(conn, loggedIn))

app.use('/api/admin', adminRoutes(conn, loggedIn, csvUpload))

server.listen(8082, function(){
    console.log('- Server listening on port 8082');
});

function loggedIn(req, res, next) {
  if (req.user) {
    next()
  } else {
    res.send({message: 'not logged in'})
  }
}
