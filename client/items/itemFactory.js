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
    for(property in item){
      if(!property){
        
        alert(property + 'is missing');
        return  false;
      }
    }
    if(Number(item.currentPrice)===NaN){
      alert('could not get price')
      return false
    }
    return true
  }

  return addItemFuncs;
})
.factory('displayItemsFactory', function ($http){
  var displayItemsFactoryFuncts = {};
  displayItemsFactoryFuncts.getItemData = function(user){
    return $http({
      method : 'GET',//'POST',
      url : '/api/v1/watchedItems/user/'+ user
    });
  };

  displayItemsFactoryFuncts.deleteData =
  function(watchedId){
    console.log('hit factory delte and id is',watchedId);
    return $http({
      method : 'DELETE',
      url: '/api/v1/watchedItems/'+watchedId
    });
  };
  
  displayItemsFactoryFuncts.updateData = function (watchedId, watchedObj) {
      console.log('hit factory update data', watchedId ,'data',watchedObj);
      return $http({
          method: 'PUT',
          url: '/api/v1/watchedItems/'+watchedId,
          data: watchedObj
      })
  }

  return displayItemsFactoryFuncts;
})

