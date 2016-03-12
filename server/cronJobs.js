var CronJob = require('cron').CronJob;
var seconds = 0;
// James: I deleted the line below without knowing if it'll break the code
// var scrapTools.... ?

exports.test = function (){
  return new CronJob('00 * * * * *' , function () {
    console.log('Yo its been min');
  },
  function (){
    console.log('called from jobstop');
  }, true, 'America/Los_Angeles');
};

exports.min = function () {
  new CronJob('00 * * * * *', function () {
    seconds++;
    console.log('yo its been '+ seconds);
  },
  function(){
    console.log('beep');
  }, true, 'America/Los_Angeles');
};
