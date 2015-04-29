describe('CartStore', function() {
  var cartStore;

  beforeEach(function(){
    Dispatcher = new MeteorFlux.Dispatcher();
    cartStore  = new CartStore();
  });

  it('registers a callback with the dispatcher', function() {
    spyOn(Dispatcher, "register").and.callThrough();
    cartStore = new CartStore();
    expect(Dispatcher.register.calls.any()).toBeTruthy();
  });

  it('has a public token ID', function() {
    expect(cartStore.tokenId).toBeTruthy();
  });

  describe('on', function(){
  });

});
