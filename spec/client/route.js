describe('routes', function(){
  beforeEach(module('juju'));

  var state;
  describe('landing page route', function(){
    it('has the correct URL', inject(function($state){
      // state object has many more properties we can test
      state = $state.get('landing');
      expect(state.url).toEqual('/landing');
    }));

    it('renders the correct template', function(){
      expect(state.views.header.templateUrl).toEqual('./layout/header.html');
    });

    // TODO: test route params (ex: items/1);
  });

  describe('item route', function(){
    beforeEach(inject(function($state){
      state = $state.get('items');
    }));

    it('has the correct URL', function(){
      expect(state.url).toEqual('/yourItems');
    });

    it('must be authenticated user to view page', function(){
      expect(state.authenticate).toEqual(true);
    });
  });

  describe('addItem route', function() {
    beforeEach(inject(function($state){
      state = $state.get('additems');
    }));

    it('has the correct URL', function(){
      expect(state.url).toEqual('/additems');
    });

    it('must be authenticated view page', function(){
      expect(state.authenticate).toEqual(true);
    });
  });
});
