var app = angular.module('juju', [
  'ui.router',
  'facebook',
  'authFactory',
  'displayItemsController',
  'itemFactory',
  'juju.item',
  'juju.user',
  'userFactory',
  'chart.js',
  'ui.bootstrap',
  'ui.bootstrap.tpls'
]);

app.config(function ($stateProvider, $urlRouterProvider){
  $urlRouterProvider.otherwise('/landing');

  $stateProvider
  .state('items', {
    url: '/yourItems',
    views: {
      'body' : {
        templateUrl:'./items/views/item.html',
        controller: 'displayItemsCtrl'
      },
      'header' : {
        templateUrl: './layout/header.html'
      }
    },
    authenticate: true
  })
  .state('items/aItem', {
    url: '/yourItems/item',
    templateUrl : './item/view/itemGraphModal.html',
    authenticate:true
  })
  .state('additems', {
    // TODO: change all references to additems -> trackitem
    // changing additem to trackitem for user experience.  This is only a 
    // temporary fix and the rest of the routes & associated reference need
    // to be changed
    url: '/trackitem',
    views : {
      'body' : {
        templateUrl:'./items/views/additem.html'
      },
      'header' : {
        templateUrl: './layout/header.html'
      }
    },
    controller: 'itemsCtrl',
    authenticate: true
  })
  .state('landing', {
    url: '/landing',
    views: {
      'header' : {
        templateUrl: './layout/header.html'
      },
      'body' : {
        templateUrl:'./layout/landing.html',
      }
    },
    controller: 'fbAuthCtrl'
  })
  .state('usersettings',{
    url: '/users',
    views: {
      'header': {
        templateUrl: './layout/header.html',
        controller: 'usersCtrl'
      },
      'body' : {
        templateUrl: './users/views/usersettings.html'
      }
    },
    authenticate: true
  })
  .state('about', {
    url: '/about',
    views: {
      'header' : {
        templateUrl: './layout/header.html'
      },
      'body' : {
        templateUrl: './layout/about.html'
      }
    }
  });
})
.run(function($rootScope, $state, Auth){
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams){
    if(!Auth.isloggedIn()  && toState.authenticate){
      event.preventDefault();
      $state.go('login');
    }
  });
});
