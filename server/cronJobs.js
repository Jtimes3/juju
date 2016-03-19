var CronJob = require('cron').CronJob;
var Promise = require("bluebird");
var request = Promise.promisifyAll(require("request"));
var requestMultiArg = Promise.promisifyAll(require("request"), {multiArgs: true});

var pgp = require('pg-promise')(/*options*/);
var connectionString = require('./db/config/init');
var db = pgp(connectionString);

var sendSMSController = require('./notifications/sendSMSController.js');
var sendEmailController = require('./notifications/sendEmailController.js');
var scrapeTool = require('./scraping.js');

module.exports = {
  itemHistory : function (){
    var allItems;
    new CronJob('01 01-60 * * * *' , function () {
      request.getAsync('http://localhost:3000/api/items')
      .then(function(res){
        var items = JSON.parse(res.body);

        return items;
      })
      .then(function(items){
        return Promise.map(items, function(item){
          var options = {
            url: 'http://localhost:3000/scrape',
            method: 'POST',
            form: {'url': item.itemurl}
          }

          return requestMultiArg.postAsync(options)
        })
        .then(function(responseArray){
          // TODO: add currentDate function
          var currentDate = ///function

          Promise.each(responseArray, function(resp){
            var res = JSON.parse(resp.body);
            db.tx(function(t){
              return t.one("UPDATE items SET currentPrice=${price} WHERE items.itemUrl = ${productUrl} returning id", res)
              .then(function(itemID){
                res.itemID = itemID.id;
                res.currentDate = '2016-04-19';
                return t.one("INSERT INTO itemhistories (itemid, price, checkdate) VALUES (${itemID}, ${price}, ${currentDate}) returning id", res)
              })
              .catch(function(err){
                console.log(err);
              })
              .then(function(id){
                console.log('our id: ', id);
              })
            });
          });
          return responseArray;
        })
      })
      .catch(function(e){
        console.log('error', e);
      })
    },

    function (){
      console.log('job stopped.  Could be a cron jrob crash');
    }, true, 'America/Los_Angeles');
  },

  watchedItems : function() {
    new CronJob('00-60 * * * * *' , function () {
      db.task(function(t){
        return t.many("UPDATE watcheditems SET pricereached=true FROM items WHERE watcheditems.itemid=items.id AND items.currentprice <= watcheditems.idealprice;");
      })
      console.log('ran cron job: watchedItems');
    },
    function(){
      console.log('job stopped');
    }, true, 'America/Los_Angeles');
  },

  sendNotifications : function() {
    new CronJob('01 01-60 * * * *',  function(){
    request.getAsync('http://localhost:3000/api/notifications')
      .then(function(res){
        var updateWatchedArr=[];
        //console.log('res.body', res.body)
        // res will be an object containing 2 arrays
        var toNotify = JSON.parse(res.body);
        var toTextArr = toNotify.text;
        //console.log('text', toTextArr);
        var toEmailArr = toNotify.email;
        //console.log('email', toEmailArr);

        // Promise.each(toEmailArr, function(toEmail){
        //   sendEmailController.sendEmailMessage(toEmail);
        //   updateWatchedArr.push(toEmail.id);

        // });

        Promise.each(toTextArr, function(toText){
          //sendSMSController.sendTextMessage(toText);
          updateWatchedArr.push(toText.id);
        });
      return updateWatchedArr;
      })
      .then(function(updateArr){
        console.log(updateArr)
      })
    }, function(){
      console.log('job stopped');
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
