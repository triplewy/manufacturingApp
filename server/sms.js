// use strict compiling
"use strict";
require('dotenv').config()

var aws = require('aws-sdk')

aws.config.update({region: process.env.AWS_REGION});

module.exports = {
  sendSMS: function(phone, message) {
    return new Promise(function(resolve, reject) {
      var params = {
        Message: message,
        PhoneNumber: '+1' + phone
      }

      var publishTextPromise = new aws.SNS({apiVersion: '2010-03-31'}).publish(params).promise();

      publishTextPromise.then(data => {
        console.log("MessageId", data.MessageId);
        return resolve(data.MessageId)
      }).catch(err => {
        return reject(err)
      })
    })
  },
}
