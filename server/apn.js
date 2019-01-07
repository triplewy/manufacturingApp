var apn = require('apn')
var mysql = require('mysql')
var named = require('named-placeholders')();
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var Redis = require('redis')
var client = Redis.createClient();

const options = {
  token: {
    key: process.env.KEY_PATH,
    keyId: process.env.KEY_ID,
    teamId: process.env.TEAM_ID
  },
  production: true
}

const db_config = {
  host     : process.env.MYSQL_HOST,
  user     : process.env.MYSQL_USER,
  password : process.env.MYSQL_PASSWORD,
  database : process.env.MYSQL_DATABASE,
  timezone: '+05:00'
}

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

var conn = mysql.createConnection(db_config);

var sessionStore = new RedisStore({
  host: process.env.REDIS_HOST,
  port: 6379,
  client: client
})

function serverAlive() {
  setTimeout(function() {
    conn.query('SELECT 1', [], function(err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log('Server alive');
        serverAlive()
      }
    })
  }, 25200000)
}

serverAlive()


function sendCompanyNotification(devices, alert) {
  return new Promise(function(resolve, reject) {
    var apnProvider = new apn.Provider(options);
    var promises = []
    for (var i = 0; i < devices.length; i++) {
      var notification = new apn.Notification();
      notification.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
      notification.badge = devices[i].badge;
      notification.sound = "ping.aiff";
      notification.alert = alert
      notification.payload = {'messageFrom': 'Streamline'};
      notification.topic = process.env.BUNDLE_ID;
      promises.push(apnProvider.send(notification, devices[i].token))
    }

    Promise.all([...promises])
    .then(allData => {
      apnProvider.shutdown();
      var sent = 0
      var failed = 0
      for (var i = 0; i < allData.length; i++) {
        sent += allData[i].sent.length
        failed += allData[i].failed.length
      }
      return resolve({ sent: sent, failed: failed })
    })
    .catch(err => {
      apnProvider.shutdown();
      return reject(err);
    })
  })
}

function sendNotification(userId, alert) {
  return new Promise(function(resolve, reject) {
    var apnProvider = new apn.Provider(options)
    var notification = new apn.Notification()

    Promise.all([incrementBadge(userId), getDeviceToken(userId)]).then(allData => {

      notification.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
      notification.badge = allData[0];
      notification.sound = "ping.aiff";
      notification.alert = alert
      notification.payload = {'messageFrom': 'Streamline'};
      notification.topic = process.env.BUNDLE_ID;

      apnProvider.send(notification, allData[1].deviceToken).then(notificationData => {
        if (notificationData.failed.length) {
          return reject(notificationData.failed)
        } else {
          apnProvider.shutdown();
          storeNotification(userId, alert).then(data => {
            if (data.message == 'success') {
              return resolve({ sent: notificationData.sent.length, failed: notificationData.failed.length })
            } else {
              return resolve({ message: 'failed' })
            }
          }).catch(err => {
            return reject(err)
          })
        }
      }).catch(err => {
        apnProvider.shutdown();
        return reject(err)
      })
    }).catch(err => {
      return reject(err)
    })
  })
}

function incrementBadge(userId) {
  return new Promise(function(resolve, reject) {
    client.HINCRBY(userId, 'badge', 1, function(err, result) {
      if (err) {
        return reject(err)
      } else {
        return resolve(result)
      }
    })
  })
}

function getDeviceToken(userId) {
  return new Promise(function(resolve, reject) {
    conn.query('SELECT deviceToken FROM users WHERE userId = :userId LIMIT 1', {userId: userId}, function(err, result) {
      if (err) {
        return reject(err)
      } else {
        return resolve(result[0])
      }
    })
  })
}

function storeNotification(userId, message) {
  return new Promise(function(resolve, reject) {
    conn.query('INSERT INTO notifications (companyId, userId, message) ' +
    'VALUES ((SELECT companyId FROM users WHERE userId = :userId LIMIT 1), :userId, :message)',
    { userId: userId, message: message }, function(err, result) {
      if (err) {
        return reject(err)
      } else {
        return resolve({ message: 'success' })
      }
    })
  })
}

module.exports = {
  sendCompanyNotification: sendCompanyNotification,
  sendNotification: sendNotification
}
