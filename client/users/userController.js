angular.module('juju.user', [])
.controller('usersCtrl', function($scope, User, Auth){
  console.log('userCtrl Auth.userId',Auth.userId);
  User.getOneInfo(Auth.userId).then(
    function successCallback(res){
      $scope.userData = res.data[0];
    },function errorCallback(err){
      $scope.err = 'fail to load your data';
    });
  $scope.updateUserInfo = function(userId,userObj){
    console.log('clicked update + id',userId ,'obj :',userObj);
    User.updateOneInfo(userId,userObj);
  };
});
