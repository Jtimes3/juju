var CronJob = require('cron').CronJob;
var Promise = require("bluebird");
var request = Promise.promisifyAll(require("request"));
var requestMultiArg = Promise.promisifyAll(require("request"), {multiArgs: true});
var scrapeTool = require('./scraping.js');

module.exports = {
  itemHistory : function (){
    var allItems;
    new CronJob('01 01-60 * * * *' , function () {
      //console.log('ppooop');
      request.getAsync('http://localhost:3000/api/items')
      .then(function(res){
        //console.log('res', res.body);

        var items = JSON.parse(res.body);
        return items;
      })
      .then(function(items){

        //create an array to push the reulst objs to
        var resultArray = [];
        Promise.each(items, function(item){
          // console.log('item: ', item);
          //do scrape request in here
          var options = {
            url: 'http://localhost:3000/scrape',
            method: 'POST',
            form: {'url': item.itemurl}
          }

          return requestMultiArg.postAsync(options).then(function(response, body){
            console.log('inside each - response.body', response.body)

            if(response.statusCode===200){
              var price=response.body.price;
            }
            //push obj containing currentprice and item id to resultArray
            var pushResults = {id: item.id, currentPrice: price}
            // console.log('push results: ', pushResults);
            resultArray.push(pushResults)
          })
        })
        // console.log(resultArray.length)
        // return resultArray;
      })



      .then(function(items){
        // console.log('made it to here', items);
      })
      .catch(function(e){
        console.log('error', e);
      })
      // .then(function(itemUrlArr){

      //   // building up req/res parameters to inject in scrape function
      //   for(var i = 0; i < itemUrlArr.length; i++){
      //     var reqBodyUrl = {
      //       body: {
      //         url : itemUrlArr[i]
      //       }
      //     }
      //     scrapeTool.scrape(reqBodyUrl);
      //   }
      // console.log(scrapeTool.scrape);
      //});
      // // check getAsync's callbacks or use callbacks to handle the async results
      // .then(function(err, res, body) {
      //   // console.log(JSON.parse(body));
      //   allItems = JSON.parse(body);
      //   // console.log(allItems);
      //   return allItems;
      // })
      // .then(function(items){
      //   console.log('hill', items);
      //   // return items;
      // });

      // add promise

      // console.log('look', typeof allItems);
      // allItems = Array.prototype.slice.call(allItems);


    },

    // function to run when job stops
    function (){
      console.log('job stopped.  Could be a cron jrob crash');
    }, true, 'America/Los_Angeles');
  },

  test : function () {
    var seconds = 0;
    new CronJob('00-60 * * * * *', function () {
      seconds++;
      console.log('It\'s been '+ seconds + ' seconds');
    },
    function(){
      console.log('job stopped');
    }, true, 'America/Los_Angeles');
  }
}

