require('dotenv').config();
var CronJob = require('cron').CronJob;
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var cron = require('./cronJobs.js')
var app = express();
var router = express.Router();
var scrapeTools = require('./scraping.js');
var Promise = require('bluebird');

require('./config/middleware.js')(app, express);

var port = process.env.PORT;

//cron.watchedItems();
// TODO: write promise to schedule cron jobs correctly


function cronItemHistory(){
  new CronJob('01 01 02 01-31 * *' , function () {
    cron.itemHistory();

  },
  function (){
    console.log('job stopped.  Could be a cron job crash');
  }, true, 'America/Los_Angeles');
};


function cronUserNotify(){
  new CronJob('01 01 10 01-31 * *' , function () {
    cron.sendNotifications();

  },
  function (){
    console.log('job stopped.  Could be a cron jrob crash');
  }, true, 'America/Los_Angeles');
};

cronItemHistory();
cronUserNotify();

app.post('/scrape',scrapeTools.scrape);

app.listen(port);

console.log('Listening on port' + port);

module.exports = app;
