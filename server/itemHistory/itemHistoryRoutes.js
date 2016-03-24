var itemHistoriesController = require('./itemHistoriesController');

module.exports = function (router) {
  router.post('/', itemHistoriesController.itemHistoryPost);
  router.get('/', itemHistoriesController.allItemsHistoryGet);
  router.get('/item/:itemID', itemHistoriesController.itemHistoryGet);
  router.get('/user/:userId', itemHistoriesController.userItemHistoryGet);
};
