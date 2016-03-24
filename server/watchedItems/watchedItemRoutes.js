var watchedItemController = require('./watchedItemController');

module.exports = function (router) {
  router.post('/', watchedItemController.addWatchedItem);
  router.get('/',watchedItemController.getAllWatchedItems);
  router.put('/:watchedItem_id',watchedItemController.updateWatchedItem);
  router.delete('/:watchedItem_id',watchedItemController.deleteWatchedItem);
  router.get('/user/:user_id', watchedItemController.getUserWatchedItems);
};

