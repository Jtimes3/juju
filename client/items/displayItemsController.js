angular.module('displayItemsController', [])
.controller('displayItemsCtrl', function ($scope, displayItemsFactory, Auth, $uibModal){
  //console.log('userId from displayItemsCtrl', Auth.userId);
  var user;
  Auth.isloggedIn()
  .then( function successCallback (userId) {
    $scope.user = userId;
    return displayItemsFactory.getItemData(userId)
  }, function errorCallback (err) {
  })
  .then(
    function successCallback(response) {
      var allItems = response.data;
      var numberofItems = response.data.length - 1;
      $scope.itemData = allItems.slice(0,6);

      $scope.loadMoreItems = function(){
        var last = $scope.itemData.length - 1;
        if(numberofItems > last){
          for (var i = 0; i <= 1; i++){
            $scope.itemData.push(allItems[last + i]);
          }
        }
      };
    }, function errorCallback(err) {
      $scope.err = 'There was a problem loading your data';
    })
  .then(
    function successCallback(response) {
      return displayItemsFactory.getItemHistoryData($scope.user)
    })
  .then(
    function successCallback(response) {
      $scope.itemHistoryData = displayItemsFactory.organizeData(response.data);
    });

  $scope.update = function (itemId , itemObj) {
    displayItemsFactory.updateData(itemId, itemObj);
  };

  $scope.deleteWatched = function(itemId){

    displayItemsFactory.deleteData(itemId);
  };

  $scope.itemHistory = function () {
      displayItemsFactory.getItemHistoryData($scope.user)
    .then( function successCallback (data) {
      $scope.ItemHistoryData = data;
    })
  }
  $scope.ok = function () {
    $uibModalInstance.close('hello');
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };
  $scope.open = function (nikename) {
    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'myModalContent.html',
      backdrop : false,//'/scripts/angular-ui-bootstrap/template/modal/backdrop.html',
      controller: 'ModalInstanceCtrl',
      //size: size,
      windowTemplateUrl : '/scripts/angular-ui-bootstrap/template/modal/window.html',
    //  scope: $scope.item = size ,
      resolve: {
        simpleObj : {value: nikename , itemHistory: $scope.itemHistoryData}
      }
    });

  };

})
.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, Auth , displayItemsFactory , simpleObj) {
  $scope.itemid = simpleObj.value;
  $scope.itemHistoryData = simpleObj.itemHistory;
  $scope.lackofData = false;
  $scope.errMessage = false;

  if($scope.itemHistoryData[$scope.itemid].priceGraph[0][0].length<4){
    $scope.lackofData = true;
    $scope.errMessage = true;
  }

  $scope.ok = function () {
    $uibModalInstance.close();
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
