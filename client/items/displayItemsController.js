angular.module('displayItemsController', [])

.controller('displayItemsController', function ($scope,displayItemsFactory){
  displayItemsFactory.getItemData(1).then(
    function successCallback(response){
      console.log(response);
      $scope.itemData = response.data;
    }, function errorCallback(err){
      console.log(err);
      $scope.err = "There was a problem loading your data";
    })
})
