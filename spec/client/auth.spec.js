describe('Authentication operations', function(){
  var $scope;
  var $rootScope;
  var Auth;
  var createController;
  var $controller;

  beforeEach(module('juju'));
  beforeEach(inject(function ($injector) {
    $controller = $injector.get('$controller');
    $rootScope = $injector.get('$rootScope');
    $scope = $rootScope.$new();
    Auth = $injector.get('Auth');

    createController = function() {
      return $controller('fbAuthCtrl', {
        $scope: $scope,
        Auth: Auth
      });
    };
    createController();
  }));

  describe('fbAuthCtrl', function(){

    it('facebookLogin function is defined', function(){
      expect($scope.facebookLogin).toBeDefined();
    });

    it('has a facebookLogin function', function(){
      expect(typeof $scope.facebookLogin).toBe('function');
    });

    it('facebookLogin function is defined', function(){
      expect($scope.facebookLogOut).toBeDefined();
    });

    it('has a facebookLogOut function', function(){
      expect(typeof $scope.facebookLogOut).toBe('function');
    });
  });

  describe('authFactory', function(){
    it('returns an object', function(){
      expect(Auth).toBeDefined();
      expect(typeof Auth).toBe('object');
      expect(typeof Auth.isloggedIn).toBe('function');
    });
  });
});
