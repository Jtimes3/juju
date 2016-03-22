angular.module('juju.item', [])
.controller('itemsCtrl', function($scope, Item, Auth, $state, displayItemsFactory){
  $scope.item={};
  //$scope.item.id;
  Auth.isloggedIn()
  $scope.item.userId = Auth.userId;

  $scope.item.createdDate=new Date();
  $scope.item.currentPrice;
  $scope.item.imageUrl;
  $scope.item.productTitle;

  $scope.loading = false;
  var ableTosend = false;

  $scope.$watch('item.URL', _.debounce(function(newValue, oldValue){
    if(newValue){
      Item.scrapePicture(newValue).then(function successCallback(response) {
        if(response.data === 'not a site'){
          alert("Not a usable site");
        }else{
          $scope.item.imageUrl= response.data.picture;
          $scope.item.currentPrice = response.data.price;
          $scope.item.productTitle = response.data.productTitle;
        }
      }, function errorCallback(response){
        console.log("error response", response)
      })
    }
  }, 400));
  $scope.addItem = function(){
    $scope.loading = true;
    if($scope.item.currentPrice === undefined || $scope.item.imageUrl === undefined){
      Item.scrapePriceInfo($scope.item)
      .then(function successCallback(response){
        $scope.item.imageUrl=response.data.picture;
        $scope.item.currentPrice=response.data.price;
        $scope.item.productTitle = response.data.productTitle;
        if(Item.checkAbleTosend($scope.item)) {
          Item.addItemToDB($scope.item)
          .then(function successCallback(response) {
            $state.go('items');
          }, function errorCallback(response){
          })
        }
      })
    } else {
      if(Item.checkAbleTosend($scope.item)) {
        Item.addItemToDB($scope.item)
        .then(function successCallback (response) {
          $state.go('items')
        },
        function errorCallbac(response) {
        });
      }
    }
  };
});

