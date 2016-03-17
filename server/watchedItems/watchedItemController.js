var watched = require('./watchedItemModel.js');
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

module.exports = {
  
  addWatchedItem : function (req, res) {
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
  },
  
  getAllWatchedItems: function (req,res){
    var results = [];

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
      // Handle connection errors
      if(err) {
        done();
        // console.log(err);
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
  },
  
  updateWatchedItem: function (req,res) {
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
    
  },
  
  deleteWatchedItem: function (req, res) {
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
  },
  
  joinTable: function (req, res){
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
  }
  
  
  
}