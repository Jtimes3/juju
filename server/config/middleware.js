var morgan = require('morgan');
var bodyParser = require('body-parser');
var path = require('path');

module.exports = function (app, express) {
  var userRouter = express.Router();
  var itemRouter = express.Router();
  var itemHistoryRouter = express.Router();
  var watchedItemRouter = express.Router();
  var notificationsRouter = express.Router();
  var scrapeTools  = require('../scraping.js');

  app.use(morgan('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended:true}));
  app.use(express.static(path.join(__dirname, './../../client')));
  app.use('/scripts', express.static(__dirname + './../../node_modules/'));

  app.use('/api/users', userRouter);
  app.use('/api/items', itemRouter);
  app.use('/api/notifications', notificationsRouter);
  app.use('/api/itemHistory', itemHistoryRouter);
  app.use('/api/watcheditems', watchedItemRouter);
  app.use('/scrape', scrapeTools.scrape);

  require('./../users/userRoutes.js')(userRouter);
  require('./../items/itemRoutes.js')(itemRouter);
  require('./../itemHistory/itemHistoryRoutes.js')(itemHistoryRouter);
  require('./../watchedItems/watchedItemRoutes.js')(watchedItemRouter);
  require('./../notifications/notificationsRouter.js')(notificationsRouter);
};

