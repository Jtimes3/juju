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
      return $controller('itemsCtrl', {
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

    it('has checkAbleTosend method', function () {
      expect(typeof Item.checkAbleTosend).toBe('function');
    });

    it('checkAbleTosend returns false if any undefined properties on object', function () {
      var item = {};
      item.currentPrice;
      expect(Item.checkAbleTosend(item)).toBe(false);
    })

    it('checkAbleTosend returns true if currentPrice is a number in string form', function () {
      var sampleItem = {
      currentPrice : '76',
      imageUrl : 'String',
      productTitle : 'String',
      userId : 'String'
      }
      expect(Item.checkAbleTosend(sampleItem)).toBe(true)
    })

  });

  describe('Item Controller', function(){
    it('should have add item function', function(){
      expect(typeof $scope.addItem).toBe('function');
    });
  });
});
