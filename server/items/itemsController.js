var Item = require('./itemModel.js');
var pg = require('pg');
var connectionString;

// handling DB connection for tests
if(process.env.NODE_ENV === 'test'){
  connectionString = 'postgres://localhost:5432/jujutestdb';
} else if(process.env.NODE_ENV !== 'test') {
  connectionString = process.env.DATABASE_URL || require('./../../config.js').connectionString;
}

var pgp = require('pg-promise')(/*options*/)
var db = pgp(connectionString);

//var connectionString = process.env.DATABASE_URL || 'postgres://Madison:poop@localhost:5432/juju';

module.exports = {
  // CREATE A SINGLE ITEM
  //curl --data 'name=photo&itemUrl=www.photo.com&itemImageUrl=www.photo.com&currentPrice=9000' http://127.0.0.1:3000/api/v1/items
  // After all data is returned, close connection and return results

  addItem : function (req, res) {
    var results = [];
    // Grab data from http request
    var data = {
      itemNickName: req.body.itemNickName,
      productTitle: req.body.productTitle,
      itemUrl: req.body.itemUrl,
      itemImageUrl:req.body.itemImageUrl,
      currentPrice:req.body.currentPrice,
      idealPrice : req.body.idealPrice,
      createdDate : req.body.createdDate,
      userId : req.body.userId
    };
    // Get a Postgres client from the connection pool
    db.task(function(t) {
      return t.oneOrNone('INSERT INTO items (productTitle, itemUrl, itemImageUrl, currentPrice) SELECT ${productTitle}, ${itemUrl}, ${itemImageUrl}, ${currentPrice} WHERE NOT EXISTS (SELECT 1 FROM items WHERE itemUrl=${itemUrl})', data)
      .catch(function(err){
        console.log('error adding item: ', err);
      })
      .then(function(){
        return t.oneOrNone('SELECT id FROM items WHERE itemUrl=${itemUrl}', data)
      })
      .catch(function(err){
        console.log('Item ID select error: ', err);
      })
      .then(function(itemID){
        data.itemId=itemID.id
        return t.one('INSERT INTO watchedItems(idealPrice, priceReached, emailed, nickName, itemID, userID) values (${idealPrice}, false, false, ${itemNickName}, ${itemId}, ${userId})', data)
      })
      .then(function(){
        return t.one('INSERT INTO itemHistories(price, checkDate, itemID) values (${currentPrice}, ${createdDate}, ${itemId}) returning id', data)
      })
      .then(function(itemHistoryID){
        res.send(itemHistoryID)
      })
      .catch(function(error){
        console.log('error adding item into watchedItems or itemHistories', error)
        res.send(error)
      })
    });
  },

  //READ GET ALL ITEMS
  getAllItems : function (req, res) {
    console.log('inside #getAllItems in items controller');

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

  },

  //UPDATE A SINGLE ITEM
  //curl -X PUT --data 'name=test@test.com&itemUrl=510-111-1111&itemImageUrl=jujupw&currentPrice=JuJu' http://127.0.0.1:3000/api/v1/items/1
  //  updateItem : function (req, res) {

  //   var results = [];

  //   // Grab data from the URL parameters
  //   var id = req.params.item_id;

  //   // Grab data from http request
  //   var data = {name: req.body.name, itemUrl: req.body.itemUrl, itemImageUrl:req.body.itemImageUrl, currentPrice:req.body.currentPrice};

  //   // Get a Postgres client from the connection pool
  //   pg.connect(connectionString, function(err, client, done) {
  //     // Handle connection errors
  //     if(err) {
  //       done();
  //       console.log(err);
  //       // james:  does json kick any errors?
  //       return res.status(500).send(json({ success: false, data: err}));
  //     }

  //     // SQL Query > Update Data
  //     client.query('UPDATE items SET email=($1), phoneNumber=($2), password=($3), name=($4) WHERE id=($5)', [data.email, data.phoneNumber, data.password, data.name, id]);

  //     // SQL Query > Select Data
  //     var query = client.query('SELECT * FROM items ORDER BY id ASC');

  //     // Stream results back one row at a time
  //     query.on('row', function(row) {
  //       results.push(row);
  //     });

  //     // After all data is returned, close connection and return results
  //     query.on('end', function() {
  //       done();
  //       return res.json(results);
  //     });
  //   });
  // }
}
