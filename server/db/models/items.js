var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/juju';
var pgp = require('pg-promise')(/*options*/)
//var connectionString = process.env.DATABASE_URL || 'postgres://Madison:poop@localhost:5432/juju';
var db = pgp(connectionString);
// CREATE A SINGLE ITEM
//curl --data 'name=photo&itemUrl=www.photo.com&itemImageUrl=www.photo.com&currentPrice=9000' http://127.0.0.1:3000/api/v1/items
 // After all data is returned, close connection and return results
router.post('/api/additems', function(req, res) {
  var results = [];
  console.log('****req', req.body)
  // Grab data from http request
    var data = {
        name: req.body.itemNickName, 
        itemUrl: req.body.itemUrl, 
        itemImageUrl:req.body.itemImageUrl, 
        currentPrice:req.body.currentPrice,
        idealPrice : req.body.idealPrice,
        createdDate : req.body.createdDate,
        userId : req.body.userId
    };
  
  // Get a Postgres client from the connection pool
    db.task(function(t) {
    return t.oneOrNone('SELECT id FROM items WHERE itemUrl=${itemUrl}', data)
    .then(function(itemID){
      if(itemID){
        data.itemId=itemID.id;
        t.one('INSERT INTO watchedItems(idealPrice, priceReached, emailed, itemID, userID) values (${idealPrice}, false, false, ${itemId}, ${userId})', data)
        res.send(itemID)
      } else {
        return t.one('INSERT INTO items(name, itemUrl, itemImageUrl, currentPrice) values(${name}, ${itemUrl}, ${itemImageUrl}, ${currentPrice}) returning id', data)
      }
      })
    .then(function(itemID){
      data.itemId=itemID.id
      return t.one('INSERT INTO watchedItems(idealPrice, priceReached, emailed, itemID, userID) values (${idealPrice}, false, false, ${itemId}, ${userId}) returning id', data)
    })
    .then(function(id){
      return t.one('INSERT INTO itemHistories(price, checkDate, itemID) values (${currentPrice}, ${createdDate}, ${itemId}) returning id', data)
    })
    .then(function(data){
      res.send(data)
    })
    .catch(function(error){
      res.send(error)
    })
  });

});

//READ GET ALL ITEMS
router.get('/api/v1/items', function(req, res) {

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
    var query = client.query('SELECT * FROM items ORDER BY id ASC;');

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

//UPDATE A SINGLE ITEM
//curl -X PUT --data 'name=test@test.com&itemUrl=510-111-1111&itemImageUrl=jujupw&currentPrice=JuJu' http://127.0.0.1:3000/api/v1/items/1
router.put('/api/v1/items/:item_id', function(req, res) {

  var results = [];

  // Grab data from the URL parameters
  var id = req.params.item_id;

  // Grab data from http request
  var data = {name: req.body.name, itemUrl: req.body.itemUrl, itemImageUrl:req.body.itemImageUrl, currentPrice:req.body.currentPrice};

  // Get a Postgres client from the connection pool
  pg.connect(connectionString, function(err, client, done) {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      // james:  does json kick any errors?
      return res.status(500).send(json({ success: false, data: err}));
    }

    // SQL Query > Update Data
    client.query('UPDATE items SET email=($1), phoneNumber=($2), password=($3), userName=($4) WHERE id=($5)', [data.name, data.itemUrl, data.itemImageUrl, data.currentPrice, id]);

    // SQL Query > Select Data
    var query = client.query('SELECT * FROM items ORDER BY id ASC');

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
