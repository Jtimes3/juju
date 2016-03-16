var itemsController = require('./itemsController');

module.exports = function (router) {
  router.post('/', itemsController.addItem);
  router.get('/', itemsController.getAllItems);
  //router.put('/:item_id', itemsController.updateItem);
};
