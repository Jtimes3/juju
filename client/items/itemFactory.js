angular.module('itemFactory', [])
.factory('Item', function(Auth, $http){
  var addItemFuncs ={};
  var userId = Auth.userId;
  //pull in user info from the auth factory
  addItemFuncs.addItemToDB =function (itemInfo){
    data={
      itemNickName : itemInfo.nickName,
      productTitle : itemInfo.productTitle,
      itemUrl : itemInfo.URL,
      itemImageUrl : itemInfo.imageUrl,
      currentPrice : itemInfo.currentPrice,
      idealPrice : itemInfo.idealPrice,
      createdDate : itemInfo.createdDate.toDateString(),
      userId : userId
    };

    return $http({
      method: 'POST',
      url: '/api/items',
      data: data
    });
  },

  addItemFuncs.scrapePriceInfo = function(itemInfo){
    data = {
      url : itemInfo.URL
    };

    return $http({
      method : 'POST',
      url : '/scrape',
      data : data
    }).then(function(response){
      console.log(response)
    });
  },

  addItemFuncs.scrapePicture = function (url){
    data = {
      url : url
    };

    return $http({
      method : 'POST',
      url : '/scrape',
      data: data
    });
  };

  addItemFuncs.checkAbleTosend = function (item) {
    var sampleItem = {
      productTitle : 'String',
      userId : 'String',
      currentPrice : 'String',
      imageUrl : 'String'
    }
    for(property in sampleItem){
      if(item[property] === undefined) {
        alert(property + ' is missing');
        return  false;
      }
    }
    if(parseInt(item['currentPrice'],10)===NaN){
      alert('could not get price')
      return false;
    }
    return true;
  }

  return addItemFuncs;
})
.factory('displayItemsFactory', function ($http){
  var displayItemsFactoryFuncts = {};
  displayItemsFactoryFuncts.getItemData = function(user){
    return $http({
      method : 'GET',//'POST',
      url : '/api/watchedItems/user/'+ user
    });
  };

  displayItemsFactoryFuncts.deleteData =
  function(watchedId){
    return $http({
      method : 'DELETE',
      url: '/api/watchedItems/'+watchedId
    });
  };
  
  displayItemsFactoryFuncts.updateData = function (watchedId, watchedObj) {
      return $http({
          method: 'PUT',
          url: '/api/watchedItems/'+watchedId,
          data: watchedObj
      })
  }

  return displayItemsFactoryFuncts;
})

