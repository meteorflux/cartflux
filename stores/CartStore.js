// CartStore Collections
Cart = new Mongo.Collection('cart');

// CartStore Creator
var newCartStore = function(Cart) {

  // Reactive Vars
  if(Meteor.isClient){
    // stores the id used by the cart. A random id or the user id. Using Sessions so it's not affected by hot reloads
    Session.setDefault("CartStore.cartId", Meteor.userId() || Random.id());
  }

  // CartStore Object
  var CartStore = {
    // Callbacks
    onAddCartItem: function(product_id){
      var cart_id   = Session.get("CartStore.cartId");
      var cart_item = Cart.findOne({product_id: product_id, cart_id: cart_id });
      if ( !cart_item ) {
        Cart.insert({quantity: 1, product_id: product_id, cart_id: Session.get("CartStore.cartId")});
      } else {
        CartStore.onIncreaseCartItem(cart_item._id);
      }
    },
    onIncreaseCartItem: function(id){
      Cart.update(id, {$inc: {quantity: 1}});
    },
    onDecreaseCartItem: function(id){
      var cart_item = Cart.findOne(id);
      if ( cart_item.quantity === 1 ){
        CartStore.onRemoveCartItem(id);
      } else {
        Cart.update(id, {$inc: {quantity: -1}});
      }
    },
    onRemoveCartItem: function(id){
      Cart.remove(id);
    },
    onRemoveProduct: function(product_id){
      CartStore.onRemoveCartItem(Cart.findOne({product_id: product_id}));
    },
    onLoginSucceed: function(){
      // change all random_ids by userIds
      Meteor.call('CartStore.updateAllCartIds', Session.get("CartStore.cartId"));
      // update our cartId to the userId
      Session.set("CartStore.cartId", Meteor.userId());
    },

    // Getters
    getItems: function(){
      return Cart.find({cart_id: Session.get("CartStore.cartId")});
    },
    getItemsArray: function(){
      return CartStore.getItems().fetch();
    },
    getCartId: function(){
      return Session.get("CartStore.cartId");
    }
  };

  // CartStore Methods
  Meteor.methods({
    'CartStore.updateAllCartIds': function(old_id){
      Cart.update({cart_id: old_id},{$set:{cart_id: this.userId}}, {multi:true});
    }
  });

  // CartStore Publications
  if (Meteor.isServer) {
    Meteor.publish('Cart.userCart', function(id) {
        return Cart.find({cart_id: id});
    });
  }

  // CartStore Callbacks
  CartStore.tokenId = Dispatcher.register(function(payload){
    switch(payload.actionType){
      case "ADD_CART_ITEM":
        CartStore.onAddCartItem(payload.item._id);
        break;
      case "INCREASE_CART_ITEM":
        CartStore.onIncreaseCartItem(payload.item._id);
        break;
      case "DECREASE_CART_ITEM":
        CartStore.onDecreaseCartItem(payload.item._id);
        break;
      case "REMOVE_CART_ITEM":
        CartStore.onRemoveCartItem(payload.item._id);
        break;
      case "REMOVE_PRODUCT":
        CartStore.onRemoveProduct(payload.product._id);
        break;
      case "LOGIN_SUCCEED":
        CartStore.onLoginSucceed();
        break;
    }
  });

  return CartStore;
};

// Create the instance and pass Collections
CartStore = newCartStore(Cart);
