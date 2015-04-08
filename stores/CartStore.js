// CartStore Collections
Cart = new Mongo.Collection('cart');

// CartStore Creator
var newCartStore = function(Cart) {

  // Reactive Vars
  if(Meteor.isClient){
    // stores the id used by the cart. A random id or the user id. It's using Sessions so it's not affected by hot reloads
    Session.setDefault("CartStore.cartId", Meteor.userId() || Random.id());
  }

  // CartStore Object
  var CartStore = {
    // Callbacks
    on: {
      addCartItem: function(product_id){
        var cart_id   = Session.get("CartStore.cartId");
        var cart_item = Cart.findOne({product_id: product_id, cart_id: cart_id });
        if ( !cart_item ) {
          Meteor.call('CartStore.addCartItem', product_id, Session.get('CartStore.cartId'));
        } else {
          CartStore.on.increaseCartItem(cart_item._id);
        }
      },
      increaseCartItem: function(id){
        Meteor.call('CartStore.increaseCartItem', id);
      },
      decreaseCartItem: function(id){
        var cart_item = Cart.findOne(id);
        if ( cart_item.quantity === 1 ){
          CartStore.on.removeCartItem(id);
        } else {
          Meteor.call('CartStore.decreaseCartItem', id);
        }
      },
      removeCartItem: function(id){
        Meteor.call('CartStore.removeCartItem', id);
      },
      removeProduct: function(product_id){
        Meteor.call('CartStore.removeProduct', product_id);
      },
      loginSucceed: function(){
        // change all random_ids by userIds
        Meteor.call('CartStore.updateAllCartIds', Session.get("CartStore.cartId"));
        // update our cartId to the userId
        Session.set("CartStore.cartId", Meteor.userId());
      }
    },

    // Getters
    get: {
      items: function(){
        return Cart.find({cart_id: Session.get("CartStore.cartId")});
      },
      productsInCart: function(){
        return CartStore.get.items().fetch();
      },
      cartId: function(){
        return Session.get("CartStore.cartId");
      }
    }

  };

  // CartStore Meteor Methods
  Meteor.methods({
    'CartStore.updateAllCartIds': function(old_id){
      Cart.update({cart_id: old_id},{$set:{cart_id: this.userId}}, {multi:true});
    },
    'CartStore.addCartItem': function(product_id, cart_id){
      Cart.insert({quantity: 1, product_id: product_id, cart_id: cart_id});
    },
    'CartStore.increaseCartItem': function(id){
      Cart.update(id, {$inc: {quantity: 1}});
    },
    'CartStore.decreaseCartItem': function(id){
      Cart.update(id, {$inc: {quantity: -1}});
    },
    'CartStore.removeCartItem': function(id){
      Cart.remove(id);
    },
    'CartStore.removeProduct': function(product_id){
      Cart.remove({product_id: product_id});
    }
  });

  // CartStore Publications
  if (Meteor.isServer) {
    Meteor.publish('Cart.userCart', function(id) {
        return Cart.find({cart_id: id});
    });
  }

  // CartStore Register
  CartStore.tokenId = Dispatcher.register(function(payload){
    switch(payload.actionType){
      case "ADD_CART_ITEM":
        CartStore.on.addCartItem(payload.item._id);
        break;
      case "INCREASE_CART_ITEM":
        CartStore.on.increaseCartItem(payload.item._id);
        break;
      case "DECREASE_CART_ITEM":
        CartStore.on.decreaseCartItem(payload.item._id);
        break;
      case "REMOVE_CART_ITEM":
        CartStore.on.removeCartItem(payload.item._id);
        break;
      case "REMOVE_PRODUCT":
        CartStore.on.removeProduct(payload.product._id);
        break;
      case "LOGIN_SUCCEED":
        CartStore.on.loginSucceed();
        break;
      case "CREATE_ACCOUNT_SUCCEED":
        CartStore.on.loginSucceed();
        break;
    }
  });

  return CartStore;
};

// Create the instance and pass Collections
CartStore = newCartStore(Cart);
