angular.module('authFactory', [])

.factory('Auth', function ($window, $http){
  var loggedIn;
  var authFuncs={};
  var data;

  authFuncs.isloggedIn = function () {
    loggedIn = $window.localStorage.getItem('firebase:session::jtimes3');

    // returns a boolean value of whether or not logged in is defined
    return !!loggedIn;
  };

  authFuncs.logOut = function () {
    $window.localStorage.removeItem('firebase:host:jtimes3.firebaseio.com');
    $window.localStorage.removeItem('firebase:session::jtimes3');
    loggedIn=$window.localStorage.getItem('firebase:session::jtimes3');

    return $window.localStorage.removeItem('firebase:session::jtimes3');
  };

  authFuncs.userId = 'test';

  authFuncs.addUserToDB =function (authData){
    data = {
      FBuID : authData.facebook.id,
      userName : authData.facebook.displayName
    };
    //edge case, what if someone changes their display name?
    console.log('sending post from client route');

    return $http({
      method: 'POST',
      url: 'api/users',
      data: data
    }).then(function successCallback(response) {
      authFuncs.userId=response.data[0].id;
      console.log(authFuncs.userId);
    });
  };

  return authFuncs
});
