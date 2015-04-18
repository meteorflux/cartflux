// CartStore Methods
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
