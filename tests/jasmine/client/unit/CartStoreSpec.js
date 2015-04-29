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

    beforeEach(function(){
      spyOn(Meteor, 'call');
    });

    it('should add a cart item if it\'s not already one', function(){
      spyOn(Cart, 'findOne').and.returnValue(null);
      Dispatcher.dispatch({
        actionType: "ADD_CART_ITEM",
        item: { _id: 123 }
      });
      expect(Meteor.call).toHaveBeenCalledWith(
        'CartStore.addCartItem',
        123,
        jasmine.any(String)
      );
    });

    it('should increse a cart item quantity if it\'s already one', function(){
      spyOn(Cart, 'findOne').and.returnValue({ _id: 123 });
      Dispatcher.dispatch({
        actionType: "ADD_CART_ITEM",
        item: { _id: 123 }
      });
      expect(Meteor.call).toHaveBeenCalledWith(
        'CartStore.increaseCartItem',
        123
      );
    });

    it('should increse a cart item quantity', function(){
      Dispatcher.dispatch({
        actionType: "INCREASE_CART_ITEM",
        item: { _id: 123 }
      });
      expect(Meteor.call).toHaveBeenCalledWith(
        'CartStore.increaseCartItem',
        123
      );
    });

    it('should decrese a cart item quantity if more than 1', function(){
      spyOn(Cart, "findOne").and.returnValue({ quantity: 2 });
      Dispatcher.dispatch({
        actionType: "DECREASE_CART_ITEM",
        item: { _id: 123 }
      });
      expect(Meteor.call).toHaveBeenCalledWith(
        'CartStore.decreaseCartItem',
        123
      );
    });

    it('should remove a cart item if decreasing and quantity is 1', function(){
      spyOn(Cart, "findOne").and.returnValue({ quantity: 1 });
      Dispatcher.dispatch({
        actionType: "DECREASE_CART_ITEM",
        item: { _id: 123 }
      });
      expect(Meteor.call).toHaveBeenCalledWith(
        'CartStore.removeCartItem',
        123
      );
    });

    it('should remove a cart item', function(){
      Dispatcher.dispatch({
        actionType: "REMOVE_CART_ITEM",
        item: { _id: 123 }
      });
      expect(Meteor.call).toHaveBeenCalledWith(
        'CartStore.removeCartItem',
        123
      );
    });

    it('should remove a cart item if product is removed', function(){
      Dispatcher.dispatch({
        actionType: "REMOVE_PRODUCT",
        product: { _id: 123 }
      });
      expect(Meteor.call).toHaveBeenCalledWith(
        'CartStore.removeProduct',
        123
      );
    });

    it('should update all cartIds if the user logs in', function(){
      spyOn(Meteor, 'userId');
      spyOn(cartStore, 'getCartId').and.returnValue(123);
      Dispatcher.dispatch({ actionType: "LOGIN_SUCCEED" });
      expect(Meteor.call).toHaveBeenCalledWith(
        'CartStore.updateAllCartIds',
        123
      );
    });
  });

  describe('get', function(){

    it('should retrieve all the items by cartId', function(){
      spyOn(Cart, 'find').and.callFake(function(obj){
        return obj.cart_id;
      });
      spyOn(cartStore, 'getCartId').and.returnValue(123);
      expect(cartStore.getItems()).toBe(123);
    });

    it('should retrieve the userId when the user is logged in', function(){
      spyOn(Meteor, 'userId').and.returnValue(123);
      Dispatcher.dispatch({ actionType: "LOGIN_SUCCEED" });
      expect(cartStore.getCartId()).toBe(123);
    });
  });

});
