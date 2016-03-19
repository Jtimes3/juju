var usersController = require('./usersController');

module.exports = function(router){
  router.post('/', usersController.usersPost);
  router.get('/', usersController.usersGet);
  router.get('/:user_id', usersController.userOneUserInfo);
  router.put('/:user_id', usersController.userUpdate);
}


