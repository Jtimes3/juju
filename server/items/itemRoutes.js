var itemsController = require('./itemsController');

module.exports = function (router) {
  router.post('/', itemsController.addItem);
  router.get('/', itemsController.getAllItems);
  router.get('/categories/:user_id', itemsController.getUserCategories);
  //router.put('/:item_id', itemsController.updateItem);
};
