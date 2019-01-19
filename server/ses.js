// use strict compiling
"use strict";
require('dotenv').config()

var aws = require('aws-sdk')
var ses = new aws.SES({apiVersion: '2010-12-01'});
var s3 = new aws.S3();
var nodemailer = require('nodemailer');
aws.config.update({region: process.env.AWS_REGION});

var mysql = require('mysql')
var named = require('named-placeholders')();

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

function getS3Files(keys) {
  return new Promise(function (resolve, reject) {
    var S3Promises = keys.map(key => s3.getObject({ Bucket: 'manufacturing-app-images', Key: key }).promise())
    Promise.all(S3Promises).then(allData => {
      var result = allData.map((item, index) => {
        return { filename: `Work-Order-${index}.jpg`, content: item.Body }
      })
      return resolve(result)
    }).catch(err => {
      return reject(err)
    })
  })
}

function constructMessage(body) {
  return new Promise(function(resolve, reject) {
    conn.query('SELECT a.name AS machine, b.name AS line FROM machines AS a JOIN assemblyLines AS b ON b.lineId = a.lineId WHERE machineId = :machineId LIMIT 1', { machineId: body.machineId }, function(err, result) {
      if (err) {
        return reject(err)
      } else {
        const reviews = ["Low", "Not Urgent", "Moderate", "Important", "Urgent"]
        const message =
          `<p>LINE: ${result[0].line}</p></br>` +
          `<p>MACHINE: ${result[0].machine}</p></br>` +
          `<p>IMPORTANCE: ${reviews[body.rating - 1]} ( ${body.rating} / 5 )</p></br>` +
          `<p>DESCRIPTION: ${body.description}</p></br>` +
          `<p>DATE: ${new Date()}</p></br>`
        return resolve(message)
      }
    })
  })
}

function getRecipients(body) {
  return new Promise(function(resolve, reject) {
    conn.query('SELECT b.email FROM assemblyLineMechanics AS a JOIN mechanics AS b ON b.mechanicId = a.mechanicId WHERE a.lineId = :lineId', { lineId: body.lineId }, function(err, result) {
      if (err) {
        return reject(err)
      } else {
        return resolve({ to: result.map(row => row.email) })
      }
    })
  })
}

module.exports = {
  sendEmail: function(body, approvalHash, keys) {
    Promise.all([constructMessage(body), getRecipients(body), getS3Files(keys)]).then(allData => {
      var mailOptions = {
        from: 'admin@streamlineanalytica.com',
        subject: 'NEW WORK ORDER',
        // text: allData[0],
        html: `${allData[0]}<a href='https://app.streamlineanalytica.com/approve?id=${approvalHash}'>Approve work order</a>`,
        to: allData[1].to,
        bcc: allData[1].bcc,
        attachments: allData[2]
      }

      var transporter = nodemailer.createTransport({ SES: ses })
      transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
          console.log(err);
          console.log('Error sending email');
        } else {
          console.log('Email sent successfully');
        }
      })
    }).catch(err => {
      console.log(err);
      console.log('Error getting attachment from S3');
    })
  },
}
