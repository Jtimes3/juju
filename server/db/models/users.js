var express = require('express');
var router = express.Router();
var pg = require('pg');
var pgp = require('pg-promise')(/*options*/)
var connectionString = process.env.DATABASE_URL || require('./../../../config.js').connectionString;
var db = pgp(connectionString);

router.post('/api/users', usersPost);
router.get('/api/users', usersGet);
router.get('/api/users/:user_id', userOneUserInfo);
router.put('/api/users/:user_id', userUpdate);

function usersPost(req, res) {
  var results = [];
  console.log('req', req.body)

  // Grab data from http request
  var data = {
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    FBuID:req.body.FBuID,
    FBname:req.body.FBname
  };
    console.log('data', data.FBuID)

  // Get a Postgres client from the connection pool
  // if user exists in the db it won't create a new user and fetch it's user ID
  db.task(function(t) {
    return t.oneOrNone('SELECT id FROM users WHERE FBuID=${FBuID}', data)
    .then(function(userID){
      if(userID){
        res.send(userID)
      }else{

        // if user doesn't exist in the db a new one will be created
        return t.one('INSERT INTO users(email, phoneNumber, FBuID, FBname) values(${email}, ${phoneNumber}, ${FBuID}, ${FBname}) returning id', data)
      }
    })
    .catch(function(error){
      console.log('error', error)
    })
    .then(function(userID){
      res.send(userID)
    });
  });
}

// CREATE A SINGLE USER
//curl --data "email=juju@test.com2&phoneNumber=415-111-111&FBuID=jujupw&userName=AdminJuJu" http://127.0.0.1:3000/api/users

//READ GET ALL USERS
function usersGet(req, res) {

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
}

//READ GETT ONE SINGLE USER
function userOneUserInfo (req, res){
  var results = [];
  var id = req.params.user_id;

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
}
//UPDATE A SINGLE USER
//curl -X PUT --data "email=test@test.com&phoneNumber=510-111-1111&FBuID=jujupw&userName=JuJu" http://127.0.0.1:3000/api/users/1
function userUpdate(req, res) {

  var results = [];

  // Grab data from the URL parameters
  var id = req.params.user_id;

  // Grab data from http request
  var data = {email: req.body.email, phoneNumber: req.body.phonenumber, FBuID:req.body.FBuID, userName:req.body.username};

  // Get a Postgres client from the connection pool
  pg.connect(connectionString, function(err, client, done) {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).send(json({ success: false, data: err}));
    };

    // SQL Query > Update Data
    client.query('UPDATE users SET email=($1), phoneNumber=($2)  WHERE id=($3)', [data.email, data.phoneNumber, id]);

    // SQL Query > Select Data
    var query = client.query('SELECT * FROM users ORDER BY id ASC');

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
}
module.exports = router;
