//var express = require('express');
//var router = express.Router();
var pg = require('pg');
var config = require('./../../config.js');
var connectionString; // = process.env.DATABASE_URL || config.connectionString;

// handling DB connection for tests
if(process.env.NODE_ENV === 'test'){
  connectionString = 'postgres://localhost:5432/jujuTestDB';
} else if(process.env.NODE_ENV !== 'test') {
  connectionString = process.env.DATABASE_URL || config.connectionString;
}


var pgp = require('pg-promise')(/*options*/)
var db = pgp(connectionString);


module.exports = {
  toNotifyGet : function (req, res){
    console.log('made it into toNotifyGet')
    var results = {email:[], text:[]};
    console.log('req', req.body)

    pg.connect(connectionString, function(err, client, done) {
      if (err) {
        done();
        console.log(err);
        return res.status(500).json({
          success: false,
          data: err});
      }

      var query = client.query('SELECT users.*, items.*, watcheditems.* FROM watcheditems JOIN items ON items.id=watcheditems.itemid JOIN users ON users.id=watcheditems.userid WHERE watcheditems.pricereached=true AND watcheditems.emailed=false;');
      //is it it better to split data up in the query or iterate through once it returns?
      query.on('row', function(row) {
        console.log('row', row)
        if(row.contactpref==='text'){
          results.text.push(row)
        } else {
         results.email.push(row); 
        }
        
      });

      query.on('end', function() {
        done();
        console.log('results', results)
        return res.json(results);
      });
    });
  }
}

//function updateWatchedItems(req, res)