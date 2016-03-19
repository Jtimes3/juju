angular.module('juju.item', [])
.controller('itemsCtrl', function($scope, Item, Auth, $state, displayItemsFactory){
  $scope.item={};
  //$scope.item.id;
  Auth.isloggedIn()
  $scope.item.userId = Auth.userId;

  console.log('$scope.item.userId ' ,Auth.userId)
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
          //console.log('success response: ', response)
        }
      }, function errorCallback(response){
        console.log("error response", response)
        
      })
    }
  }, 400));
  $scope.addItem = function(){
    $scope.loading = true;
    if($scope.item.currentPrice === undefined || $scope.item.imageUrl === undefined){
      console.log('scrape wasn\' called')
      Item.scrapePriceInfo($scope.item)
      .then(function successCallback(response){
        console.log('scrape after add item' , response);
        $scope.item.imageUrl=response.data.picture;
        $scope.item.currentPrice=response.data.price;
        $scope.item.productTitle = response.data.productTitle;
        console.log('scope.item is ' , $scope.item);
        if(Item.checkAbleTosend($scope.item)) {
          Item.addItemToDB($scope.item)
          .then(function successCallback(response) {
            console.log('omg we made it')
            $state.go('items');
          }, function errorCallback(response){
          console.log(response);
          })
        }
      })
    } else {
      console.log('item is $scope.item',$scope.item)
      if(Item.checkAbleTosend($scope.item)) {
        console.log($scope.item)
        Item.addItemToDB($scope.item)
        .then(function successCallback (response) {
          console.log('add item response', response)
          $state.go('items')
        },
        function errorCallbac(response) {
          console.log(response)
        });
      }
    }
  };
  // $scope.displayItems = function() {
  //   console.log('Auth.userId', Auth.userId);
  //   displayItemsFactory.getItemData(Auth.userId.toString()).then(
  //     function successCallback(response){
  //       console.log(response);
  //       $scope.itemData = response.data;
  //     }, function errorCallback(err){
  //       console.log(err);
  //       $scope.err = 'There was a problem loading your data';
  //     });
  // };
});

