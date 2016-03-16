var express = require('express');
var router = express.Router();
var pg = require('pg');
// var config = require('../../../config.js');
var connectionString = process.env.DATABASE_URL || config.connectionString;

// CREATE A WATCHED ITEM
//curl --data "deadline=2016-04-01&idealPrice=7000&settlePrice=8000&priceReached=false&emailed=false&itemID=1&userID=1" http://127.0.0.1:3000/api/v1/watcheditems
router.post('/api/v1/watcheditems', function(req, res) {

  var results = [];

  // Grab data from http request
  var data = {
    deadline: req.body.deadline,
    idealPrice: req.body.idealPrice,
    settlePrice: req.body.settlePrice,
    priceReached: req.body.priceReached,
    emailed: req.body.emailed,
    itemID: req.body.itemID,
    userID: req.body.userID
  };

  // Get a Postgres client from the connection pool
  pg.connect(connectionString, function(err, client, done) {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({ success: false, data: err});
    }

    // SQL Query > Insert Data

    client.query('INSERT INTO watchedItems(deadline, idealPrice, settlePrice, priceReached, emailed, itemID, userID) values($1, $2, $3, $4, $5, $6, $7)', [data.deadline, data.idealPrice, data.settlePrice, data.priceReached,data.emailed,data.itemID,data.userID]);
    //(routing)set up route to pass user info

    // SQL Query > Select Data
    var query = client.query('SELECT * FROM watchedItems ORDER BY id ASC');

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

//READ GET ALL watcheditems
router.get('/api/v1/watcheditems', function(req, res) {

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
    var query = client.query('SELECT * FROM watchedItems ORDER BY id ASC;');

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

//UPDATE A SINGLE WATCHEDITEM
//curl -X PUT --data "deadline=2016-04-01&idealPrice=$15.00&settlePrice=30.00&priceReached=false&emailed=false&itemID=32&userID=2" http://127.0.0.1:3000/api/v1/watcheditems/32
router.put('/api/v1/watchedItems/:watchedItem_id', function(req, res) {

  var results = [];

  // Grab data from the URL parameters
  var id = req.params.watchedItem_id;

  // Grab data from http request
  var data = {
    deadline: req.body.deadline,
    idealPrice: req.body.idealprice,
    settlePrice:req.body.settleprice,
    priceReached:req.body.pricereached,
    emailed: req.body.emailed,
    itemID: req.body.itemid,
    userID: req.body.userid};
console.log('hit server-side id',id ,'data',data);
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, function(err, client, done) {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).send(json({ success: false, data: err}));
    }

    // SQL Query > Update Data
    client.query('UPDATE watchedItems SET deadline=($1), idealPrice=($2), settlePrice=($3), priceReached=($4), emailed=($5)  WHERE id=($6)', [data.deadline, data.idealPrice, data.settlePrice, data.priceReached,data.emailed, id]);

    // SQL Query > Select Data
    var query = client.query('SELECT * FROM watchedItems ORDER BY id ASC');

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

//curl -X DELETE http://127.0.0.1:3000/api/v1/watchedItems/:watchedItem_id
router.delete('/api/v1/watchedItems/:watchedItem_id', function(req, res){
  var results = [];
  var id = req.params.watchedItem_id;

  pg.connect(connectionString, function(err, client, done){
    if(err){
      done();
      return res.status(500),json({
        success: false, data: err
      });
    }
    client.query('DELETE FROM watchedItems WHERE id=($1)',[id]);

    var query = client.query('SELECT * FROM watchedItems ORDER BY id ASC');

    query.on('row',function(row){
      results.push(row);
    });

    query.on('end',function(){
      done();
      return res.json(results);
    });
  });
});



router.get('/api/v1/watchedItems/user/:user_id', function (req, res){

  var results = [];
  var data = { userId: req.params.user_id } ;
  console.log(data)
  pg.connect(connectionString, function(err, client, done) {
    var query = client.query('SELECT * FROM items LEFT JOIN watcheditems ON items.id = watchedItems.itemID WHERE userid='+data.userId +'ORDER BY watcheditems.id ASC');

    query.on('row', function(row){
      results.push(row);
    });

    query.on('end', function() {
      done();
      console.log(results);
      return res.json(results);
    });
  });
});

module.exports = router;
