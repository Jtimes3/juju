angular.module('authFactory', [])

.factory('Auth', function ($window, $http, $state){
  var loggedIn;
  var authFuncs={};
  var data;


  authFuncs.isloggedIn = function () {
    //make the the firebase data to an object to get fb data
    loggedIn = JSON.parse($window.localStorage.getItem('firebase:session::jtimes3'));
    if(!!loggedIn){
      //sends to database to get userId
      data = {
        FBuID : loggedIn.facebook.id,
        userName : loggedIn.facebook.displayName
      };
      
      return $http({
        method: 'POST',
        url: 'api/users',
        data: data
        }).then(function successCallback(response) {
        authFuncs.userId= response.data.id;
        
      })
    }
    return !!loggedIn;
  };

  authFuncs.logOut = function () {
    $window.localStorage.removeItem('firebase:host:jtimes3.firebaseio.com');
    $window.localStorage.removeItem('firebase:session::jtimes3');
    loggedIn=$window.localStorage.getItem('firebase:session::jtimes3');
    $state.go('login');
    return $window.localStorage.removeItem('firebase:session::jtimes3');  
  };


  authFuncs.addUserToDB =function (authData){
    data = {
      FBuID : authData.facebook.id,
      FBname : authData.facebook.displayName
    };
    //edge case, what if someone changes their display name?
    console.log('sending post from client route'); 
    return $http({
      method: 'POST',
      url: 'api/users',
      data: data
    }).then(function successCallback(response) {
      authFuncs.userId= response.data.id;
      console.log(authFuncs.userId);
      $state.go('additems');
    })
  };

  return authFuncs
});
