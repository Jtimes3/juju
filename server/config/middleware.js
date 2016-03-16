var morgan = require('morgan');
var bodyParser = require('body-parser');
var path = require('path');

module.exports = function (app, express) {
  var router = require('../db/models/users');
  var itemRouter = express.Router();
  var itemHistoryRouter = express.Router();
  var watched = require('../db/models/watchedItems');
  var scrapeTools  = require('../scraping.js');

  app.use(morgan('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended:true}));
  app.use(express.static(path.join(__dirname, './../../client')));
  app.use('/scripts', express.static(__dirname + './../../node_modules/'));

  app.use(router);
  app.use('/api/items', itemRouter);
  app.use('/api/itemHistory', itemHistoryRouter);
  app.use('/scrape', scrapeTools.scrape);
  app.use(watched);

  require('./../items/itemRoutes.js')(itemRouter);
  require('./../itemHistory/itemHistoryRoutes.js')(itemHistoryRouter);
};

