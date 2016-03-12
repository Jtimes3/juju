var scrapeTools = require('./scraping.js')
var itemHistory=require('./db/models/itemHistories.js')
var watchItem=require('./db/models/watchedItems.js')
var addItem=require('./db/models/items.js')
var app = require('./index.js')
// var mock = require('./mockData.js');


module.exports = function (app) {
	app.get('/test', function (req, res) {
		res.send('hello');
	});
  app.post('/scrape',scrapeTools.scrape);

  app.get('/api/v1/watchedItems/dummy', function (req, res){
  //   res.send(mock);
  });
  // app.get('/api/users', function (req, res){
  // 	res.json(results);
  // })


  //app.post('api/v1/addItem', 
    //item post request
      //set item history flag to true if response is error due to item already existing
      //upon response send get request for item_id
      //use promises, upon response from item get request
        //watch item post request (with item_id and user_id)
        //if item history flag is false (doesnt yet exist)
          //item history post request

   // )


  // app.post('api/v1/addItem', function(req, res){
  //   console.log('made it bitches', req.body)
  // });
	// app.get('*', function (req, res) {
	// 	res.redirct('/');
	// });

};
