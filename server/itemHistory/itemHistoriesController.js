var express = require('express');
var router = express.Router();
var pg = require('pg');
// var config = require('../../config.js');
var connectionString = process.env.DATABASE_URL || config.connectionString;

module.exports = {
  itemHistoryGet : function(req, res){
    var results = [];
    pg.connect(connectionString, function(err, client, done) {
      if (err) {
        done();
        console.log(err);
        return res.status(500).json({
          success: false,
          data: err});
      }

      var query = client.query('SELECT * FROM itemhistories WHERE itemid=($1) ORDER BY checkdate ASC;', [req.params.itemID]);

      query.on('row', function(row) {
        results.push(row);
      });

      query.on('end', function() {
        done();
        return res.json(results);
      });
    });
  },

  // CREATE A ITEM HISTORY
  //curl --data "price=10&checkDate=2016-03-08&itemID=1" http://127.0.0.1:3000/api/histories
  itemHistoryPost : function(req, res) {
    var results = [];

    // Grab data from http request
    var data = {
      price: req.body.price,
      checkDate: req.body.checkDate,
      itemID: req.body.itemID
    };

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
      // Handle connection errors
      if (err) {
        done();
        console.log(err);
        return res.status(500).json({
          success: false,
          data: err});
      }

      // SQL Query > Insert Data
      client.query('INSERT INTO itemHistories(price, checkDate, itemID) values($1, $2, $3)', [data.price, data.checkDate, data.itemID]);

      // SQL Query > Select Data
      var query = client.query('SELECT * FROM itemHistories ORDER BY id ASC');

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

  //READ GET ALL HISTORIES
  allItemsHistoryGet : function(req, res) {
    var results = [];

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
      // Handle connection errors
      if (err) {
        done();
        console.log(err);
        return res.status(500).json({
          success: false,
          data: err});
      }

      // SQL Query > Select Data
      var query = client.query('SELECT * FROM itemHistories ORDER BY id ASC;');

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
}

