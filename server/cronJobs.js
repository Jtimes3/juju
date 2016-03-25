var CronJob = require('cron').CronJob;
var Promise = require("bluebird");
var request = Promise.promisifyAll(require("request"));
var requestMultiArg = Promise.promisifyAll(require("request"), {multiArgs: true});

var pgp = require('pg-promise')(/*options*/);
var connectionString = require('./db/config/init');
var db = pgp(connectionString);

var sendSMSController = require('./notifications/sendSMSController.js');
var sendEmailController = require('./notifications/sendEmailController.js');
var notificationController=require('./notifications/notificationController.js')
var scrapeTool = require('./scraping.js');

module.exports = {
  itemHistory : function (){
    console.log('in item history');
    var allItems;
       return request.getAsync('http://localhost:3000/api/items')
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
          var currentDate = function(){
            var today=new Date();
            var day = today.getDate();
            var month = today.getMonth() +1;
            var year = today.getFullYear();
            var todaysDate= year + '-' + month + '-' + day;
            return todaysDate;
          }

          Promise.each(responseArray, function(resp){
            var res = JSON.parse(resp.body);
            db.tx(function(t){
              return t.one("UPDATE items SET currentPrice=${price} WHERE items.itemUrl = ${productUrl} returning id", res)
              .then(function(itemID){
                res.itemID = itemID.id;
                res.currentDate = currentDate();
                return t.one("INSERT INTO itemhistories (itemid, price, checkdate) VALUES (${itemID}, ${price}, ${currentDate}) returning id", res)
              })
              .catch(function(err){
                console.log(err);
              })
              .then(function(id){
                return;
              })
            });
          })
          return responseArray;
        }).then(function(nothing){
          console.log('updating db')
          db.task(function(t){
            return t.many("UPDATE watcheditems SET pricereached=true FROM items WHERE watcheditems.itemid=items.id AND items.currentprice <= watcheditems.idealprice;");
          })
          return;

        })

      })
      .catch(function(e){
        console.log('error', e);
      })
  },


  sendNotifications : function() {
    console.log('in sendnotification');
    request.getAsync('http://localhost:3000/api/notifications')
      .then(function(res){
        // res will be an object containing 2 arrays
        var updateWatchedArr=[];
        var toNotify = JSON.parse(res.body);
        var toTextArr = toNotify.text;
        var toEmailArr = toNotify.email;
        for(var i=0; i<toTextArr.length; i++){
          var currWatchedID=toTextArr[i].id
          updateWatchedArr.push(currWatchedID)
        }
        for(var i=0; i<toEmailArr.length; i++){
          var currWatchedID=toEmailArr[i].id
          updateWatchedArr.push(currWatchedID)
        }

        Promise.each(toEmailArr, function(toEmail){
          sendEmailController.sendEmailMessage(toEmail);
        });

        Promise.each(toTextArr, function(toText){
          sendSMSController.sendTextMessage(toText);
        });
        console.log('update watched in sendnotification', updateWatchedArr)

      return updateWatchedArr;
      })
      .then(function(updateWatchedArr){
        Promise.each(updateWatchedArr, function(item){
          notificationController.toNotifyUpdate(item)
        });

      })
    
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
