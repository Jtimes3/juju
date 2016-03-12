describe('Add item factory', function(){
  var $scope;
  var $rootScope;
  var Item;
  var createController;
  var $controller;

  beforeEach(module('juju'));
  beforeEach(inject(function ($injector) {
    $controller = $injector.get('$controller');
    $rootScope = $injector.get('$rootScope');
    $scope = $rootScope.$new();
    Item = $injector.get('Item'); // this is okay

    createController = function() {
      return $controller('itemCtrl', {
        $scope: $scope,
        Item: Item
      });
    };
    createController();
  }));

  describe('Item Factory', function(){
    it('is defined', function(){
      expect(Item).toBeDefined();
    });

    it('returns an object', function(){
      expect(typeof Item).toBe('object');
    });

    // testing for only one method for now.  A passing test
    // should imply the rest of the methods are accessible
    it('has scrapePriceInfo method', function(){
      expect(typeof Item.scrapePriceInfo).toBe('function');
    });
  });

  describe('Item Controller', function(){
    it('should have poop', function(){
      expect($scope.test).toBe('poop');
    });

    it('should have add item function', function(){
      expect(typeof $scope.addItem).toBe('function');
    });
  });
});
