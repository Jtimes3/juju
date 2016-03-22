var connectionString = require('./../db/config/init');
var pg = require('pg');
var pgp = require('pg-promise')(/*options*/)
var db = pgp(connectionString);

module.exports = {
  toNotifyGet : function (req, res){
    var results = {email:[], text:[]};

    pg.connect(connectionString, function(err, client, done) {
      if (err) {
        done();
        console.log(err);
        return res.status(500).json({
          success: false,
          data: err});
      }

      var query = client.query('SELECT users.*, items.*, watcheditems.* FROM watcheditems JOIN items ON items.id=watcheditems.itemid JOIN users ON users.id=watcheditems.userid WHERE watcheditems.pricereached=true AND watcheditems.emailed=false;');
      query.on('row', function(row) {
        if(row.contactpref==='text'){
          results.text.push(row)
        } else {
         results.email.push(row); 
        }
        
      });

      query.on('end', function() {
        done();
        return res.json(results);
      });
    });
  },

  toNotifyUpdate: function(req, res){
    pg.connect(connectionString, function(err, client, done){
      if(err){
        done();
        console.log(err);
        return res.status(500).json({
          success: false,
          data: err});
      }
      var data = {id: req}
      var query=client.query('UPDATE watcheditems SET emailed=True WHERE id=$1', [data.id]);

       query.on('row', function(row) {
        if(row.contactpref==='text'){
          res.text.push(row)
        } else {
         res.email.push(row); 
        }
        
      });

      query.on('end', function() {
        done();
        return;
      });

    })
  }
}

//function updateWatchedItems(req, res)
