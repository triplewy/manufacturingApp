module.exports = function(conn) {
    'use strict';

    var bcrypt = require('bcrypt')

    conn.query('INSERT INTO companies (name,morningShift,eveningShift) VALUES (?,?,?)', ['Test Factory',8,20], function(err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log("Records successfully added");
      }
    })

    conn.query('INSERT INTO users (profileName, companyId) VALUES (?,?)', ['Jon', 1], function(err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log("Records successfully added");
      }
    })

    bcrypt.hash('password', 10, function(err, hash) {
      conn.query('INSERT INTO logins (userId, username, passwordHash) VALUES (?,?,?)', [1, 'testFactory', hash], function(err, result) {
        if (err) {
          console.log(err);
        } else {
          console.log("Records successfully added");
        }
      })
    })

    conn.query('INSERT INTO assemblyLines (companyId, userId) VALUES (?,?)', [1,1], function(err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log("Records successfully added");
      }
    })

    conn.query('INSERT INTO machines (lineId, name, icon_url) VALUES (?,?,?)', [1,'Changeover', 'https://s3.us-east-2.amazonaws.com/manufacturing-app-icons/example-icon.png'], function(err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log("Records successfully added");
      }
    })

    conn.query('INSERT INTO machines (lineId, name, icon_url) VALUES (?,?,?)', [1,'Conveyor', 'https://s3.us-east-2.amazonaws.com/manufacturing-app-icons/example-icon.png'], function(err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log("Records successfully added");
      }
    })

    conn.query('INSERT INTO machines (lineId, name, icon_url) VALUES (?,?,?)', [1,'Filler', 'https://s3.us-east-2.amazonaws.com/manufacturing-app-icons/example-icon.png'], function(err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log("Records successfully added");
      }
    })

    conn.query('INSERT INTO machines (lineId, name, icon_url) VALUES (?,?,?)', [1,'Hot Melt', 'https://s3.us-east-2.amazonaws.com/manufacturing-app-icons/example-icon.png'], function(err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log("Records successfully added");
      }
    })

    conn.query('INSERT INTO machines (lineId, name, icon_url) VALUES (?,?,?)', [1,'Case Sealer', 'https://s3.us-east-2.amazonaws.com/manufacturing-app-icons/example-icon.png'], function(err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log("Records successfully added");
      }
    })

    conn.query('INSERT INTO machines (lineId, name, icon_url) VALUES (?,?,?)', [1,'Manpower', 'https://s3.us-east-2.amazonaws.com/manufacturing-app-icons/example-icon.png'], function(err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log("Records successfully added");
      }
    })

    conn.query('INSERT INTO machines (lineId, name, icon_url) VALUES (?,?,?)', [1,'Case Packer', 'https://s3.us-east-2.amazonaws.com/manufacturing-app-icons/example-icon.png'], function(err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log("Records successfully added");
      }
    })

    conn.query('INSERT INTO machines (lineId, name, icon_url) VALUES (?,?,?)', [1,'Checkweigher', 'https://s3.us-east-2.amazonaws.com/manufacturing-app-icons/example-icon.png'], function(err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log("Records successfully added");
      }
    })

    conn.query('INSERT INTO machines (lineId, name, icon_url) VALUES (?,?,?)', [1,'Clean up', 'https://s3.us-east-2.amazonaws.com/manufacturing-app-icons/example-icon.png'], function(err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log("Records successfully added");
      }
    })

    conn.query('INSERT INTO machines (lineId, name, icon_url) VALUES (?,?,?)', [1,'Lack of Powder', 'https://s3.us-east-2.amazonaws.com/manufacturing-app-icons/example-icon.png'], function(err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log("Records successfully added");
      }
    })

    conn.query('INSERT INTO machines (lineId, name, icon_url) VALUES (?,?,?)', [1,'Components', 'https://s3.us-east-2.amazonaws.com/manufacturing-app-icons/example-icon.png'], function(err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log("Records successfully added");
      }
    })

    conn.query('INSERT INTO machines (lineId, name, icon_url) VALUES (?,?,?)', [1,'Seal Spout', 'https://s3.us-east-2.amazonaws.com/manufacturing-app-icons/example-icon.png'], function(err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log("Records successfully added");
      }
    })

    conn.query('INSERT INTO machines (lineId, name, icon_url) VALUES (?,?,?)', [1,'Taper', 'https://s3.us-east-2.amazonaws.com/manufacturing-app-icons/example-icon.png'], function(err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log("Records successfully added");
      }
    })

    conn.query('INSERT INTO downtime (machineId, downtime, description) VALUES (?,?,?)', [1,30,"test description"], function(err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log("Records successfully added");
      }
    })
};
