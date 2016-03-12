var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var path = require('path');
var cron = require('./cronJobs.js')

var app = express();
var port = process.env.PORT || 3000;

var router = require('./db/models/database');
var items = require('./db/models/items');
var histories = require('./db/models/itemHistories');
var watched = require('./db/models/watchedItems');

//cron.test();
//cron.min();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, '../client')));
app.use('/scripts', express.static(__dirname + '/../node_modules/'));
require('./routes.js')(app);

app.use(router);
app.use(items);
app.use(histories);
app.use(watched);

app.listen(port);

console.log('Listening on port' + port);

module.exports = app;
