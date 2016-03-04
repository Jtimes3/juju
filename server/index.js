var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var path = require('path');

var app = express();
var port = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, '../client')));
//require('routes')(app);


app.listen(port);

console.log('Listening on port' + port);

module.exports = app;
