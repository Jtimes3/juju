var pg = require('pg');
var pgp = require('pg-promise')(/*options*/)
var connectionString = require('./../db/config/init');
var db = pgp(connectionString);

module.exports = {
  usersPost : function(req, res) {
    var results = [];

    // Grab data from http request
    var data = {
      email: req.body.email,
      phoneNumber: req.body.phonenumber,
      contactPref: req.body.contactpref,
      FBuID:req.body.FBuID,
      FBname:req.body.userName
    };

    // Get a Postgres client from the connection pool
    // if user exists in the db it won't create a new user and fetch it's user ID
    db.tx(function(t) {
      return t.oneOrNone('SELECT id FROM users WHERE FBuID=${FBuID}', data)
      .then(function(userID){
        return userID || t.one('INSERT INTO users(email, phoneNumber, FBuID, FBname) values(${email}, ${phoneNumber}, ${FBuID}, ${FBname}) RETURNING id', data)
      });
    })
    .then(function(userID){
      res.send(userID);
    })
    .catch( function (err){
      console.log(err)
      res.send(err);
    })
  },

  // CREATE A SINGLE USER
  //curl --data "email=juju@test.com2&phoneNumber=415-111-111&FBuID=jujupw&userName=AdminJuJu" http://127.0.0.1:3000/api/users

  //READ GET ALL USERS
  usersGet : function(req, res) {

    var results = [];

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
      // Handle connection errors
      if(err) {
        done();
        console.log(err);
        return res.status(500).json({ success: false, data: err});
      }

      // SQL Query > Select Data
      var query = client.query('SELECT * FROM users ORDER BY id ASC;');

      // Stream results back one row at a time
      query.on('row', function(row) {
        results.push(row);
      });

      // After all data is returned, close connection and return results
      query.on('end', function() {
        done();
        return res.json(results);
      });
    });
  },

  //READ GETT ONE SINGLE USER
  userOneUserInfo : function(req, res){
    var results = [];
    var id = req.params.user_id;
    
    if( isNaN(Number(id))) {
      return res.status(400).send("Error : Tried to send NaN to api/users/:user_id")
    }

    pg.connect(connectionString, function(err, client, done){
      if(err){
        done();
        console.log(err);
        return res.status(500).json({ success: false, data: err});
      }

      var query = client.query('SELECT * FROM users WHERE id=($1)', [id]);

      query.on('row', function(row) {
        results.push(row);
      });

      query.on('end', function() {
        done();
        return res.json(results);
      });

    })
  },
  //UPDATE A SINGLE USER
  //curl -X PUT --data "email=test@test.com&phoneNumber=510-111-1111&FBuID=jujupw&userName=JuJu" http://127.0.0.1:3000/api/users/1
  userUpdate : function(req, res) {

    var results = [];

    // Grab data from the URL parameters
    var id = req.params.user_id;
    if( isNaN(Number(id))) {
      return res.status(400).send("Error : Tried to send NaN to api/users/:user_id")
    }
    // Grab data from http request
    var data = {
      email: req.body.email,
      phoneNumber: req.body.phonenumber,
      contactPref: req.body.contactpref,
      FBuID:req.body.fbuid,
      FBname:req.body.fbname
    };
    console.log('updating', data);
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
      // Handle connection errors
      if(err) {
        done();
        console.log(err);
        return res.status(500).send(json({ success: false, data: err}));
      };

      // SQL Query > Update Data
      client.query('UPDATE users SET email=($1), phoneNumber=($2), contactPref=($3), FBname=($4)  WHERE id=($5)', [data.email, data.phoneNumber, data.contactPref, data.FBname, id]);

      // SQL Query > Select Data
      var query = client.query('SELECT * FROM watcheditems where userid=($1) LIMIT 1', [id]);

      // Stream results back one row at a time
      query.on('row', function(row) {
        console.log('rows', row)
        results.push(row);
      });

      // After all data is returned, close connection and return results
      query.on('end', function() {
        done();
        console.log('results', results)
        return res.json(results);
      });
    });
  }
}
