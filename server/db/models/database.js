var express = require('express');
var router = express.Router();
var pg = require('pg');
var pgp = require('pg-promise')(/*options*/)
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/juju';
var db = pgp(connectionString);

// var client = new pg.Client(connectionString);
// client.connect();
// var query = client.query('CREATE TABLE items(id SERIAL PRIMARY KEY, text VARCHAR(40) not null, complete BOOLEAN)');
// query.on('end', function() {

//   console.log('hello bitches')
//   client.end(); });

router.post('/api/users', function(req, res) {
  var results = [];
  console.log('req', req.body)
  
  // Grab data from http request
  var data = {
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    FBuID:req.body.FBuID,
    userName:req.body.userName
  };
    console.log('data', data.FBuID)

  // Get a Postgres client from the connection pool
  db.task(function(t) {
    return t.oneOrNone('SELECT id FROM users WHERE FBuID=${FBuID}', data)
    .then(function(userID){
      if(userID){
        res.send(userID)
      }else{
        return t.one('INSERT INTO users(email, phoneNumber, FBuID, userName) values(${email}, ${phoneNumber}, ${FBuID}, ${userName}) returning id', data)
      }
    })
    .catch(function(error){
      console.log('error', error)
    })
    .then(function(userID){
      res.send(userID)
    });
  });
});


// CREATE A SINGLE USER
//curl --data "email=juju@test.com2&phoneNumber=415-111-111&FBuID=jujupw&userName=AdminJuJu" http://127.0.0.1:3000/api/users


//READ GET ALL USERS
router.get('/api/users', function(req, res) {

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
});

//UPDATE A SINGLE USER
//curl -X PUT --data "email=test@test.com&phoneNumber=510-111-1111&FBuID=jujupw&userName=JuJu" http://127.0.0.1:3000/api/users/1
router.put('/api/users/:user_id', function(req, res) {

  var results = [];

  // Grab data from the URL parameters
  var id = req.params.user_id;

  // Grab data from http request
  var data = {email: req.body.email, phoneNumber: req.body.phoneNumber, FBuID:req.body.FBuID, userName:req.body.userName};

  // Get a Postgres client from the connection pool
  pg.connect(connectionString, function(err, client, done) {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).send(json({ success: false, data: err}));
    };

    // SQL Query > Update Data
    client.query('UPDATE users SET email=($1), phoneNumber=($2), FBuID=($3), userName=($4) WHERE id=($5)', [data.email, data.phoneNumber, data.FBuID, data.userName, id]);

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
});

module.exports = router;
