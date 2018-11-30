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
  timezone: 'utc'
}

var conn = mysql.createConnection(db_config);

conn.on('error', function(err) {
  console.log('db error', err);
  if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
    handleDisconnect();                         // lost due to either server restart, or a
  } else {                                      // connnection idle timeout (the wait_timeout
    throw err;                                  // server variable configures this)
  }
})

function handleDisconnect() {
  conn = mysql.createConnection(db_config);
  conn.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime
}



conn.query('SET foreign_key_checks = 0')
conn.query('DROP TABLE IF EXISTS downtimeImages')
conn.query('DROP TABLE IF EXISTS downtime')
conn.query('DROP TABLE IF EXISTS machines')
conn.query('DROP TABLE IF EXISTS assemblyLineUsers')
conn.query('DROP TABLE IF EXISTS assemblyLines')
conn.query('DROP TABLE IF EXISTS logins')
conn.query('DROP TABLE IF EXISTS users')
conn.query('DROP TABLE IF EXISTS companies')
conn.query('SET foreign_key_checks = 1')

conn.query('CREATE TABLE IF NOT EXISTS companies (companyId INTEGER AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL UNIQUE, createdDate DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL)')
conn.query('CREATE TABLE IF NOT EXISTS users (userId INTEGER AUTO_INCREMENT PRIMARY KEY, companyId INTEGER, createdDate DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, FOREIGN KEY(companyId) REFERENCES companies(companyId))')
conn.query('CREATE TABLE IF NOT EXISTS logins (loginId INTEGER AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255) NOT NULL, userId INTEGER NOT NULL, passwordHash CHAR(60), FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE)')
conn.query('CREATE TABLE IF NOT EXISTS assemblyLines (lineId INTEGER AUTO_INCREMENT PRIMARY KEY, companyId INTEGER NOT NULL, name VARCHAR(255) NOT NULL, availableMin INTEGER NOT NULL, morningShift INTEGER NOT NULL, eveningShift INTEGER NOT NULL, createdDate DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, FOREIGN KEY (companyId) REFERENCES companies(companyId))')
conn.query('CREATE TABLE IF NOT EXISTS assemblyLineUsers (lineId INTEGER NOT NULL, userId INTEGER NOT NULL, FOREIGN KEY(lineId) REFERENCES assemblyLines(lineId), FOREIGN KEY(userId) REFERENCES users(userId) ON DELETE CASCADE, UNIQUE(lineId, userId))')
conn.query('CREATE TABLE IF NOT EXISTS machines (machineId INTEGER AUTO_INCREMENT PRIMARY KEY, lineId INTEGER NOT NULL, name VARCHAR(255) NOT NULL, icon_url VARCHAR(255) NOT NULL, createdDate DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,  FOREIGN KEY(lineId) REFERENCES assemblyLines(lineId), UNIQUE(lineId, name))')
conn.query('CREATE TABLE IF NOT EXISTS downtime (downtimeId INTEGER AUTO_INCREMENT PRIMARY KEY, machineId INTEGER NOT NULL, lineId INTEGER NOT NULL, lineLeaderName VARCHAR(255) NOT NULL, downtime INTEGER NOT NULL, description TEXT, createdDate DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, FOREIGN KEY(machineId) REFERENCES machines(machineId), FOREIGN KEY(lineId) REFERENCES assemblyLines(lineId))')
conn.query('CREATE TABLE IF NOT EXISTS downtimeImages (downtimeImageId INTEGER AUTO_INCREMENT PRIMARY KEY, downtimeId INTEGER NOT NULL, imageUrl VARCHAR(255) NOT NULL, createdDate DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, FOREIGN KEY(downtimeId) REFERENCES downtime(downtimeId))')

conn.query('CREATE TRIGGER before_downtime_insert BEFORE INSERT ON downtime FOR EACH ROW BEGIN ' +
'SET NEW.lineId = (SELECT lineId FROM machines WHERE machineId = NEW.machineId); END;')

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
  res.send({userId: req.user})
})

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
