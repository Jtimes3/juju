angular.module('displayItemsController', [])
.controller('displayItemsCtrl', function ($scope, displayItemsFactory, Auth){
  //console.log('userId from displayItemsCtrl', Auth.userId);
  Auth.isloggedIn()
  .then( function successCallback (userId) {
    return displayItemsFactory.getItemData(userId)
  }, function errorCallback (err){
  })
  .then(
    function successCallback(response){
      console.log(response);
      $scope.itemData = response.data;
    }, function errorCallback(err){
      console.log(err);
      $scope.err = 'There was a problem loading your data';
    });
  $scope.update = function (itemId , itemObj) {
    // console.log('clicked', itemId, itemObj);
    displayItemsFactory.updateData(itemId, itemObj);
  };  
    
  $scope.deleteWatched = function(itemId){
    console.log('itemID',itemId);
    displayItemsFactory.deleteData(itemId);
  };
  // displayItemsFactoryFuncts.deleteData(item.id).then(function successCallback(response){
  //     console.log(response);
  //     $scope.itemData = response.data;
  //   }, function errorCallback(err){
  //     console.log(err);
  //     $scope.err = 'There was a problem loading your data';
  //   }
  // 	);
});
